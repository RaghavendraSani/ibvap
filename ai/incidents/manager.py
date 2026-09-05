import time
import uuid
from typing import Dict, Iterable, List

from ai.incidents.incident import Incident
from ai.schemas.event import SecurityEvent


class IncidentManager:

    def __init__(self):

        self.incidents: Dict[
            str,
            Incident,
        ] = {}

        # Maps an active event condition to its incident.
        self._active_keys: Dict[
            tuple,
            str,
        ] = {}

    # ==========================================
    # Create / update incidents
    # ==========================================

    def process_events(
        self,
        events: Iterable[SecurityEvent],
    ) -> List[Incident]:

        results = []

        for event in events:

            key = self._make_key(event)

            # ----------------------------------
            # Existing active incident
            # ----------------------------------

            if key in self._active_keys:

                incident_id = self._active_keys[key]

                incident = self.incidents.get(
                    incident_id
                )

                if incident is None:
                    self._active_keys.pop(
                        key,
                        None,
                    )
                else:
                    incident.updated_at = (
                        event.timestamp
                    )

                    results.append(incident)

                    continue

            # ----------------------------------
            # Create new incident
            # ----------------------------------

            incident_id = (
                f"INC-{uuid.uuid4().hex[:8].upper()}"
            )

            incident = Incident(
                incident_id=incident_id,
                event_type=event.event_type,
                camera_id=event.camera_id,
                track_id=event.track_id,
                severity=event.severity,
                status="ACTIVE",
                created_at=event.timestamp,
                updated_at=event.timestamp,
                message=event.message,
                metadata=dict(event.metadata),
            )

            self.incidents[
                incident_id
            ] = incident

            self._active_keys[
                key
            ] = incident_id

            results.append(incident)

        return results

    # ==========================================
    # Resolve by event condition
    # ==========================================

    def resolve_by_key(
        self,
        key: tuple,
        timestamp: float | None = None,
    ) -> bool:

        incident_id = self._active_keys.get(key)

        if incident_id is None:
            return False

        return self.resolve(
            incident_id,
            timestamp,
        )

    # ==========================================
    # Resolve incident
    # ==========================================

    def resolve(
        self,
        incident_id: str,
        timestamp: float | None = None,
    ) -> bool:

        incident = self.incidents.get(
            incident_id
        )

        if incident is None:
            return False

        if incident.status == "RESOLVED":
            return True

        now = (
            timestamp
            if timestamp is not None
            else time.time()
        )

        incident.status = "RESOLVED"
        incident.updated_at = now
        incident.resolved_at = now

        # Remove active mapping.
        keys_to_remove = [
            key
            for key, value
            in self._active_keys.items()
            if value == incident_id
        ]

        for key in keys_to_remove:
            del self._active_keys[key]

        return True

    # ==========================================
    # Resolve intrusion for a track
    # ==========================================

    def resolve_track_event(
        self,
        camera_id: str,
        event_type: str,
        track_id: int,
        timestamp: float | None = None,
    ) -> bool:

        key = (
            camera_id,
            event_type,
            track_id,
        )

        return self.resolve_by_key(
            key,
            timestamp,
        )

    # ==========================================
    # Get active incidents
    # ==========================================

    def get_active(self) -> List[Incident]:

        return [
            incident
            for incident in self.incidents.values()
            if incident.status == "ACTIVE"
        ]

    # ==========================================
    # Get all incidents
    # ==========================================

    def get_all(self) -> List[Incident]:

        return list(
            self.incidents.values()
        )

    # ==========================================
    # Internal key
    # ==========================================

    @staticmethod
    def _make_key(
        event: SecurityEvent,
    ) -> tuple:

        return (
            event.camera_id,
            event.event_type,
            event.track_id,
        )