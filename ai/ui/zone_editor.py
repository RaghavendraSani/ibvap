from typing import List, Tuple
import cv2
from ai.events.zone import Zone
Point = Tuple[float, float]
class ZoneEditor:
    """
    Interactive polygon editor for defining a surveillance zone.

    Controls:
        Left mouse click  -> add point
        ENTER             -> finish polygon
        R                 -> reset current polygon
        ESC               -> cancel
    """

    def __init__(
        self,
        window_name: str = "IBVAP - Draw Zone",
        zone_id: str = "zone_01",
        zone_name: str = "Restricted Zone",
    ):
        self.window_name = window_name
        self.zone_id = zone_id
        self.zone_name = zone_name

        self.points: List[Point] = []
        self.finished = False
        self.cancelled = False

    def _mouse_callback(self, event, x, y, flags, param):
        if event == cv2.EVENT_LBUTTONDOWN and not self.finished:
            self.points.append((float(x), float(y)))

    def reset(self):
        self.points.clear()
        self.finished = False
        self.cancelled = False

    def edit(self, frame):
        """
        Open an interactive window and allow the operator
        to draw a polygon over the supplied frame.

        Returns:
            Zone if a valid polygon is completed.
            None if cancelled.
        """

        self.reset()

        cv2.namedWindow(self.window_name)
        cv2.setMouseCallback(
            self.window_name,
            self._mouse_callback,
        )

        while True:
            display = frame.copy()

            # Draw points
            for point in self.points:
                cv2.circle(
                    display,
                    tuple(map(int, point)),
                    5,
                    (0, 255, 255),
                    -1,
                )

            # Draw polygon edges
            if len(self.points) >= 2:
                for i in range(1, len(self.points)):
                    p1 = tuple(map(int, self.points[i - 1]))
                    p2 = tuple(map(int, self.points[i]))

                    cv2.line(
                        display,
                        p1,
                        p2,
                        (0, 255, 255),
                        2,
                    )

            # Preview closing edge
            if len(self.points) >= 3:
                p1 = tuple(map(int, self.points[-1]))
                p2 = tuple(map(int, self.points[0]))

                cv2.line(
                    display,
                    p1,
                    p2,
                    (0, 255, 255),
                    2,
                )

            instructions = (
                "Click points | ENTER: finish | "
                "R: reset | ESC: cancel"
            )

            cv2.putText(
                display,
                instructions,
                (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.65,
                (255, 255, 255),
                2,
            )

            cv2.imshow(
                self.window_name,
                display,
            )

            key = cv2.waitKey(20) & 0xFF

            if key == 13:  # ENTER
                if len(self.points) >= 3:
                    self.finished = True
                    break

            elif key == ord("r"):
                self.reset()

            elif key == 27:  # ESC
                self.cancelled = True
                break

        cv2.destroyWindow(self.window_name)

        if self.cancelled or not self.finished:
            return None

        return Zone(
            zone_id=self.zone_id,
            name=self.zone_name,
            polygon=self.points.copy(),
        )