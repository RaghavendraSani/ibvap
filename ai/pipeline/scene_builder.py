from typing import Dict

from ai.schemas.scene import SceneObject, SceneState
from ai.tracking.track_state import TrackState


class SceneStateBuilder:
    def __init__(self, camera_id: str):
        self.camera_id = camera_id

    def build(
        self,
        tracks: Dict[int, TrackState],
        timestamp: float,
    ) -> SceneState:

        objects = []

        for track in tracks.values():

            objects.append(
                SceneObject(
                    track_id=track.track_id,
                    object_type=track.class_name,
                    position=track.center,

                    bbox=track.bbox,
                    confidence=track.confidence,

                    first_seen=track.first_seen,
                    last_seen=track.last_seen,

                    trajectory=track.trajectory.copy(),

                    # ---------------------------------------
                    # Zone
                    # ---------------------------------------

                    zone=track.zone,

                    # ---------------------------------------
                    # ANPR
                    # ---------------------------------------

                    plate_number=track.plate_number,
                    plate_confidence=track.plate_confidence,
                    plate_detection_confidence=(
                        track.plate_detection_confidence
                    ),
                    plate_bbox=track.plate_bbox,
                    plate_status=track.plate_status,
                    watchlist_status=track.watchlist_status,
                )
            )

        return SceneState(
            camera_id=self.camera_id,
            timestamp=timestamp,
            objects=objects,
        )