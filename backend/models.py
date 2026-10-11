from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

class IngestLogRequest(BaseModel):
    department: str = Field(..., description="Government Ministry or Department")
    action: str = Field(..., description="Action taken, e.g. ASSET_TRANSFER")
    actor: str = Field(..., description="Officer or system agent id")
    ip_address: str = Field("10.142.4.92", description="Originating node IP")
    security_level: str = Field("RESTRICTED", description="Security classification")
    payload: Dict[str, Any] = Field(..., description="Structured audit details")

class LogRecord(BaseModel):
    id: str
    sequence_num: int
    batch_id: Optional[int] = None
    index_in_batch: Optional[int] = None
    timestamp: str
    department: str
    action: str
    actor: str
    ip_address: str
    security_level: str
    payload: Dict[str, Any]
    previous_hash: str
    current_hash: str
    merkle_proof: Optional[List[str]] = None
    is_tampered: bool = False
    original_payload: Optional[Dict[str, Any]] = None

class BatchRecord(BaseModel):
    batch_id: int
    merkle_root: str
    log_count: int
    log_ids: List[str]
    timestamp: str
    block_number: int
    tx_hash: str
    metadata_uri: str
    is_on_chain: bool = True

class TamperRequest(BaseModel):
    log_id: str
    tampered_field: str
    new_value: Any
