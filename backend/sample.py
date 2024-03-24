import cv2
import cvlib as cv
from cvlib.object_detection import draw_bbox
import matplotlib.pyplot as plt

image=cv2.imread('traffic.jpg')
box,label,c_score=cv.detect_common_objects(image)
output=draw_bbox(image,box,label,c_score)
plt.imshow(output)
plt.show()
print("No of objects",label.count('cars'))