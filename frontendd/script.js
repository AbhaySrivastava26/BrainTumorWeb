async function predict() {
  const input = document.getElementById("imageUpload");
  const file = input.files[0];

  if (!file) {
    alert("Please upload an image first.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("http://127.0.0.1:8000/predict", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  document.getElementById("result").innerHTML = `
    <strong>Prediction:</strong> ${data.class} <br>
    <strong>Confidence:</strong> ${(data.confidence * 100).toFixed(2)}%
  `;
}
