import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  const [prescription, setPrescription] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const navigate = useNavigate();

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    setPrescription(file);
  
    // Save the file to "C:/Users/HP/Downloads"
    const filePath = `C:/Users/HP/Downloads/${file.name}`;
  
    // Convert file to Blob and save locally
    const reader = new FileReader();
    reader.onloadend = () => {
      const a = document.createElement("a");
      a.href = reader.result;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
    reader.readAsDataURL(file);
  };
  
  const fetchMedicines = async () => {
    try {
      const response = await fetch("/prescriptionList.json");


 // Fetch JSON file
      if (!response.ok) throw new Error("Failed to load prescription data");

      const data = await response.json();
      setMedicines(data);

      // Store detected medicines in local storage for OrderPlacing.jsx
      localStorage.setItem("prescriptionList", JSON.stringify(data));
    } catch (error) {
      console.error("Error fetching prescription data:", error);
      alert("Failed to fetch prescription details!");
    }
  };

  useEffect(() => {
    if (prescription) {
      setTimeout(() => {
        fetchMedicines(); // Fetch extracted medicines when prescription is uploaded
      }, 1000);
    }
  }, [prescription]);

  return (
    <div className="home-container">
      <h1 className="fade-in">Medicine Delivery System</h1>

      {!prescription ? (
        <div className="upload-box">
          <h3>Upload Your Prescription</h3>
          <input type="file" onChange={handleUpload} />
        </div>
      ) : (
        <div className="analyze-box slide-in">
          <h3>Prescription Uploaded!</h3>
          <button onClick={fetchMedicines} className="analyze-btn">
            Analyze Prescription
          </button>
        </div>
      )}

      {medicines.length > 0 && (
        <div className="medicines-box bounce-in">
          <h3>Detected Medicines</h3>
          <ul>
            {medicines.map((med, index) => (
              <li key={index}>{med}</li>
            ))}
          </ul>
          <button onClick={() => navigate("/location")} className="location-btn">
            Choose Location
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
