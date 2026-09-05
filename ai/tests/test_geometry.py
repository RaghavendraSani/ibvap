from ai.events.geometry import point_in_polygon


def main():
    polygon = [
        (100, 100),
        (300, 100),
        (300, 250),
        (100, 250),
    ]

    inside_point = (200, 175)
    outside_point = (50, 50)

    assert point_in_polygon(inside_point, polygon) is True
    assert point_in_polygon(outside_point, polygon) is False

    print("Point-in-polygon test: PASSED")


if __name__ == "__main__":
    main()