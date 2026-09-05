from ai.incidents.manager import IncidentManager
from ai.schemas.event import SecurityEvent


def main():

    manager = IncidentManager()

    event = SecurityEvent(
        event_type="INTRUSION",
        camera_id="camera_01",
        timestamp=100.0,
        track_id=5,
        severity="high",
        message="Person entered restricted zone",
    )

    # -------------------------------
    # New incident
    # -------------------------------

    incidents = manager.process_events(
        [event]
    )

    assert len(incidents) == 1

    incident = incidents[0]

    assert incident.status == "ACTIVE"
    assert incident.event_type == "INTRUSION"
    assert incident.track_id == 5

    print(
        f"Created: {incident.incident_id}"
    )

    # -------------------------------
    # Same event should reuse incident
    # -------------------------------

    event2 = SecurityEvent(
        event_type="INTRUSION",
        camera_id="camera_01",
        timestamp=105.0,
        track_id=5,
        severity="high",
        message="Person still inside restricted zone",
    )

    incidents = manager.process_events(
        [event2]
    )

    assert len(incidents) == 1
    assert (
        incidents[0].incident_id
        == incident.incident_id
    )

    print("Incident persistence: PASSED")

    # -------------------------------
    # Resolve
    # -------------------------------

    success = manager.resolve(
        incident.incident_id,
        timestamp=110.0,
    )

    assert success
    assert incident.status == "RESOLVED"
    assert incident.resolved_at == 110.0

    print("Incident resolution: PASSED")

    # -------------------------------
    # Active list
    # -------------------------------

    assert len(manager.get_active()) == 0

    print("Active incident cleanup: PASSED")

    print(
        "\nIncident lifecycle test: PASSED"
    )


if __name__ == "__main__":
    main()