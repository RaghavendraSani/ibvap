import cv2

from ai.anpr.manager import ANPRManager
from ai.tracking.track_state import TrackState


TEST_IMAGE = "datasets/test_images/test.jpg"


def main():
    print("Starting ANPR manager test...")

    frame = cv2.imread(TEST_IMAGE)

    if frame is None:
        raise RuntimeError(
            f"Could not load test image: {TEST_IMAGE}"
        )

    # ---------------------------------------
    # Create a vehicle track
    # ---------------------------------------

    track = TrackState(
        track_id=1,
        class_id=2,
        class_name="car",
        bbox=(100.0, 100.0, 400.0, 300.0),
        confidence=0.90,
        first_seen=0.0,
        last_seen=0.0,
    )

    # ---------------------------------------
    # Create ANPR manager
    # ---------------------------------------

    manager = ANPRManager()

    # ---------------------------------------
    # Run ANPR
    # ---------------------------------------

    manager.update(
        tracks=[track],
        frame=frame,
    )

    # ---------------------------------------
    # Display result
    # ---------------------------------------

    print()
    print("ANPR Manager Result")
    print("-------------------")
    print(f"Track ID: {track.track_id}")
    print(f"Vehicle: {track.class_name}")
    print(f"Status: {track.plate_status}")
    print(f"Plate: {track.plate_number}")
    print(
        f"Plate confidence: "
        f"{track.plate_confidence}"
    )
    print(
        f"Detection confidence: "
        f"{track.plate_detection_confidence}"
    )
    print(f"Plate bbox: {track.plate_bbox}")

    # ---------------------------------------
    # Assertions
    # ---------------------------------------

    assert track.plate_status == "recognized"
    assert track.plate_number is not None
    assert track.plate_confidence is not None
    assert track.plate_detection_confidence is not None
    assert track.plate_bbox is not None

    print()
    print("ANPR manager test: PASSED")


if __name__ == "__main__":
    main()