import time
from typing import Dict, List

from ai.tracking.track_state import TrackState
from ai.tracking.tracker import TrackedObject


class TrackManager:
    def __init__(self):
        self.tracks: Dict[int, TrackState] = {}

    def update(self, tracked_objects: List[TrackedObject]) -> Dict[int, TrackState]:
        current_time = time.time()

        for obj in tracked_objects:
            center = (
                (obj.bbox[0] + obj.bbox[2]) / 2,
                (obj.bbox[1] + obj.bbox[3]) / 2,
            )

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
                )

            else:
                track = self.tracks[obj.track_id]

                track.bbox = obj.bbox
                track.confidence = obj.confidence
                track.last_seen = current_time

                track.trajectory.append(center)

        return self.tracks