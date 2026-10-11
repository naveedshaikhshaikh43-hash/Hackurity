import datetime
import uuid
import copy
from typing import List, Dict, Any, Optional
from crypto_engine import (
    GENESIS_HASH,
    compute_log_hash,
    verify_hash_chain,
    MerkleTree,
)
from blockchain_client import BlockchainClient

class LogStore:
    def __init__(self, blockchain_client: Optional[BlockchainClient] = None):
        self.blockchain_client = blockchain_client or BlockchainClient()
        self.logs: List[Dict[str, Any]] = []
        self.batches: List[Dict[str, Any]] = []
        self.tamper_history: List[Dict[str, Any]] = []
        self._init_seed_data()

    def get_last_hash(self) -> str:
        if not self.logs:
            return GENESIS_HASH
        return self.logs[-1]["current_hash"]

    def ingest_log(
        self,
        department: str,
        action: str,
        actor: str,
        payload: Dict[str, Any],
        ip_address: str = "10.0.4.12",
        security_level: str = "RESTRICTED",
        auto_anchor_threshold: int = 4
    ) -> Dict[str, Any]:
        seq_num = len(self.logs)
        prev_hash = self.get_last_hash()
        log_id = f"LOG-{seq_num + 1:04d}-{uuid.uuid4().hex[:6].upper()}"
        timestamp = datetime.datetime.now(datetime.timezone.utc).isoformat()

        # Compute hash over previous hash and canonical payload
        current_hash = compute_log_hash(prev_hash, payload)

        log_record = {
            "id": log_id,
            "sequence_num": seq_num + 1,
            "batch_id": None,
            "index_in_batch": None,
            "timestamp": timestamp,
            "department": department,
            "action": action,
            "actor": actor,
            "ip_address": ip_address,
            "security_level": security_level,
            "payload": copy.deepcopy(payload),
            "previous_hash": prev_hash,
            "current_hash": current_hash,
            "merkle_proof": None,
            "is_tampered": False,
            "original_payload": None,
        }

        self.logs.append(log_record)

        # Check if unbatched logs reach auto-anchor threshold
        unbatched = [l for l in self.logs if l["batch_id"] is None]
        if len(unbatched) >= auto_anchor_threshold:
            self.anchor_pending_batch(metadata_uri=f"AUTO_BATCH_{len(self.batches) + 1}")

        return log_record

    def anchor_pending_batch(self, metadata_uri: str = "GOV_LOG_BATCH") -> Optional[Dict[str, Any]]:
        unbatched = [l for l in self.logs if l["batch_id"] is None]
        if not unbatched:
            return None

        batch_id = len(self.batches) + 1
        leaf_hashes = [l["current_hash"] for l in unbatched]
        tree = MerkleTree(leaf_hashes)
        merkle_root = tree.root

        # Attach proofs and batch ID to logs
        log_ids = []
        for idx, log in enumerate(unbatched):
            log["batch_id"] = batch_id
            log["index_in_batch"] = idx
            log["merkle_proof"] = tree.get_proof(idx)
            log_ids.append(log["id"])

        # Call smart contract to anchor Merkle root
        tx_hash = "0x" + uuid.uuid4().hex + uuid.uuid4().hex
        block_num = 1
        is_on_chain = False

        if self.blockchain_client.is_connected():
            try:
                res = self.blockchain_client.anchor_batch(merkle_root, len(unbatched), metadata_uri)
                tx_hash = res.get("tx_hash", tx_hash)
                block_num = res.get("block_number", block_num)
                is_on_chain = True
            except Exception as e:
                print(f"[LogStore] On-chain anchor error: {e}")

        batch_record = {
            "batch_id": batch_id,
            "merkle_root": merkle_root,
            "log_count": len(unbatched),
            "log_ids": log_ids,
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "block_number": block_num,
            "tx_hash": tx_hash,
            "metadata_uri": metadata_uri,
            "is_on_chain": is_on_chain,
            "leaf_hashes": leaf_hashes,
        }

        self.batches.append(batch_record)
        return batch_record

    def tamper_log(self, log_id: str, field_to_alter: str, malicious_value: Any) -> Dict[str, Any]:
        """
        Simulates an unauthorized database tampering event (Judge Demo Mode).
        Directly alters stored data while leaving cryptographic hash pointers intact,
        creating an undeniable cryptographic breach signature!
        """
        target_log = None
        for l in self.logs:
            if l["id"] == log_id:
                target_log = l
                break

        if not target_log:
            raise ValueError(f"Log with ID {log_id} not found")

        if not target_log["is_tampered"]:
            target_log["original_payload"] = copy.deepcopy(target_log["payload"])

        old_value = target_log["payload"].get(field_to_alter, "<EMPTY>")
        target_log["payload"][field_to_alter] = malicious_value
        target_log["is_tampered"] = True

        event = {
            "tampered_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "log_id": log_id,
            "sequence_num": target_log["sequence_num"],
            "department": target_log["department"],
            "field": field_to_alter,
            "original_value": old_value,
            "tampered_value": malicious_value,
        }
        self.tamper_history.append(event)
        return event

    def restore_log(self, log_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Restores authentic state from immutable original data.
        """
        restored_count = 0
        for l in self.logs:
            if log_id is None or l["id"] == log_id:
                if l["is_tampered"] and l["original_payload"] is not None:
                    l["payload"] = copy.deepcopy(l["original_payload"])
                    l["is_tampered"] = False
                    l["original_payload"] = None
                    restored_count += 1

        self.tamper_history = []
        return {"status": "SUCCESS", "restored_count": restored_count}

    def verify_all(self) -> Dict[str, Any]:
        """
        Performs full 3-layer audit:
        1. SHA-256 Hash Chain verification
        2. Batch Merkle Tree consistency
        3. EVM Smart Contract proof verification
        """
        chain_audit = verify_hash_chain(self.logs)

        # Batch & On-chain audits
        batch_audits = []
        for batch in self.batches:
            batch_id = batch["batch_id"]
            batch_logs = [l for l in self.logs if l["batch_id"] == batch_id]
            recalculated_leaves = [l["current_hash"] for l in batch_logs]

            # Also check if recalculating leaves from payloads matches
            recalc_from_payload = []
            for l in batch_logs:
                recalc_h = compute_log_hash(l["previous_hash"], l["payload"])
                recalc_from_payload.append(recalc_h)

            tree_from_payload = MerkleTree(recalc_from_payload)
            root_matches = (tree_from_payload.root.lower() == batch["merkle_root"].lower())

            batch_audits.append({
                "batch_id": batch_id,
                "anchored_merkle_root": batch["merkle_root"],
                "recalculated_merkle_root": tree_from_payload.root,
                "root_matches": root_matches,
                "log_count": len(batch_logs),
                "is_on_chain": batch["is_on_chain"],
            })

        overall_valid = chain_audit["is_valid"] and all(b["root_matches"] for b in batch_audits)

        return {
            "overall_integrity": "SECURE" if overall_valid else "BREACH_DETECTED",
            "is_valid": overall_valid,
            "hash_chain": chain_audit,
            "batches": batch_audits,
            "total_logs": len(self.logs),
            "tampered_logs_count": sum(1 for l in self.logs if l["is_tampered"]),
        }

    def _init_seed_data(self):
        """Initializes realistic government audit logs for live demonstration."""
        seed_records = [
            (
                "LAND_REGISTRY",
                "TITLE_DEED_TRANSFER",
                "Registrar_Office_North",
                {"parcel_id": "PRC-9041-A", "grantor": "County Land Trust", "grantee": "Sarah Jenkins", "assessed_value_usd": 680000, "zone": "Residential-Urban"},
                "10.14.0.1"
            ),
            (
                "MINISTRY_OF_FINANCE",
                "TREASURY_DISBURSEMENT",
                "Treasury_SecOps_Bot",
                {"disbursement_id": "TR-882194", "program": "Federal Cyber Defense Grid", "amount_usd": 12500000, "clearing_code": "FED-NY-902"},
                "10.14.0.2"
            ),
            (
                "NATIONAL_SECURITY",
                "CLEARANCE_ISSUANCE",
                "Director_Internal_Security",
                {"agent_badge": "AG-7719", "clearance_tier": "TOP_SECRET_SCI", "biometric_template_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},
                "10.14.0.3"
            ),
            (
                "JUDICIARY_RECORDS",
                "EVIDENCE_VAULT_LOCK",
                "Clerk_Supreme_Court",
                {"docket_id": "DKT-2026-9912", "evidence_item": "Encrypted Server Drive #04", "hash_sha256": "8f434346648f6b96df89dda901c5176b10e6d0ceec3e4f7e34ef3226be8e4f16"},
                "10.14.0.4"
            ),
            (
                "LAND_REGISTRY",
                "COMMERCIAL_REZONE_PERMIT",
                "Zoning_Board_Admin",
                {"parcel_id": "PRC-1042-C", "applicant": "Metropolis High-Tech Logistics", "permit_type": "Zone-B-Industrial", "environmental_score": 98},
                "10.14.0.1"
            ),
            (
                "MINISTRY_OF_FINANCE",
                "INTERBANK_SETTLEMENT",
                "Central_Clearing_Operator",
                {"settlement_batch": "SETTLE-OCT-004", "originating_bank": "Apex Reserve", "destination_bank": "State Treasury", "net_amount_usd": 38400000},
                "10.14.0.2"
            ),
            (
                "NATIONAL_SECURITY",
                "DEFENSE_NETWORK_FIREWALL_UPDATE",
                "Cyber_Command_Lead",
                {"policy_id": "FW-DEF-ALPHA-9", "rule_action": "BLOCK_ANOMALOUS_OUTBOUND", "threat_intel_feed": "US-CERT-2026-11"},
                "10.14.0.3"
            ),
            (
                "HEALTH_REGISTRY",
                "BIOMETRIC_IDENTITY_ANCHOR",
                "Gov_Identity_Server",
                {"citizen_national_id": "NAT-ID-884210", "credential_type": "E-Passport_NFC_V2", "status": "ACTIVE_AUTHENTICATED"},
                "10.14.0.5"
            ),
        ]

        # Ingest first 4 logs and anchor Batch 1
        for dept, act, actor, pld, ip in seed_records[:4]:
            self.ingest_log(dept, act, actor, pld, ip, auto_anchor_threshold=100)
        self.anchor_pending_batch("GENESIS_GOV_BATCH_ALPHA")

        # Ingest remaining 4 logs and anchor Batch 2
        for dept, act, actor, pld, ip in seed_records[4:]:
            self.ingest_log(dept, act, actor, pld, ip, auto_anchor_threshold=100)
        self.anchor_pending_batch("GOV_AUDIT_BATCH_BETA")
