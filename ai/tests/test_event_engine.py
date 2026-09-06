from ai.events.event_engine import EventEngine
from ai.events.rules import LoiteringRule
from ai.schemas.scene import SceneObject, SceneState


def create_scene(
    timestamp,
    position,
    first_seen=0.0,
    trajectory=None,
):
    if trajectory is None:
        trajectory = [position]

    return SceneState(
        camera_id="camera_01",
        timestamp=timestamp,
        objects=[
            SceneObject(
                track_id=1,
                object_type="person",
                position=position,
                bbox=(0, 0, 10, 10),
                confidence=0.95,
                first_seen=first_seen,
                last_seen=timestamp,
                trajectory=trajectory,
            )
        ],
    )


def main():
    rule = LoiteringRule(
        enabled=True,
        duration_seconds=10.0,
        movement_threshold=30.0,
        target_classes=("person",),
    )

    engine = EventEngine(
        loitering_rule=rule,
    )

    # ---------------------------------
    # Frame 1: person has just appeared
    # ---------------------------------

    events = engine.evaluate(
        create_scene(
            timestamp=2.0,
            position=(200, 175),
        )
    )

    assert len(events) == 0

    # ---------------------------------
    # Frame 2: only 8 seconds elapsed
    # ---------------------------------

    events = engine.evaluate(
        create_scene(
            timestamp=8.0,
            position=(205, 178),
            trajectory=[
                (200, 175),
                (205, 178),
            ],
        )
    )

    assert len(events) == 0

    # ---------------------------------
    # Frame 3: 10+ seconds, little movement
    # ---------------------------------

    events = engine.evaluate(
        create_scene(
            timestamp=10.5,
            position=(210, 180),
            trajectory=[
                (200, 175),
                (205, 178),
                (210, 180),
            ],
        )
    )

    assert len(events) == 1

    event = events[0]

    assert event.event_type == "LOITERING"
    assert event.track_id == 1
    assert event.severity == "medium"

    # ---------------------------------
    # Frame 4: still there
    # No duplicate event
    # ---------------------------------

    events = engine.evaluate(
        create_scene(
            timestamp=15.0,
            position=(212, 182),
            trajectory=[
                (200, 175),
                (205, 178),
                (210, 180),
                (212, 182),
            ],
        )
    )

    assert len(events) == 0

    print("Loitering detection test: PASSED")


if __name__ == "__main__":
    main()