import time

from ai.events.event_engine import EventEngine
from ai.events.zone import Zone
from ai.schemas.event import SecurityEvent
from ai.schemas.scene import SceneObject, SceneState


def create_scene(position):
    return SceneState(
        camera_id="camera_01",
        timestamp=time.time(),
        objects=[
            SceneObject(
                track_id=1,
                object_type="person",
                position=position,
                bbox=(0, 0, 10, 10),
                confidence=0.95,
            )
        ],
    )


def main():
    zone = Zone(
        zone_id="zone_01",
        name="Restricted Area",
        polygon=[
            (100, 100),
            (300, 100),
            (300, 250),
            (100, 250),
        ],
    )

    engine = EventEngine(zones=[zone])

    # Frame 1: person is outside.
    events = engine.evaluate(
        create_scene((50, 50))
    )

    assert len(events) == 0

    # Frame 2: person enters the restricted zone.
    events = engine.evaluate(
        create_scene((200, 175))
    )

    assert len(events) == 1

    event = events[0]

    assert isinstance(event, SecurityEvent)
    assert event.event_type == "INTRUSION"
    assert event.track_id == 1
    assert event.severity == "high"

    # Frame 3: person remains inside.
    events = engine.evaluate(
        create_scene((220, 180))
    )

    assert len(events) == 0

    print("Intrusion entry detection test: PASSED")


if __name__ == "__main__":
    main()