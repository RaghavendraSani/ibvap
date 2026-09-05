from dataclasses import dataclass, field
from typing import Any, Dict, Optional


@dataclass
class SecurityEvent:
    event_type: str
    camera_id: str
    timestamp: float

    track_id: Optional[int] = None

    severity: str = "medium"

    message: str = ""

    metadata: Dict[str, Any] = field(default_factory=dict)