from dataclasses import dataclass
from typing import Tuple


@dataclass
class Detection:
    class_id: int
    class_name: str
    confidence: float
    bbox: Tuple[float, float, float, float]