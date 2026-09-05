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
                    zone=track.zone,
                    identity=track.identity,
                    plate=track.plate_number,
                )
            )

        return SceneState(
            camera_id=self.camera_id,
            timestamp=timestamp,
            objects=objects,
        )