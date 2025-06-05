// const dropArea = document.getElementById('drop-area');
// const fileInput = document.getElementById('fileElem');
// const resultDiv = document.getElementById('result');

// dropArea.addEventListener('click', () => fileInput.click());

// dropArea.addEventListener('dragover', (e) => {
//   e.preventDefault();
//   dropArea.classList.add('dragover');
// });

// dropArea.addEventListener('dragleave', () => {
//   dropArea.classList.remove('dragover');
// });

// dropArea.addEventListener('drop', (e) => {
//   e.preventDefault();
//   dropArea.classList.remove('dragover');
//   const files = e.dataTransfer.files;
//   if (files.length) {
//     handleFile(files[0]);
//   }
// });

// fileInput.addEventListener('change', () => {
//   if (fileInput.files.length) {
//     handleFile(fileInput.files[0]);
//   }
// });

// function handleFile(file) {
//   if (!file.type.startsWith('image/')) {
//     alert('Please upload an image file!');
//     return;
//   }
//   resultDiv.textContent = 'Processing...';

//   const formData = new FormData();
//   formData.append('file', file);

//   fetch('http://localhost:8000/predict', {
//     method: 'POST',
//     body: formData,
//   })
//   .then(res => res.json())
//   .then(data => {
//     if (data.class && data.confidence) {
//       resultDiv.innerHTML = `Prediction: <strong>${data.class}</strong><br/>Confidence: <strong>${(data.confidence * 100).toFixed(2)}%</strong>`;
//     } else {
//       resultDiv.textContent = 'Prediction failed. Try again.';
//     }
//   })
//   .catch(() => {
//     resultDiv.textContent = 'Error connecting to the server.';
//   });
// }

const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('fileElem');
const resultDiv = document.getElementById('result');
const previewImage = document.getElementById('preview');
const instructionText = document.getElementById('instruction');
const clearBtn = document.getElementById('clearBtn');

dropArea.addEventListener('click', () => fileInput.click());

dropArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropArea.classList.add('dragover');
});

dropArea.addEventListener('dragleave', () => {
  dropArea.classList.remove('dragover');
});

dropArea.addEventListener('drop', (e) => {
  e.preventDefault();
  dropArea.classList.remove('dragover');
  const files = e.dataTransfer.files;
  if (files.length) {
    handleFile(files[0]);
  }
});

fileInput.addEventListener('change', () => {
  if (fileInput.files.length) {
    handleFile(fileInput.files[0]);
  }
});

function showLoading() {
  resultDiv.innerHTML = `<span class="spinner"></span> Processing...`;
  clearBtn.style.display = 'none';
}

function isValidImageType(file) {
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  return validTypes.includes(file.type.toLowerCase());
}

function handleFile(file) {
  if (!file.type.startsWith('image/')) {
    alert('Please upload an image file!');
    return;
  }

  if (!isValidImageType(file)) {
    alert('Only MRI image formats (.jpg, .jpeg, .png) are supported!');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    previewImage.src = e.target.result;
    previewImage.style.display = 'block';
  };
  reader.readAsDataURL(file);

  instructionText.style.display = 'none';
  showLoading();

  const formData = new FormData();
  formData.append('file', file);

  fetch('https://brain-tumor-api-vgwm.onrender.com/predict', {
    method: 'POST',
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      setTimeout(() => {
        if (data.class && data.confidence !== undefined) {
          const confidencePercent = (data.confidence * 100).toFixed(2);
          if (data.confidence < 0.6) {
            resultDiv.innerHTML = `<strong>Warning:</strong> Confidence is too low (${confidencePercent}%). Please upload a  MRI scan image.`;
          } else {
            resultDiv.innerHTML = `Prediction: <strong>${data.class}</strong><br/>Confidence: <strong>${confidencePercent}%</strong>`;
          }
        } else {
          resultDiv.textContent = 'Prediction failed. Try again.';
        }
        clearBtn.style.display = 'inline-block';
      }, 9000);
    })
    .catch(() => {
      setTimeout(() => {
        resultDiv.textContent = 'Error connecting to the server.';
        clearBtn.style.display = 'inline-block';
      }, 9000);
    });
}

clearBtn.addEventListener('click', () => {
  previewImage.src = '';
  previewImage.style.display = 'none';
  instructionText.style.display = 'block';
  resultDiv.textContent = '';
  clearBtn.style.display = 'none';
  fileInput.value = null;
});
