from fastapi import FastAPI, UploadFile, File
import uvicorn
import numpy as np
from PIL import Image
from io import BytesIO
import io
import tensorflow as tf
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can replace "*" with ["http://127.0.0.1:5500"] for better security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# MODEL_PATH = r"E:\btc\Models\effnet.keras"
MODEL_PATH = "./Models/effnet.keras"
CLASS_NAMES=['glioma_tumor','no_tumor','meningioma_tumor','pituitary_tumor']

MODEL=tf.keras.models.load_model(MODEL_PATH)
# @app.get('/ping')
# async def ping():
#     return "hello"

def read_file_as_image(data) -> np.ndarray:
    
    # image =np.array(Image.open(BytesIO(data)))
    image = Image.open(io.BytesIO(data))
    image = image.resize((150, 150))  # Resize to match model input
    image = image.convert("RGB")    
    return  np.array(image)    

@app.post('/predict')
async def predict(file: UploadFile = File(...)):
    # pass
    image = read_file_as_image(await file.read())
    # [[150,150,3]]
    image_batch=np.expand_dims(image, axis=0)
    prediction=MODEL.predict(image_batch)
    predicted_class=CLASS_NAMES[np.argmax(prediction[0])]
    confidence=float(np.max(prediction))
    return{
        'class':predicted_class,
        'confidence':confidence
    }

if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=8000)
