from typing import List, Tuple
import math


Point = Tuple[float, float]


def point_in_polygon(point: Point, polygon: List[Point]) -> bool:
    x, y = point

    inside = False

    j = len(polygon) - 1

    for i in range(len(polygon)):
        xi, yi = polygon[i]
        xj, yj = polygon[j]

        intersects = (
            (yi > y) != (yj > y)
            and x < (xj - xi) * (y - yi) / (yj - yi) + xi
        )

        if intersects:
            inside = not inside

        j = i

    return inside

def point_distance(
    point_a: Point,
    point_b: Point,
) -> float:
    return math.sqrt(
        (point_a[0] - point_b[0]) ** 2
        + (point_a[1] - point_b[1]) ** 2
    )