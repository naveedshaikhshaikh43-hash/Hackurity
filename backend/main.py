from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, Dict, Any, List
import random
import datetime

from models import IngestLogRequest, TamperRequest
from store import LogStore
from blockchain_client import BlockchainClient

app = FastAPI(
    title="Byte Forge - GovLogAnchor API",
    description="Cryptographic Hash-Chain & EVM Merkle Root Ingestion Engine for Government Auditing",
    version="1.0.0",
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = BlockchainClient()
store = LogStore(blockchain_client=client)


@app.get("/health")
def health_check():
    return {
        "status": "HEALTHY",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "evm_connected": client.is_connected(),
        "contract_address": client.contract_address,
    }


@app.get("/api/stats")
def get_stats():
    evm_online = client.is_connected()
    block_num = client.get_block_number() if evm_online else 0
    verification = store.verify_all()

    return {
        "system_status": "ONLINE",
        "chain_integrity": verification["overall_integrity"],
        "is_valid": verification["is_valid"],
        "total_logs": len(store.logs),
        "total_batches": len(store.batches),
        "tampered_logs_count": verification["tampered_logs_count"],
        "evm_network": {
            "connected": evm_online,
            "block_number": block_num,
            "contract_address": client.contract_address,
            "network_name": "Hardhat Localhost (ChainID: 31337)",
        },
    }


@app.get("/api/logs")
def get_logs(department: Optional[str] = None, batch_id: Optional[int] = None):
    results = store.logs
    if department:
        results = [l for l in results if l["department"].upper() == department.upper()]
    if batch_id is not None:
        results = [l for l in results if l.get("batch_id") == batch_id]
    return {"logs": results, "count": len(results)}


@app.get("/api/logs/{log_id}")
def get_log_by_id(log_id: str):
    for l in store.logs:
        if l["id"] == log_id:
            # Check individual validity
            from crypto_engine import compute_log_hash
            recomputed = compute_log_hash(l["previous_hash"], l["payload"])
            is_intact = (recomputed == l["current_hash"])
            return {
                "log": l,
                "recomputed_hash": recomputed,
                "is_intact": is_intact,
            }
    raise HTTPException(status_code=404, detail="Log not found")


@app.post("/api/logs/ingest")
def ingest_log(req: IngestLogRequest):
    log_record = store.ingest_log(
        department=req.department,
        action=req.action,
        actor=req.actor,
        payload=req.payload,
        ip_address=req.ip_address,
        security_level=req.security_level,
    )
    return {"status": "INGESTED", "log": log_record}


@app.post("/api/logs/simulate_feed")
def simulate_incoming_feed():
    """Generates a realistic live incoming government event."""
    sample_events = [
        (
            "LAND_REGISTRY",
            "MORTGAGE_LIEN_RELEASE",
            "Notary_District_4",
            {"lien_id": f"LN-{random.randint(1000, 9999)}", "property_parcel": f"PRC-{random.randint(100, 999)}", "lender": "First Federal Bank", "status": "SATISFIED"},
        ),
        (
            "MINISTRY_OF_FINANCE",
            "MUNICIPAL_BOND_COUPON_PAYOUT",
            "Fiscal_Automator",
            {"series_id": f"BOND-2026-{random.randint(10, 99)}", "investors_settled": random.randint(120, 850), "total_disbursed_usd": random.randint(500000, 5000000)},
        ),
        (
            "NATIONAL_SECURITY",
            "CRYPTOGRAPHIC_KEY_ROTATION",
            "HSM_Controller_Node",
            {"hsm_slot": random.randint(1, 16), "algorithm": "ED25519-AESGCM", "epoch": random.randint(100, 500)},
        ),
        (
            "JUDICIARY_RECORDS",
            "SUBPOENA_EXECUTION_STAMP",
            "Federal_Marshal_Liaison",
            {"case_number": f"CR-2026-{random.randint(2000, 9000)}", "target_entity": "Apex Data Corp", "jurisdiction": "District Court #2"},
        ),
        (
            "HEALTH_REGISTRY",
            "VACCINE_SUPPLY_BATCH_VERIFY",
            "CDC_Logistics_Daemon",
            {"batch_serial": f"VAX-LOT-{random.randint(10000, 99999)}", "cold_chain_temp_c": -78.4, "status": "INTEGRITY_VERIFIED"},
        ),
    ]

    dept, act, actor, pld = random.choice(sample_events)
    log_rec = store.ingest_log(
        department=dept,
        action=act,
        actor=actor,
        payload=pld,
        ip_address=f"10.{random.randint(1, 50)}.{random.randint(1, 20)}.{random.randint(1, 250)}",
    )
    return {"status": "INGESTED", "log": log_rec}


@app.post("/api/batches/anchor")
def trigger_batch_anchor():
    batch = store.anchor_pending_batch(metadata_uri=f"MANUAL_BATCH_{len(store.batches) + 1}")
    if not batch:
        return {"status": "NO_PENDING_LOGS", "message": "All current logs are already anchored into batches."}
    return {"status": "ANCHORED", "batch": batch}


@app.get("/api/batches")
def get_batches():
    return {"batches": store.batches, "total": len(store.batches)}


@app.get("/api/batches/{batch_id}")
def get_batch_by_id(batch_id: int):
    for b in store.batches:
        if b["batch_id"] == batch_id:
            batch_logs = [l for l in store.logs if l.get("batch_id") == batch_id]
            return {"batch": b, "logs": batch_logs}
    raise HTTPException(status_code=404, detail="Batch not found")


@app.get("/api/verify/chain")
def verify_chain():
    result = store.verify_all()
    return result


@app.post("/api/verify/log")
def verify_specific_log(data: Dict[str, str]):
    log_id = data.get("log_id")
    if not log_id:
        raise HTTPException(status_code=400, detail="log_id required")

    target = None
    for l in store.logs:
        if l["id"] == log_id:
            target = l
            break

    if not target:
        raise HTTPException(status_code=404, detail="Log not found")

    from crypto_engine import compute_log_hash, MerkleTree

    # 1. Check local hash computation
    recomputed_leaf = compute_log_hash(target["previous_hash"], target["payload"])
    leaf_matches_stored = (recomputed_leaf == target["current_hash"])

    # 2. Check Merkle Proof if anchored
    merkle_valid_python = False
    merkle_valid_onchain = False
    batch_info = None

    if target.get("batch_id") is not None and target.get("merkle_proof"):
        for b in store.batches:
            if b["batch_id"] == target["batch_id"]:
                batch_info = b
                break

        if batch_info:
            # Merkle verification using python
            merkle_valid_python = MerkleTree.verify_proof(
                root_hex=batch_info["merkle_root"],
                leaf_hex=recomputed_leaf,
                proof=target["merkle_proof"],
            )

            # On-chain verification using EVM smart contract
            if client.is_connected() and batch_info["is_on_chain"]:
                try:
                    merkle_valid_onchain = client.verify_log_on_chain(
                        batch_id=target["batch_id"],
                        leaf_hash_hex=recomputed_leaf,
                        proof=target["merkle_proof"],
                    )
                except Exception as e:
                    print(f"EVM verification error: {e}")

    overall_valid = leaf_matches_stored and merkle_valid_python and (merkle_valid_onchain if client.is_connected() else True)

    return {
        "log_id": target["id"],
        "is_valid": overall_valid,
        "is_tampered": target.get("is_tampered", False),
        "leaf_matches_stored": leaf_matches_stored,
        "stored_hash": target["current_hash"],
        "recomputed_hash": recomputed_leaf,
        "merkle_verification_python": merkle_valid_python,
        "merkle_verification_evm_contract": merkle_valid_onchain,
        "batch_id": target.get("batch_id"),
        "anchored_root": batch_info["merkle_root"] if batch_info else None,
        "proof": target.get("merkle_proof"),
    }


@app.post("/api/tamper/simulate")
def simulate_tamper(req: Optional[TamperRequest] = None):
    """
    Hackathon Judge Mode:
    Simulates malicious SQL injection or unauthorized backend modification.
    """
    # If no specific log is passed, choose the prominent Land Registry or Treasury log
    if req is None or not req.log_id:
        target_log = store.logs[0]  # Land Registry deed
        log_id = target_log["id"]
        field = "grantee"
        malicious_val = "UNAUTHORIZED_OFFSHORE_SYNDICATE_0xBAD"
    else:
        log_id = req.log_id
        field = req.tampered_field
        malicious_val = req.new_value

    try:
        event = store.tamper_log(log_id, field, malicious_val)
        return {
            "status": "TAMPER_EVENT_INJECTED",
            "message": "Government log maliciously altered in local database! Hash chain and Merkle root now compromised.",
            "details": event,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/tamper/restore")
def restore_tamper():
    """Restores database back to authentic cryptographic truth."""
    res = store.restore_log()
    return {
        "status": "RESTORED",
        "message": "All government logs restored to authentic cryptographically anchored state.",
        "details": res,
    }
