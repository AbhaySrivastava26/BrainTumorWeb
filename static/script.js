document.getElementById('uploadBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('fileInput');
    const result = document.getElementById('result');

    if (!fileInput.files.length) {
        result.textContent = 'Please upload an image first.';
        return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    try {
        const res = await fetch('/predict', {
            method: 'POST',
            body: formData
        });

        const data = await res.json();
        result.textContent = data.prediction || data.error;
    } catch (error) {
        result.textContent = 'Error occurred: ' + error.message;
    }
});
