from typing import Dict, List

from ai.events.geometry import point_distance, point_in_polygon
from ai.events.rules import LoiteringRule
from ai.events.zone import Zone
from ai.schemas.event import SecurityEvent
from ai.schemas.scene import SceneState


class EventEngine:
    def __init__(
        self,
        zones: List[Zone] | None = None,
        loitering_rule: LoiteringRule | None = None,
    ):
        self.zones = zones or []
        self.loitering_rule = loitering_rule or LoiteringRule()

        self._zone_states: Dict[tuple[int, str], bool] = {}
        self._loitering_states: Dict[int, bool] = {}

    def evaluate(self, scene: SceneState) -> List[SecurityEvent]:
        events = []

        for obj in scene.objects:

            # -------------------------
            # Intrusion detection
            # -------------------------

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

            # -------------------------
            # Loitering detection
            # -------------------------

            rule = self.loitering_rule

            if not rule.enabled:
                continue

            if obj.object_type not in rule.target_classes:
                continue

            if obj.track_id in self._loitering_states:
                continue

            duration = obj.last_seen - obj.first_seen

            if not obj.trajectory:
                continue

            distance = point_distance(
                obj.trajectory[0],
                obj.position,
            )

            if (
                duration >= rule.duration_seconds
                and distance <= rule.movement_threshold
            ):
                events.append(
                    SecurityEvent(
                        event_type="LOITERING",
                        camera_id=scene.camera_id,
                        timestamp=scene.timestamp,
                        track_id=obj.track_id,
                        severity="medium",
                        message=(
                            f"{obj.object_type} has remained "
                            f"stationary for {duration:.1f} seconds"
                        ),
                        metadata={
                            "duration_seconds": duration,
                            "movement_distance": distance,
                        },
                    )
                )

                self._loitering_states[obj.track_id] = True

        return events