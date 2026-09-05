from pathlib import Path

from ai.detection.detector import ObjectDetector


def main():
    image_path = Path("datasets/test_images/test.jpg")

    detector = ObjectDetector()

    detections = detector.predict(str(image_path))

    print(f"Image: {image_path}")
    print(f"Device: {detector.device}")
    print(f"Detections: {len(detections)}")

    for detection in detections:
        print(
            f"{detection.class_name:15}"
            f" confidence={detection.confidence:.3f}"
            f" bbox={detection.bbox}"
        )


if __name__ == "__main__":
    main()