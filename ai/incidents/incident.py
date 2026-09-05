from dataclasses import dataclass, field
from typing import Any, Dict, Optional


@dataclass
class Incident:
    incident_id: str

    event_type: str
    camera_id: str

    track_id: Optional[int]

    severity: str

    status: str

    created_at: float
    updated_at: float
    resolved_at: Optional[float] = None

    message: str = ""

    metadata: Dict[str, Any] = field(
        default_factory=dict
    )