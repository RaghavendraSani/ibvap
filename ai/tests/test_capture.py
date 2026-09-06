import cv2

from ai.video.capture import VideoCapture


def main():
    capture = VideoCapture(0)

    print("Camera opened. Press Q to quit.")

    while True:
        frame = capture.read()

        if frame is None:
            print("Failed to read frame.")
            break

        cv2.imshow("IBVAP - Camera Test", frame)

        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    capture.release()
    cv2.destroyAllWindows()

    print("Video capture test: PASSED")


if __name__ == "__main__":
    main()