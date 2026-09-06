from dataclasses import dataclass
from typing import Optional, Tuple


@dataclass
class PlateDetection:
    """
    Represents a detected number plate inside a vehicle crop.
    """

    bbox: Tuple[float, float, float, float]
    confidence: float


@dataclass
class ANPRResult:
    """
    Result produced by the ANPR pipeline for a tracked vehicle.
    """

    track_id: int

    status: str = "not_processed"

    plate_number: Optional[str] = None

    plate_confidence: Optional[float] = None

    detection_confidence: Optional[float] = None

    plate_bbox: Optional[
        Tuple[float, float, float, float]
    ] = None

    watchlist_status: Optional[str] = None

    error: Optional[str] = None