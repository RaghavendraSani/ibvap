import cv2


class VideoCapture:
    def __init__(self, source=0):
        self.source = source
        self.cap = cv2.VideoCapture(source)

        if not self.cap.isOpened():
            raise RuntimeError(
                f"Could not open video source: {source}"
            )

    def read(self):
        success, frame = self.cap.read()

        if not success:
            return None

        return frame

    def release(self):
        self.cap.release()

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.release()