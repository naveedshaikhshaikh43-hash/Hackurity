import json
import os
import requests
from typing import List, Dict, Any, Optional

DEFAULT_RPC_URL = "http://127.0.0.1:8545"

class BlockchainClient:
    def __init__(self, rpc_url: str = DEFAULT_RPC_URL, deployment_path: Optional[str] = None):
        self.rpc_url = rpc_url
        if deployment_path is None:
            deployment_path = os.path.join(os.path.dirname(__file__), "contract_deployment.json")
        self.deployment_path = deployment_path
        self.contract_address = None
        self.load_deployment()

    def load_deployment(self):
        if os.path.exists(self.deployment_path):
            try:
                with open(self.deployment_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.contract_address = data.get("contractAddress")
            except Exception as e:
                print(f"[BlockchainClient] Error loading deployment: {e}")

    def _rpc(self, method: str, params: list = None) -> Any:
        if params is None:
            params = []
        payload = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": method,
            "params": params
        }
        res = requests.post(self.rpc_url, json=payload, timeout=5)
        res.raise_for_status()
        body = res.json()
        if "error" in body:
            raise RuntimeError(body["error"])
        return body.get("result")

    def is_connected(self) -> bool:
        try:
            self._rpc("eth_blockNumber")
            return True
        except Exception:
            return False

    def get_block_number(self) -> int:
        res = self._rpc("eth_blockNumber")
        return int(res, 16)

    def get_accounts(self) -> List[str]:
        return self._rpc("eth_accounts")

    def get_total_batches(self) -> int:
        if not self.contract_address:
            return 0
        data = "0x69ff6abb"  # totalBatches()
        res = self._rpc("eth_call", [{"to": self.contract_address, "data": data}, "latest"])
        return int(res, 16) if res and res != "0x" else 0

    def anchor_batch(self, merkle_root_hex: str, log_count: int, metadata_uri: str) -> Dict[str, Any]:
        """
        Calls anchorBatch(bytes32,uint256,string)
        Selector: 0xa1acc3e7
        """
        if not self.contract_address:
            raise ValueError("Contract address not loaded")

        root_clean = merkle_root_hex[2:] if merkle_root_hex.startswith("0x") else merkle_root_hex
        root_padded = root_clean.rjust(64, "0")

        count_padded = hex(log_count)[2:].rjust(64, "0")

        # Offset to string is 3 * 32 = 96 bytes (0x60)
        offset_string = hex(96)[2:].rjust(64, "0")

        meta_bytes = metadata_uri.encode("utf-8")
        meta_len_padded = hex(len(meta_bytes))[2:].rjust(64, "0")

        meta_hex = meta_bytes.hex()
        # Pad to multiple of 32 bytes (64 hex characters)
        rem = len(meta_hex) % 64
        if rem != 0:
            meta_hex = meta_hex + "0" * (64 - rem)

        calldata = "0xa1acc3e7" + root_padded + count_padded + offset_string + meta_len_padded + meta_hex

        accounts = self.get_accounts()
        from_acc = accounts[0] if accounts else "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"

        tx_payload = {
            "from": from_acc,
            "to": self.contract_address,
            "data": calldata,
            "gas": "0x100000"
        }

        tx_hash = self._rpc("eth_sendTransaction", [tx_payload])

        # Get transaction receipt
        receipt = self._rpc("eth_getTransactionReceipt", [tx_hash])
        block_num = int(receipt.get("blockNumber", "0x0"), 16) if receipt else self.get_block_number()

        return {
            "tx_hash": tx_hash,
            "block_number": block_num,
            "contract_address": self.contract_address,
            "merkle_root": "0x" + root_clean,
            "log_count": log_count,
            "metadata_uri": metadata_uri,
            "status": "CONFIRMED"
        }

    def verify_log_on_chain(self, batch_id: int, leaf_hash_hex: str, proof: List[str]) -> bool:
        """
        Calls verifyLog(uint256,bytes32,bytes32[])
        Selector: 0x4469a733
        """
        if not self.contract_address:
            return False

        batch_id_padded = hex(batch_id)[2:].rjust(64, "0")

        leaf_clean = leaf_hash_hex[2:] if leaf_hash_hex.startswith("0x") else leaf_hash_hex
        leaf_padded = leaf_clean.rjust(64, "0")

        # Offset to dynamic array proof is 3 * 32 = 96 bytes (0x60)
        offset_proof = hex(96)[2:].rjust(64, "0")

        proof_len_padded = hex(len(proof))[2:].rjust(64, "0")

        proof_elements = ""
        for p in proof:
            p_clean = p[2:] if p.startswith("0x") else p
            proof_elements += p_clean.rjust(64, "0")

        calldata = "0x4469a733" + batch_id_padded + leaf_padded + offset_proof + proof_len_padded + proof_elements

        try:
            res = self._rpc("eth_call", [{"to": self.contract_address, "data": calldata}, "latest"])
            # Returns boolean: 32 bytes 0x00...01 or 0x00...00
            if res and len(res) >= 66:
                int_val = int(res[-2:], 16)
                return int_val == 1
            return False
        except Exception as e:
            print(f"[BlockchainClient] Error verifying log on-chain: {e}")
            return False
