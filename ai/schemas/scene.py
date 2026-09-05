from dataclasses import dataclass
from typing import List, Optional, Tuple
from dataclasses import dataclass, field

@dataclass
class SceneObject:
    track_id: int
    object_type: str
    position: Tuple[float, float]

    bbox: Tuple[float, float, float, float]
    confidence: float

    first_seen: float
    last_seen: float

    trajectory: List[Tuple[float, float]] = field(
        default_factory=list
    )

    zone: Optional[str] = None
    speed: Optional[float] = None
    direction: Optional[str] = None

    vehicle_type: Optional[str] = None
    plate: Optional[str] = None

    identity: Optional[str] = None


@dataclass
class SceneState:
    camera_id: str
    timestamp: float
    objects: List[SceneObject]