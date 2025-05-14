from flask import Flask, request, jsonify, render_template
import numpy as np
import cv2
from tensorflow.keras.models import load_model
from PIL import Image

app = Flask(__name__)
model = load_model("effnet.keras")

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        img = Image.open(file.stream).convert('RGB')
        img = np.array(img)
        img = cv2.resize(img, (150, 150))
        img = img.reshape(1, 150, 150, 3) / 255.0

        pred = model.predict(img)
        pred_class = np.argmax(pred)

        labels = ['Glioma Tumor', 'No Tumor', 'Meningioma Tumor', 'Pituitary Tumor']
        result = labels[pred_class]

        return jsonify({'prediction': result})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
