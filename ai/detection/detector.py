import torch
from ultralytics import YOLO

from ai.schemas.detection import Detection


class ObjectDetector:
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

    def predict(self, frame) -> list[Detection]:
        results = self.model.predict(
            source=frame,
            device=self.device,
            conf=self.confidence,
            verbose=False,
        )

        result = results[0]
        detections = []

        for box in result.boxes:
            class_id = int(box.cls[0])
            confidence = float(box.conf[0])
            x1, y1, x2, y2 = map(float, box.xyxy[0])

            class_name = self.model.names[class_id]

            detections.append(
                Detection(
                    class_id=class_id,
                    class_name=class_name,
                    confidence=confidence,
                    bbox=(x1, y1, x2, y2),
                )
            )

        return detections