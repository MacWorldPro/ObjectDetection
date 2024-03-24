from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import cv2
import numpy as np
import cvlib as cv
from cvlib.object_detection import draw_bbox
import io
import base64

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['POST'])
def upload_image():
    # Check if 'image' is present in the files of the request
    if 'image' not in request.files:
        return jsonify({'error': 'No image found in request'})

    image_file = request.files['image']
    if image_file.filename == '':
        return jsonify({'error': 'No image selected for uploading'})

    # Read the image file
    image_np = np.frombuffer(image_file.read(), np.uint8)
    image = cv2.imdecode(image_np, cv2.IMREAD_COLOR)

    # Perform object detection
    box, label, count = cv.detect_common_objects(image)
    output = draw_bbox(image, box, label, count)

    # Convert output image to bytes
    _, img_encoded = cv2.imencode('.jpg', output)
    img_bytes = img_encoded.tobytes()

    # Convert bytes to base64 string
    img_base64 = base64.b64encode(img_bytes).decode('utf-8')

    # Get count of specific objects (e.g., person, car)
    specific_objects = ['truck', 'car','bike']
    specific_object_counts = {obj: label.count(obj) for obj in specific_objects}

    # Return the image and count as response
    response_data = {
        'image': img_base64,  # Convert bytes to base64 string
        'count': count,
        'specific_object_counts': specific_object_counts
    }
    return jsonify(response_data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
