import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UploadPrescription = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));

    // Save the file to "C:/Users/HP/Downloads"
    const filePath = `C:/Users/HP/Downloads/${file.name}`;

    // Convert file to Base64 and save it locally
    const reader = new FileReader();
    reader.onloadend = async () => {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, fileData: reader.result }),
      });

      if (response.ok) {
        console.log("File uploaded and processed successfully.");
        navigate("/list-medicines");
      } else {
        console.error("Error processing file.");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="upload-container">
      <h2>Upload Prescription</h2>
      <div className="upload-box">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {preview && <img src={preview} alt="Prescription Preview" className="preview-image" />}
      </div>
    </div>
  );
};

export default UploadPrescription;
