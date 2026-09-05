from typing import Optional

import cv2
import torch
from ultralytics import YOLO

from ai.anpr.schemas import PlateDetection


class PlateDetector:
    """
    Detects license plates inside vehicle crops.

    Plate detection is intentionally separate from the primary
    person/vehicle detector because license plates are not part
    of the COCO classes used by our primary YOLO model.
    """

    def __init__(
        self,
        model_path: str = "ai/models/license-plate-finetune-v1n.pt",
        confidence: float = 0.40,
        device: str | None = None,
    ):
        self.model_path = model_path
        self.confidence = confidence

        if device is None:
            device = "cuda:0" if torch.cuda.is_available() else "cpu"

        self.device = device
        self.model = YOLO(model_path)

    def detect(
        self,
        vehicle_frame,
    ) -> Optional[PlateDetection]:
        """
        Detect the highest-confidence license plate
        inside a vehicle crop.
        """

        if vehicle_frame is None:
            return None

        if not hasattr(vehicle_frame, "size"):
            raise TypeError(
                "vehicle_frame must be a NumPy array"
            )

        if vehicle_frame.size == 0:
            return None

        results = self.model.predict(
            source=vehicle_frame,
            device=self.device,
            conf=self.confidence,
            verbose=False,
        )

        if not results:
            return None

        result = results[0]

        if result.boxes is None or len(result.boxes) == 0:
            return None

        best_box = None
        best_confidence = 0.0

        for box in result.boxes:
            confidence = float(box.conf[0])

            if confidence > best_confidence:
                best_confidence = confidence
                best_box = box

        if best_box is None:
            return None

        x1, y1, x2, y2 = map(
            float,
            best_box.xyxy[0],
        )

        return PlateDetection(
            bbox=(x1, y1, x2, y2),
            confidence=best_confidence,
        )

    @staticmethod
    def crop_plate(
        vehicle_frame,
        detection: PlateDetection,
    ):
        """
        Crop the detected plate from the vehicle image.
        """

        if vehicle_frame is None:
            return None

        height, width = vehicle_frame.shape[:2]

        x1, y1, x2, y2 = detection.bbox

        x1 = max(0, min(int(x1), width))
        y1 = max(0, min(int(y1), height))
        x2 = max(0, min(int(x2), width))
        y2 = max(0, min(int(y2), height))

        if x2 <= x1 or y2 <= y1:
            return None

        return vehicle_frame[y1:y2, x1:x2]