import cv2 as cv
import numpy as np
import os

def create_dir_if_not_exists(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)

def record_video():
    cam = cv.VideoCapture(0)

    output = cv.VideoWriter('./input/journal_entry.mp4', 
                   cv.VideoWriter_fourcc(*'mp4v'), 20.0, (640,480))

    while cam.isOpened():
        ret, frame = cam.read()
        if ret:
            output.write(frame)
            cv.imshow('frame', cv.flip(frame, 1)) # mirror
            if cv.waitKey(1) == ord('q'):
                break

    output.release()
    cam.release()
    cv.destroyAllWindows()

def main():

    # create a directory
    create_dir_if_not_exists(f'./input')

    # record the video
    record_video()



if __name__ == "__main__":
    main()