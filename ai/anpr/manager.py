from typing import Dict, Iterable

import cv2

from ai.anpr.processor import ANPRProcessor
from ai.tracking.track_state import TrackState


class ANPRManager:
    """
    Integrates ANPR with persistent vehicle tracks.

    ANPR is intentionally conditional:
    - Only vehicle classes are processed.
    - The vehicle bounding box is cropped from the current frame.
    - A successfully recognized plate is not processed again
      for the same track.
    - Failed attempts are retried after a configurable number
      of frames.
    """

    VEHICLE_CLASSES = {
        "car",
        "motorcycle",
        "bus",
        "truck",
    }

    RETRY_INTERVAL_FRAMES = 15

    def __init__(
        self,
        processor: ANPRProcessor | None = None,
    ):
        self.processor = processor or ANPRProcessor()

        self._attempt_counters: Dict[int, int] = {}
        self._completed_tracks: set[int] = set()

    def _crop_vehicle(
        self,
        frame,
        track: TrackState,
    ):
        """
        Crop the tracked vehicle from the current frame.
        """

        if frame is None:
            return None

        frame_height, frame_width = frame.shape[:2]

        x1, y1, x2, y2 = track.bbox

        # Convert to integer pixel coordinates.
        x1 = max(0, int(x1))
        y1 = max(0, int(y1))
        x2 = min(frame_width, int(x2))
        y2 = min(frame_height, int(y2))

        # Invalid bounding box.
        if x2 <= x1 or y2 <= y1:
            return None

        return frame[y1:y2, x1:x2]

    def update(
        self,
        tracks: Iterable[TrackState],
        frame,
    ) -> None:
        """
        Run conditional ANPR on currently active vehicle tracks.

        Results are written directly into each TrackState.
        """

        active_track_ids = set()

        for track in tracks:

            active_track_ids.add(track.track_id)

            # ---------------------------------------
            # Only process supported vehicle classes
            # ---------------------------------------

            if track.class_name not in self.VEHICLE_CLASSES:
                continue

            # ---------------------------------------
            # Already successfully recognized
            # ---------------------------------------

            if track.track_id in self._completed_tracks:
                continue

            # ---------------------------------------
            # Count ANPR attempts
            # ---------------------------------------

            counter = self._attempt_counters.get(
                track.track_id,
                0,
            )

            counter += 1

            self._attempt_counters[track.track_id] = counter

            # Don't run ANPR every frame.
            if counter > 1 and (
                counter % self.RETRY_INTERVAL_FRAMES != 0
            ):
                continue

            # ---------------------------------------
            # Crop vehicle
            # ---------------------------------------

            vehicle_crop = self._crop_vehicle(
                frame,
                track,
            )

            if vehicle_crop is None:
                track.plate_status = "vehicle_crop_failed"
                continue

            # ---------------------------------------
            # Mark processing state
            # ---------------------------------------

            track.plate_status = "processing"

            # ---------------------------------------
            # Run ANPR on VEHICLE CROP
            # ---------------------------------------

            try:

                result = self.processor.process(
                    track.track_id,
                    track.class_name,
                    vehicle_crop,
                )

            except Exception as exc:

                # ANPR must NEVER crash the main
                # surveillance pipeline.
                track.plate_status = "error"

                print(
                    f"[ANPR] Track {track.track_id} "
                    f"processing error: {exc}"
                )

                continue

            # ---------------------------------------
            # Store result in TrackState
            # ---------------------------------------

            track.plate_status = result.status

            track.plate_number = result.plate_number

            track.plate_bbox = result.plate_bbox

            track.plate_confidence = (
                result.plate_confidence
            )

            track.plate_detection_confidence = (
                result.detection_confidence
            )

            track.watchlist_status = (
                result.watchlist_status
            )

            # ---------------------------------------
            # Successful recognition
            # ---------------------------------------

            if result.status == "recognized":

                self._completed_tracks.add(
                    track.track_id
                )

        # ---------------------------------------
        # Cleanup disappeared tracks
        # ---------------------------------------

        stale_ids = (
            set(self._attempt_counters.keys())
            - active_track_ids
        )

        for track_id in stale_ids:

            self._attempt_counters.pop(
                track_id,
                None,
            )

            self._completed_tracks.discard(
                track_id
            )