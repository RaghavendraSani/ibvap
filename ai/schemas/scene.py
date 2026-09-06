from dataclasses import dataclass, field
from typing import List, Optional, Tuple


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

    # ---------------------------------------
    # Zone / movement information
    # ---------------------------------------

    zone: Optional[str] = None
    speed: Optional[float] = None
    direction: Optional[str] = None

    # ---------------------------------------
    # Vehicle information
    # ---------------------------------------

    vehicle_type: Optional[str] = None

    # ---------------------------------------
    # ANPR information
    # ---------------------------------------

    plate_number: Optional[str] = None
    plate_confidence: Optional[float] = None
    plate_detection_confidence: Optional[float] = None

    plate_bbox: Optional[
        Tuple[float, float, float, float]
    ] = None

    plate_status: str = "not_processed"

    watchlist_status: Optional[str] = None


@dataclass
class SceneState:
    camera_id: str
    timestamp: float
    objects: List[SceneObject] = field(
        default_factory=list
    )