from typing import Dict, List

from ai.events.geometry import point_in_polygon
from ai.events.zone import Zone
from ai.schemas.event import SecurityEvent
from ai.schemas.scene import SceneState


class EventEngine:
    def __init__(self, zones: List[Zone] | None = None):
        self.zones = zones or []

        # Tracks whether an object was previously inside each zone.
        self._zone_states: Dict[tuple[int, str], bool] = {}

    def evaluate(self, scene: SceneState) -> List[SecurityEvent]:
        events = []

        for obj in scene.objects:
            for zone in self.zones:
                key = (obj.track_id, zone.zone_id)

                currently_inside = point_in_polygon(
                    obj.position,
                    zone.polygon,
                )

                previously_inside = self._zone_states.get(
                    key,
                    False,
                )

                # Generate an event only when the object
                # transitions from outside → inside.
                if currently_inside and not previously_inside:
                    events.append(
                        SecurityEvent(
                            event_type="INTRUSION",
                            camera_id=scene.camera_id,
                            timestamp=scene.timestamp,
                            track_id=obj.track_id,
                            severity="high",
                            message=(
                                f"{obj.object_type} entered "
                                f"restricted zone '{zone.name}'"
                            ),
                            metadata={
                                "zone_id": zone.zone_id,
                                "zone_name": zone.name,
                            },
                        )
                    )

                self._zone_states[key] = currently_inside

        return events