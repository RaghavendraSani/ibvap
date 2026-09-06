import time
import uuid
from pathlib import Path
from typing import Optional

import cv2

from ai.evidence.schemas import Evidence


class SnapshotManager:

    def __init__(
        self,
        base_dir: str = "evidence",
    ):
        self.base_dir = Path(base_dir)

    def capture(
        self,
        frame,
        incident_id: str,
        event_type: str,
        camera_id: str,
        track_id: Optional[int] = None,
        timestamp: Optional[float] = None,
    ) -> Optional[Evidence]:

        if frame is None:
            return None

        if timestamp is None:
            timestamp = time.time()

        # ---------------------------------------
        # Create date-based directory
        # ---------------------------------------

        date = time.strftime(
            "%Y/%m/%d",
            time.localtime(timestamp),
        )

        output_dir = self.base_dir / date
        output_dir.mkdir(
            parents=True,
            exist_ok=True,
        )

        # ---------------------------------------
        # Generate evidence ID
        # ---------------------------------------

        evidence_id = (
            f"EVD-{uuid.uuid4().hex[:8].upper()}"
        )

        filename = (
            f"{incident_id}_{evidence_id}.jpg"
        )

        image_path = output_dir / filename

        # ---------------------------------------
        # Save snapshot
        # ---------------------------------------

        success = cv2.imwrite(
            str(image_path),
            frame,
        )

        if not success:
            return None

        return Evidence(
            evidence_id=evidence_id,
            incident_id=incident_id,
            event_type=event_type,
            camera_id=camera_id,
            timestamp=timestamp,
            image_path=str(image_path),
            track_id=track_id,
        )