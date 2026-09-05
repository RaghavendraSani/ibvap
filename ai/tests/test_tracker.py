from pathlib import Path

from ai.tracking.track_manager import TrackManager
from ai.tracking.tracker import ObjectTracker


def main():
    image_path = Path("datasets/test_images/test.jpg")

    tracker = ObjectTracker()
    manager = TrackManager()

    for frame_number in range(1, 4):
        tracked_objects = tracker.update(str(image_path))
        tracks = manager.update(tracked_objects)

        print(f"\nFrame {frame_number}")

        for track in tracks.values():
            print(
                f"ID={track.track_id} | "
                f"class={track.class_name} | "
                f"center={track.center} | "
                f"trajectory_length={len(track.trajectory)}"
            )


if __name__ == "__main__":
    main()