from dataclasses import dataclass, field
from typing import List, Optional, Tuple


@dataclass
class TrackState:
    track_id: int
    class_id: int
    class_name: str

    bbox: Tuple[float, float, float, float]
    confidence: float

    first_seen: float
    last_seen: float

    trajectory: List[Tuple[float, float]] = field(default_factory=list)

    zone: Optional[str] = None

    face_status: str = "not_processed"
    identity: Optional[str] = None

    loitering_status: bool = False
    intrusion_status: bool = False

    plate_status: str = "not_processed"
    plate_number: Optional[str] = None
    plate_confidence: Optional[float] = None
    plate_detection_confidence: Optional[float] = None
    plate_bbox: Optional[
        Tuple[float, float, float, float]
    ] = None
    watchlist_status: Optional[str] = None

    missed_frames: int = 0

    @property
    def center(self) -> Tuple[float, float]:
        x1, y1, x2, y2 = self.bbox

        center_x = (x1 + x2) / 2
        center_y = (y1 + y2) / 2

        return center_x, center_y