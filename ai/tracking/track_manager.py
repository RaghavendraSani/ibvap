import time
from typing import Dict, List

from ai.tracking.track_state import TrackState
from ai.tracking.tracker import TrackedObject


class TrackManager:
    """
    Maintains persistent state for tracked objects.

    A track is kept temporarily when the detector/tracker misses
    the object. This prevents bounding boxes, trajectories and
    associated state from disappearing immediately.
    """

    # Number of consecutive frames an object may be missing
    # before its track is permanently removed.
    MAX_MISSED_FRAMES = 45

    def __init__(self):
        self.tracks: Dict[int, TrackState] = {}

    def update(
        self,
        tracked_objects: List[TrackedObject],
    ) -> Dict[int, TrackState]:

        current_ids = set()

        current_time = time.time()

        # ---------------------------------------
        # Update detected objects
        # ---------------------------------------

        for obj in tracked_objects:

            current_ids.add(obj.track_id)

            center = (
                (obj.bbox[0] + obj.bbox[2]) / 2,
                (obj.bbox[1] + obj.bbox[3]) / 2,
            )

            # -----------------------------------
            # New track
            # -----------------------------------

            if obj.track_id not in self.tracks:

                self.tracks[obj.track_id] = TrackState(
                    track_id=obj.track_id,
                    class_id=obj.class_id,
                    class_name=obj.class_name,
                    bbox=obj.bbox,
                    confidence=obj.confidence,
                    first_seen=current_time,
                    last_seen=current_time,
                    trajectory=[center],
                    missed_frames=0,
                )

            # -----------------------------------
            # Existing track
            # -----------------------------------

            else:

                track = self.tracks[obj.track_id]

                track.bbox = obj.bbox
                track.confidence = obj.confidence
                track.last_seen = current_time

                track.trajectory.append(center)

                # Object has appeared again.
                track.missed_frames = 0

        # ---------------------------------------
        # Handle missing tracks
        # ---------------------------------------

        tracks_to_remove = []

        for track_id, track in self.tracks.items():

            if track_id not in current_ids:

                track.missed_frames += 1

                if (
                    track.missed_frames
                    > self.MAX_MISSED_FRAMES
                ):
                    tracks_to_remove.append(track_id)

        # ---------------------------------------
        # Remove expired tracks
        # ---------------------------------------

        for track_id in tracks_to_remove:
            del self.tracks[track_id]

        return self.tracks