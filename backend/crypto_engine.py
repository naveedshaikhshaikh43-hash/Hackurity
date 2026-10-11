import hashlib
import json
from typing import List, Tuple, Dict, Any, Optional

GENESIS_HASH = "0000000000000000000000000000000000000000000000000000000000000000"


def sha256_hex(data: bytes) -> str:
    """Computes SHA-256 hash and returns 64-char lowercase hex string."""
    return hashlib.sha256(data).hexdigest()


def canonical_json_bytes(data: Dict[str, Any]) -> bytes:
    """Serializes a dictionary into canonical JSON bytes with sorted keys."""
    return json.dumps(data, sort_keys=True, separators=(",", ":")).encode("utf-8")


def compute_log_hash(prev_hash: str, log_payload: Dict[str, Any]) -> str:
    """
    Computes a cryptographic log hash in the SHA-256 hash chain:
    H_n = SHA256(prev_hash_bytes + canonical_json(payload))
    """
    payload_bytes = canonical_json_bytes(log_payload)
    combined = bytes.fromhex(prev_hash) + payload_bytes
    return sha256_hex(combined)


def verify_hash_chain(logs: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Verifies the integrity of an entire sequence of chained logs.
    Returns validation status, total logs checked, and breach details if corrupted.
    """
    if not logs:
        return {"is_valid": True, "total_logs": 0, "broken_index": None, "message": "No logs in chain"}

    for i, log in enumerate(logs):
        expected_prev_hash = GENESIS_HASH if i == 0 else logs[i - 1]["current_hash"]
        actual_prev_hash = log.get("previous_hash", "")

        # Check 1: Prev hash linkage
        if actual_prev_hash != expected_prev_hash:
            return {
                "is_valid": False,
                "broken_index": i,
                "log_id": log.get("id"),
                "reason": "PREVIOUS_HASH_MISMATCH",
                "expected_prev_hash": expected_prev_hash,
                "found_prev_hash": actual_prev_hash,
                "message": f"Hash chain broken at log index {i} (Log ID: {log.get('id')}). Prev hash pointer manipulated.",
            }

        # Check 2: Payload hash integrity
        payload = log.get("payload", {})
        recomputed_hash = compute_log_hash(actual_prev_hash, payload)
        stored_hash = log.get("current_hash", "")

        if recomputed_hash != stored_hash:
            return {
                "is_valid": False,
                "broken_index": i,
                "log_id": log.get("id"),
                "reason": "PAYLOAD_TAMPERED",
                "recomputed_hash": recomputed_hash,
                "stored_hash": stored_hash,
                "message": f"Log payload tampered at index {i} (Log ID: {log.get('id')}). Recomputed hash does not match stored hash.",
            }

    return {
        "is_valid": True,
        "total_logs": len(logs),
        "broken_index": None,
        "message": "All hash links cryptographically verified.",
    }


def hash_pair_sorted(a_bytes: bytes, b_bytes: bytes) -> bytes:
    """
    Sorted pair hashing (lexicographical comparison) matching GovLogAnchor.sol:
    if (a <= b) sha256(a + b) else sha256(b + a)
    """
    if a_bytes <= b_bytes:
        return hashlib.sha256(a_bytes + b_bytes).digest()
    else:
        return hashlib.sha256(b_bytes + a_bytes).digest()


class MerkleTree:
    """
    Balanced Binary SHA-256 Merkle Tree compatible with GovLogAnchor.sol
    """

    def __init__(self, leaf_hexes: List[str]):
        if not leaf_hexes:
            raise ValueError("Cannot construct Merkle tree with 0 leaves")

        # Strip optional '0x' prefix and convert to bytes
        clean_hexes = [h[2:] if h.startswith("0x") else h for h in leaf_hexes]
        self.leaf_bytes = [bytes.fromhex(h) for h in clean_hexes]
        self.levels: List[List[bytes]] = [self.leaf_bytes]
        self._build_tree()

    def _build_tree(self):
        current_level = self.leaf_bytes
        while len(current_level) > 1:
            next_level: List[bytes] = []
            for i in range(0, len(current_level), 2):
                if i + 1 < len(current_level):
                    parent = hash_pair_sorted(current_level[i], current_level[i + 1])
                    next_level.append(parent)
                else:
                    # Odd node carries forward
                    next_level.append(current_level[i])
            self.levels.append(next_level)
            current_level = next_level

    @property
    def root(self) -> str:
        """Returns the 0x-prefixed 32-byte Merkle root in hex."""
        return "0x" + self.levels[-1][0].hex()

    def get_proof(self, leaf_index: int) -> List[str]:
        """
        Generates the Merkle audit path proof for the given leaf index.
        Returns array of 0x-prefixed sibling hex hashes.
        """
        if leaf_index < 0 or leaf_index >= len(self.leaf_bytes):
            raise IndexError("Leaf index out of range")

        proof: List[str] = []
        idx = leaf_index

        for level in self.levels[:-1]:
            is_right = (idx % 2 == 1)
            sibling_idx = idx - 1 if is_right else idx + 1

            if sibling_idx < len(level):
                proof.append("0x" + level[sibling_idx].hex())

            idx = idx // 2

        return proof

    @staticmethod
    def verify_proof(root_hex: str, leaf_hex: str, proof: List[str]) -> bool:
        """
        Pure Python verification of SHA-256 Merkle proof (matches Solidity verifyProofSha256).
        """
        root_clean = root_hex[2:] if root_hex.startswith("0x") else root_hex
        leaf_clean = leaf_hex[2:] if leaf_hex.startswith("0x") else leaf_hex

        computed = bytes.fromhex(leaf_clean)

        for p in proof:
            p_clean = p[2:] if p.startswith("0x") else p
            p_bytes = bytes.fromhex(p_clean)
            computed = hash_pair_sorted(computed, p_bytes)

        return computed.hex().lower() == root_clean.lower()
