from typing import List, Tuple


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