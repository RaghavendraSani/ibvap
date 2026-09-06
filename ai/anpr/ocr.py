import re
from typing import Optional

import cv2
import easyocr
import torch


class PlateOCR:
    """
    OCR engine for reading text from detected license-plate crops.

    The OCR model is loaded once and reused for subsequent requests.
    """

    def __init__(
        self,
        languages: list[str] | None = None,
        gpu: bool | None = None,
        minimum_confidence: float = 0.30,
    ):
        if languages is None:
            languages = ["en"]

        if gpu is None:
            gpu = torch.cuda.is_available()

        self.languages = languages
        self.gpu = gpu
        self.minimum_confidence = minimum_confidence

        self.reader = easyocr.Reader(
            languages,
            gpu=gpu,
        )

    def read(
        self,
        plate_crop,
    ) -> Optional[tuple[str, float]]:
        """
        Read a license plate crop.

        Returns:
            (text, confidence)
            or None when no reliable text is found.
        """

        if plate_crop is None:
            return None

        if not hasattr(plate_crop, "size"):
            raise TypeError(
                "plate_crop must be a NumPy array"
            )

        if plate_crop.size == 0:
            return None

        processed = self._preprocess(plate_crop)

        results = self.reader.readtext(
            processed,
            detail=1,
            paragraph=False,
            allowlist="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        )

        if not results:
            return None

        candidates = []

        for _, text, confidence in results:
            normalized = self.normalize(text)

            if not normalized:
                continue

            confidence = float(confidence)

            if confidence < self.minimum_confidence:
                continue

            candidates.append(
                (normalized, confidence)
            )

        if not candidates:
            return None

        # Select the highest-confidence OCR result.
        return max(
            candidates,
            key=lambda item: item[1],
        )

    @staticmethod
    def _preprocess(plate_crop):
        """
        Prepare a plate crop for OCR.
        """

        gray = cv2.cvtColor(
            plate_crop,
            cv2.COLOR_BGR2GRAY,
        )

        # Increase the size of small plate crops.
        height, width = gray.shape[:2]

        scale = 3

        resized = cv2.resize(
            gray,
            (width * scale, height * scale),
            interpolation=cv2.INTER_CUBIC,
        )

        # Improve local contrast.
        enhanced = cv2.equalizeHist(resized)

        return enhanced

    @staticmethod
    def normalize(text: str) -> str:
        """
        Normalize OCR output into a vehicle-plate-friendly form.
        """

        text = text.upper()

        # Remove spaces, punctuation and other non-alphanumeric
        # characters.
        text = re.sub(
            r"[^A-Z0-9]",
            "",
            text,
        )

        return text