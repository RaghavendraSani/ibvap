import time
from pathlib import Path

import cv2
import numpy as np

from ai.evidence.snapshot import SnapshotManager


def main():

    frame = np.zeros(
        (480, 640, 3),
        dtype=np.uint8,
    )

    manager = SnapshotManager(
        base_dir="evidence_test"
    )

    evidence = manager.capture(
        frame=frame,
        incident_id="INC-TEST001",
        event_type="INTRUSION",
        camera_id="camera_01",
        track_id=1,
        timestamp=time.time(),
    )

    assert evidence is not None
    assert evidence.evidence_id.startswith("EVD-")
    assert evidence.incident_id == "INC-TEST001"
    assert evidence.track_id == 1
    assert Path(evidence.image_path).exists()

    print("Evidence ID:", evidence.evidence_id)
    print("Image:", evidence.image_path)
    print("\nEvidence snapshot test: PASSED")


if __name__ == "__main__":
    main()