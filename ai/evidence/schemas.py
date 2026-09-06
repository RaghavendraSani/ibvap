from dataclasses import dataclass
from typing import Optional


@dataclass
class Evidence:
    evidence_id: str
    incident_id: str
    event_type: str
    camera_id: str
    timestamp: float
    image_path: str
    track_id: Optional[int] = None