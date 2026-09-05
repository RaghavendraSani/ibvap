import time

import cv2

from ai.detection.detector import ObjectDetector
from ai.events.event_engine import EventEngine
from ai.events.rules import LoiteringRule
from ai.events.zone import Zone
from ai.pipeline.scene_builder import SceneStateBuilder
from ai.tracking.track_manager import TrackManager
from ai.tracking.tracker import ObjectTracker
from ai.video.capture import VideoCapture


CAMERA_ID = "camera_01"
VIDEO_SOURCE = 0

MODEL_PATH = "ai/models/yolo11n.pt"
CONFIDENCE = 0.40


def draw_scene(frame, scene, events):
    """
    Draw tracked objects and security events on the frame.
    """

    # Draw tracked objects
    for obj in scene.objects:
        x1, y1, x2, y2 = map(int, obj.bbox)

        # Bounding box
        cv2.rectangle(
            frame,
            (x1, y1),
            (x2, y2),
            (0, 255, 0),
            2,
        )

        # Object label
        label = (
            f"ID:{obj.track_id} "
            f"{obj.object_type} "
            f"{obj.confidence:.2f}"
        )

        cv2.putText(
            frame,
            label,
            (x1, max(y1 - 10, 20)),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.55,
            (0, 255, 0),
            2,
        )

        # Draw trajectory
        trajectory = obj.trajectory

        for i in range(1, len(trajectory)):
            p1 = tuple(map(int, trajectory[i - 1]))
            p2 = tuple(map(int, trajectory[i]))

            cv2.line(
                frame,
                p1,
                p2,
                (255, 255, 0),
                2,
            )

    # Display events
    y = 30

    for event in events:
        text = (
            f"{event.event_type}: "
            f"ID {event.track_id}"
        )

        cv2.putText(
            frame,
            text,
            (10, y),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (0, 0, 255),
            2,
        )

        y += 30


def main():
    print("Starting IBVAP real-time pipeline...")
    print(f"Camera: {CAMERA_ID}")
    print(f"Video source: {VIDEO_SOURCE}")

    # ---------------------------------------
    # Initialize components
    # ---------------------------------------

    tracker = ObjectTracker(
        model_path=MODEL_PATH,
        confidence=CONFIDENCE,
    )

    track_manager = TrackManager()

    scene_builder = SceneStateBuilder(
        camera_id=CAMERA_ID,
    )

    # No restricted zones yet.
    zones = []

    loitering_rule = LoiteringRule(
        enabled=True,
        duration_seconds=10.0,
        movement_threshold=30.0,
        target_classes=("person",),
    )

    event_engine = EventEngine(
        zones=zones,
        loitering_rule=loitering_rule,
    )
    # ---------------------------------------
    # Open camera
    # ---------------------------------------
    with VideoCapture(VIDEO_SOURCE) as capture:
        previous_time = time.time()
        while True:
            frame = capture.read()
            if frame is None:
                print("Video stream ended.")
                break
            # --------------------------------
            # Detection + tracking
            # --------------------------------
            tracked_objects = tracker.update(frame)
            # --------------------------------
            # Track state management
            # --------------------------------
            tracks = track_manager.update(
                tracked_objects
            )
            # --------------------------------
            # Build scene
            # --------------------------------
            timestamp = time.time()
            scene = scene_builder.build(
                tracks=tracks,
                timestamp=timestamp,
            )
            # --------------------------------
            # Evaluate security events
            # --------------------------------
            events = event_engine.evaluate(
                scene
            )
            # --------------------------------
            # Calculate FPS
            # --------------------------------
            current_time = time.time()
            elapsed = current_time - previous_time
            fps = 1.0 / elapsed if elapsed > 0 else 0.0
            previous_time = current_time
            # --------------------------------
            # Draw visualization
            # --------------------------------
            draw_scene(
                frame,
                scene,
                events,
            )
            # Statistics
            stats = (
                f"FPS: {fps:.1f} | "
                f"Objects: {len(scene.objects)}"
            )
            cv2.putText(
                frame,
                stats,
                (10, frame.shape[0] - 20),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.65,
                (255, 255, 255),
                2,
            )
            # --------------------------------
            # Display
            # --------------------------------

            cv2.imshow(
                "IBVAP - Real-Time AI",
                frame,
            )
            # Press Q to exit
            if cv2.waitKey(1) & 0xFF == ord("q"):
                break

    cv2.destroyAllWindows()

    print("IBVAP pipeline stopped.")


if __name__ == "__main__":
    main()