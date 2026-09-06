from dataclasses import dataclass
from typing import List

import torch
from ultralytics import YOLO


@dataclass
class TrackedObject:
    track_id: int
    class_id: int
    class_name: str
    confidence: float
    bbox: tuple[float, float, float, float]


class ObjectTracker:
    ALLOWED_CLASSES = [0, 1, 2, 3, 5, 7]

    def __init__(
        self,
        model_path: str = "ai/models/yolo11n.pt",
        device: str | None = None,
        confidence: float = 0.40,
    ):
        self.model_path = model_path
        self.confidence = confidence

        if device is None:
            device = "cuda:0" if torch.cuda.is_available() else "cpu"

        self.device = device
        self.model = YOLO(model_path)

    def update(self, frame) -> List[TrackedObject]:
        """
        Process one frame using YOLO + ByteTrack.

        persist=True keeps the tracker state across consecutive
        update() calls.
        """

        results = self.model.track(
            source=frame,
            device=self.device,
            conf=self.confidence,
            classes=self.ALLOWED_CLASSES,
            tracker="bytetrack.yaml",
            persist=True,
            verbose=False,
        )

        result = results[0]
        tracked_objects = []

        if result.boxes is None or result.boxes.id is None:
            return tracked_objects

        track_ids = result.boxes.id.int().cpu().tolist()

        for box, track_id in zip(result.boxes, track_ids):
            class_id = int(box.cls[0])
            confidence = float(box.conf[0])

            x1, y1, x2, y2 = map(float, box.xyxy[0])

            tracked_objects.append(
                TrackedObject(
                    track_id=track_id,
                    class_id=class_id,
                    class_name=self.model.names[class_id],
                    confidence=confidence,
                    bbox=(x1, y1, x2, y2),
                )
            )

        return tracked_objects