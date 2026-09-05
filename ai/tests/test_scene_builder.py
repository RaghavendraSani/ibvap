import time
from pathlib import Path

from ai.pipeline.scene_builder import SceneStateBuilder
from ai.tracking.track_manager import TrackManager
from ai.tracking.tracker import ObjectTracker


def main():
    image_path = Path("datasets/test_images/test.jpg")

    tracker = ObjectTracker()
    manager = TrackManager()

    builder = SceneStateBuilder(camera_id="camera_01")

    tracked_objects = tracker.update(str(image_path))
    tracks = manager.update(tracked_objects)

    # Simulate information that will be populated by
    # future zone, face, and ANPR modules.
    first_track = tracks[1]

    first_track.zone = "restricted_area"
    first_track.identity = "test_person"
    first_track.plate_number = "TEST123"

    scene = builder.build(
        tracks=tracks,
        timestamp=time.time(),
    )

    print(f"\nCamera: {scene.camera_id}")
    print(f"Objects: {len(scene.objects)}")

    for obj in scene.objects:
        print(
            f"ID={obj.track_id} | "
            f"type={obj.object_type} | "
            f"position={obj.position} | "
            f"confidence={obj.confidence:.2f}"
        )

    # Verify state propagation.
    first_scene_object = next(
        obj for obj in scene.objects if obj.track_id == 1
    )

    assert first_scene_object.zone == "restricted_area"
    assert first_scene_object.identity == "test_person"
    assert first_scene_object.plate_number == "TEST123"

    print("\nState propagation test: PASSED")


if __name__ == "__main__":
    main()