import cv2
import numpy as np
import matplotlib.pyplot as plt
import cvlib as cv
from cvlib.object_detection import draw_bbox
from numpy.lib.polynomial import poly
image = cv2.imread("traffic.jpg")

box,label,count = cv.detect_common_objects(image)
output = draw_bbox(image,box,label,count)
plt.imshow(output)
plt.show()
print(label.count('car'))

