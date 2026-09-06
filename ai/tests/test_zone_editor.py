import numpy as np

from ai.ui.zone_editor import ZoneEditor


def main():
    frame = np.zeros(
        (480, 640, 3),
        dtype=np.uint8,
    )

    editor = ZoneEditor()

    zone = editor.edit(frame)

    if zone is None:
        print("Zone editor cancelled.")
        return

    print("Zone editor test: PASSED")
    print(f"Zone ID: {zone.zone_id}")
    print(f"Zone name: {zone.name}")
    print(f"Polygon points: {zone.polygon}")


if __name__ == "__main__":
    main()