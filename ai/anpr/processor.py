from typing import Dict, Optional

from ai.anpr.ocr import PlateOCR
from ai.anpr.plate_detector import PlateDetector
from ai.anpr.schemas import ANPRResult


class ANPRProcessor:
    """
    Coordinates license-plate detection and OCR.

    The processor performs ANPR whenever process() is called.
    Processing frequency is controlled by ANPRManager.
    """

    VEHICLE_CLASSES = {
        "car",
        "motorcycle",
        "bus",
        "truck",
    }

    def __init__(
        self,
        plate_detector: Optional[PlateDetector] = None,
        ocr: Optional[PlateOCR] = None,
        minimum_plate_confidence: float = 0.40,
        minimum_ocr_confidence: float = 0.60,
    ):
        self.plate_detector = (
            plate_detector
            if plate_detector is not None
            else PlateDetector()
        )

        self.ocr = (
            ocr
            if ocr is not None
            else PlateOCR()
        )

        self.minimum_plate_confidence = (
            minimum_plate_confidence
        )

        self.minimum_ocr_confidence = (
            minimum_ocr_confidence
        )

        self.results: Dict[int, ANPRResult] = {}

    def process(
        self,
        track_id: int,
        object_type: str,
        vehicle_crop,
    ) -> ANPRResult:

        if object_type not in self.VEHICLE_CLASSES:
            return ANPRResult(
                track_id=track_id,
                status="not_applicable",
            )

        # Return a successfully recognized result.
        existing = self.results.get(track_id)

        if (
            existing is not None
            and existing.status == "recognized"
        ):
            return existing

        # ---------------------------------------
        # Validate vehicle crop
        # ---------------------------------------

        if vehicle_crop is None:
            result = ANPRResult(
                track_id=track_id,
                status="vehicle_crop_failed",
            )

            self.results[track_id] = result

            return result

        # ---------------------------------------
        # Plate detection
        # ---------------------------------------

        detection = self.plate_detector.detect(
            vehicle_crop
        )

        if detection is None:

            result = ANPRResult(
                track_id=track_id,
                status="plate_not_found",
            )

            self.results[track_id] = result

            return result

        # ---------------------------------------
        # Store detection
        # ---------------------------------------

        result = ANPRResult(
            track_id=track_id,
            status="processing",
            detection_confidence=detection.confidence,
            plate_bbox=detection.bbox,
        )

        if (
            detection.confidence
            < self.minimum_plate_confidence
        ):
            result.status = "plate_low_confidence"

            self.results[track_id] = result

            return result

        # ---------------------------------------
        # Crop plate
        # ---------------------------------------

        plate_crop = self.plate_detector.crop_plate(
            vehicle_crop,
            detection,
        )

        if plate_crop is None:

            result.status = "plate_crop_failed"

            self.results[track_id] = result

            return result

        # ---------------------------------------
        # OCR
        # ---------------------------------------

        ocr_result = self.ocr.read(
            plate_crop
        )

        if ocr_result is None:

            result.status = "ocr_failed"

            self.results[track_id] = result

            return result

        plate_number, ocr_confidence = ocr_result

        result.plate_number = plate_number
        result.plate_confidence = ocr_confidence

        # ---------------------------------------
        # OCR confidence check
        # ---------------------------------------

        if (
            ocr_confidence
            < self.minimum_ocr_confidence
        ):

            result.status = "ocr_low_confidence"

            self.results[track_id] = result

            return result

        # ---------------------------------------
        # Successful recognition
        # ---------------------------------------

        result.status = "recognized"

        self.results[track_id] = result

        return result

    def remove_track(
        self,
        track_id: int,
    ):
        """
        Remove cached ANPR state for a finished track.
        """

        self.results.pop(
            track_id,
            None,
        )

    def clear(self):
        """
        Clear all cached ANPR results.
        """

        self.results.clear()