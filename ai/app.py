import time

import cv2
import numpy as np

from ai.anpr.manager import ANPRManager
from ai.events.event_engine import EventEngine
from ai.events.geometry import point_in_polygon
from ai.events.rules import LoiteringRule
from ai.pipeline.scene_builder import SceneStateBuilder
from ai.tracking.track_manager import TrackManager
from ai.tracking.tracker import ObjectTracker
from ai.ui.zone_editor import ZoneEditor
from ai.video.capture import VideoCapture

from ai.incidents.manager import IncidentManager
from ai.evidence.snapshot import SnapshotManager


# ==========================================
# Configuration
# ==========================================

CAMERA_ID = "camera_01"
VIDEO_SOURCE = 0

MODEL_PATH = "ai/models/yolo11n.pt"
CONFIDENCE = 0.40

VEHICLE_CLASSES = {
    "car",
    "motorcycle",
    "bus",
    "truck",
}


# ==========================================
# Utility
# ==========================================

def crop_object(frame, bbox):
    """
    Safely crop an object from the current frame.
    """

    if frame is None or bbox is None:
        return None

    height, width = frame.shape[:2]

    x1, y1, x2, y2 = map(int, bbox)

    x1 = max(0, min(x1, width - 1))
    y1 = max(0, min(y1, height - 1))

    x2 = max(0, min(x2, width))
    y2 = max(0, min(y2, height))

    if x2 <= x1 or y2 <= y1:
        return None

    return frame[y1:y2, x1:x2]


# ==========================================
# Visualization
# ==========================================

def draw_scene(
    frame,
    scene,
    events,
    active_intrusions,
):
    """
    Draw the current IBVAP scene.

    Includes:
    - restricted zones
    - tracked objects
    - trajectories
    - ANPR information
    - persistent intrusion warnings
    - current security events
    """

    # ======================================
    # Restricted zones
    # ======================================

    for zone in getattr(scene, "zones", []):

        points = [
            tuple(map(int, point))
            for point in zone.polygon
        ]

        if len(points) < 3:
            continue

        cv2.polylines(
            frame,
            [np.array(points, dtype=np.int32)],
            True,
            (0, 0, 255),
            2,
        )

        cv2.putText(
            frame,
            zone.name,
            points[0],
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (0, 0, 255),
            2,
        )

    # ======================================
    # Tracked objects
    # ======================================

    for obj in scene.objects:

        x1, y1, x2, y2 = map(int, obj.bbox)

        # ----------------------------------
        # Bounding-box colour
        # ----------------------------------

        if obj.track_id in active_intrusions:
            box_color = (0, 0, 255)
        else:
            box_color = (0, 255, 0)

        # ----------------------------------
        # Bounding box
        # ----------------------------------

        cv2.rectangle(
            frame,
            (x1, y1),
            (x2, y2),
            box_color,
            2,
        )

        # ----------------------------------
        # Object label
        # ----------------------------------

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
            box_color,
            2,
        )

        # ==================================
        # ANPR information
        # ==================================

        plate_status = getattr(
            obj,
            "plate_status",
            None,
        )

        plate_number = getattr(
            obj,
            "plate_number",
            None,
        )

        if (
            plate_status == "recognized"
            and plate_number
        ):

            plate_text = (
                f"PLATE: {plate_number}"
            )

            cv2.putText(
                frame,
                plate_text,
                (
                    x1,
                    min(
                        y2 + 20,
                        frame.shape[0] - 40,
                    ),
                ),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.55,
                (255, 255, 0),
                2,
            )

    # ======================================
    # Draw trajectories
    # ======================================

    for obj in scene.objects:

        trajectory = getattr(
            obj,
            "trajectory",
            [],
        )

        if len(trajectory) < 2:
            continue

        for i in range(
            1,
            len(trajectory),
        ):

            p1 = tuple(
                map(
                    int,
                    trajectory[i - 1],
                )
            )

            p2 = tuple(
                map(
                    int,
                    trajectory[i],
                )
            )

            cv2.line(
                frame,
                p1,
                p2,
                (255, 255, 0),
                2,
            )

    # ======================================
    # Persistent intrusion warnings
    # ======================================

    warning_y = 30

    for track_id, message in (
        active_intrusions.items()
    ):

        text = (
            f"INTRUSION: ID {track_id} - "
            f"{message}"
        )

        cv2.putText(
            frame,
            text,
            (10, warning_y),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (0, 0, 255),
            2,
        )

        warning_y += 30

    # ======================================
    # Current non-intrusion events
    # ======================================

    event_y = warning_y + 10

    for event in events:

        if event.event_type == "INTRUSION":
            continue

        text = (
            f"{event.event_type}: "
            f"ID {event.track_id}"
        )

        cv2.putText(
            frame,
            text,
            (10, event_y),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.65,
            (0, 0, 255),
            2,
        )

        event_y += 30


# ==========================================
# Main
# ==========================================

def main():

    print(
        "Starting IBVAP real-time pipeline..."
    )

    print(
        f"Camera: {CAMERA_ID}"
    )

    print(
        f"Video source: {VIDEO_SOURCE}"
    )

    # ======================================
    # Initialize tracker
    # ======================================

    tracker = ObjectTracker(
        model_path=MODEL_PATH,
        confidence=CONFIDENCE,
    )

    track_manager = TrackManager()

    # ======================================
    # Scene builder
    # ======================================

    scene_builder = SceneStateBuilder(
        camera_id=CAMERA_ID,
    )

    # ======================================
    # Loitering rule
    # ======================================

    loitering_rule = LoiteringRule(
        enabled=True,
        duration_seconds=10.0,
        movement_threshold=30.0,
        target_classes=("person",),
    )

    # ======================================
    # Open camera
    # ======================================

    with VideoCapture(VIDEO_SOURCE) as capture:

        first_frame = capture.read()

        if first_frame is None:

            print(
                "Could not read initial "
                "camera frame."
            )

            return

        # ==================================
        # Zone configuration
        # ==================================

        zone_editor = ZoneEditor(
            zone_id="zone_01",
            zone_name="Restricted Zone",
        )

        restricted_zone = zone_editor.edit(
            first_frame
        )

        if restricted_zone is None:

            print(
                "No restricted zone configured."
            )

            zones = []

        else:

            zones = [
                restricted_zone
            ]

            print(
                f"Configured zone: "
                f"{restricted_zone.name}"
            )

        # ==================================
        # Event engine
        # ==================================

        event_engine = EventEngine(
            zones=zones,
            loitering_rule=loitering_rule,
        )

        # ==================================
        # ANPR manager
        # ==================================

        anpr_manager = ANPRManager()

        # ==================================
        # Incident manager
        # ==================================

        incident_manager = IncidentManager()

        # ==================================
        # Evidence / snapshot manager
        # ==================================

        snapshot_manager = SnapshotManager(
            base_dir="evidence"
        )

        # ==================================
        # FPS state
        # ==================================

        previous_time = time.time()

        # ==================================
        # Main loop
        # ==================================

        while True:

            frame = capture.read()

            if frame is None:

                print(
                    "Video stream ended."
                )

                break

            # =================================
            # Detection + tracking
            # =================================

            tracked_objects = tracker.update(
                frame
            )

            # =================================
            # Track state management
            # =================================

            tracks = track_manager.update(
                tracked_objects
            )

            # =================================
            # ANPR
            # =================================

            for track in tracks.values():

                if (
                    track.class_name
                    not in VEHICLE_CLASSES
                ):
                    continue

                vehicle_crop = crop_object(
                    frame,
                    track.bbox,
                )

                if vehicle_crop is None:

                    track.plate_status = (
                        "vehicle_crop_failed"
                    )

                    continue

                # ----------------------------------
                # ANPR must never stop the pipeline.
                # ----------------------------------

                try:

                    anpr_manager.update(
                        [track],
                        vehicle_crop,
                    )

                except Exception as exc:

                    track.plate_status = (
                        "anpr_error"
                    )

                    print(
                        f"[ANPR] Track "
                        f"{track.track_id} "
                        f"error: "
                        f"{type(exc).__name__}: "
                        f"{exc}"
                    )

            # =================================
            # Build scene
            # =================================

            timestamp = time.time()

            scene = scene_builder.build(
                tracks=tracks,
                timestamp=timestamp,
            )

            # Attach zones for visualization.

            scene.zones = zones

            # =================================
            # Evaluate events
            # =================================

            events = event_engine.evaluate(
                scene
            )

            # =================================
            # Incident lifecycle
            # =================================

            existing_incident_ids = set(
                incident_manager.incidents.keys()
            )

            incidents = (
                incident_manager.process_events(
                    events
                )
            )

            # =================================
            # Evidence capture
            # =================================

            for incident in incidents:

                # Only capture evidence for
                # newly created incidents.

                if (
                    incident.incident_id
                    in existing_incident_ids
                ):
                    continue

                try:

                    evidence = (
                        snapshot_manager.capture(
                            frame=frame,
                            incident_id=(
                                incident.incident_id
                            ),
                            event_type=(
                                incident.event_type
                            ),
                            camera_id=(
                                incident.camera_id
                            ),
                            track_id=(
                                incident.track_id
                            ),
                            timestamp=timestamp,
                        )
                    )

                    if evidence is not None:

                        incident.evidence.append(
                            evidence
                        )

                        print(
                            "[EVIDENCE] Saved: "
                            f"{evidence.image_path}"
                        )

                    else:

                        print(
                            "[EVIDENCE] Failed "
                            f"for incident "
                            f"{incident.incident_id}"
                        )

                except Exception as exc:

                    # Evidence failure must NEVER
                    # stop surveillance.

                    print(
                        "[EVIDENCE] Error for "
                        f"{incident.incident_id}: "
                        f"{type(exc).__name__}: "
                        f"{exc}"
                    )

            # =================================
            # Resolve intrusion incidents
            # =================================

            for incident in list(
                incident_manager.get_active()
            ):

                if (
                    incident.event_type
                    != "INTRUSION"
                ):
                    continue

                if incident.track_id is None:
                    continue

                track = tracks.get(
                    incident.track_id
                )

                # --------------------------------
                # Track completely disappeared.
                # --------------------------------

                if track is None:

                    incident_manager.resolve_track_event(
                        camera_id=CAMERA_ID,
                        event_type="INTRUSION",
                        track_id=incident.track_id,
                        timestamp=timestamp,
                    )

                    continue

                # --------------------------------
                # Check whether the object is
                # still inside a restricted zone.
                # --------------------------------

                still_inside = False

                for zone in zones:

                    if point_in_polygon(
                        track.center,
                        zone.polygon,
                    ):

                        still_inside = True

                        break

                # --------------------------------
                # Object left restricted zone.
                # --------------------------------

                if not still_inside:

                    incident_manager.resolve_track_event(
                        camera_id=CAMERA_ID,
                        event_type="INTRUSION",
                        track_id=incident.track_id,
                        timestamp=timestamp,
                    )

            # =================================
            # Build persistent intrusion display
            # =================================

            active_intrusions = {}

            for incident in (
                incident_manager.get_active()
            ):

                if (
                    incident.event_type
                    == "INTRUSION"
                    and incident.track_id
                    is not None
                ):

                    active_intrusions[
                        incident.track_id
                    ] = incident.message

            # =================================
            # FPS
            # =================================

            current_time = time.time()

            elapsed = (
                current_time
                - previous_time
            )

            fps = (
                1.0 / elapsed
                if elapsed > 0
                else 0.0
            )

            previous_time = current_time

            # =================================
            # Draw visualization
            # =================================

            draw_scene(
                frame,
                scene,
                events,
                active_intrusions,
            )

            # =================================
            # Statistics
            # =================================

            object_count = len(
                scene.objects
            )

            vehicle_count = sum(
                1
                for obj in scene.objects
                if obj.object_type
                in VEHICLE_CLASSES
            )

            intrusion_count = len(
                active_intrusions
            )

            stats = (
                f"FPS: {fps:.1f} | "
                f"Objects: {object_count} | "
                f"Vehicles: {vehicle_count} | "
                f"Intrusions: {intrusion_count}"
            )

            cv2.putText(
                frame,
                stats,
                (
                    10,
                    frame.shape[0] - 20,
                ),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.65,
                (255, 255, 255),
                2,
            )

            # =================================
            # Display
            # =================================

            cv2.imshow(
                "IBVAP - Real-Time AI",
                frame,
            )

            # =================================
            # Exit
            # =================================

            if (
                cv2.waitKey(1) & 0xFF
                == ord("q")
            ):

                break

    cv2.destroyAllWindows()

    print(
        "IBVAP pipeline stopped."
    )


if __name__ == "__main__":
    main()