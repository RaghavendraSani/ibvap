from dataclasses import dataclass
from typing import List, Tuple


Point = Tuple[float, float]


@dataclass
class Zone:
    zone_id: str
    name: str
    polygon: List[Point]