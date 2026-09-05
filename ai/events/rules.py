from dataclasses import dataclass


@dataclass
class LoiteringRule:
    enabled: bool = True

    # Minimum time an object must remain in the same
    # approximate area before loitering is triggered.
    duration_seconds: float = 10.0

    # Maximum distance in pixels from the starting point
    # for the object to still be considered stationary.
    movement_threshold: float = 30.0

    # Object classes to which the rule applies.
    target_classes: tuple[str, ...] = ("person",)