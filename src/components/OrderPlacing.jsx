import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase/firebaseConfig"; // Import Firestore & Auth
import { collection, addDoc } from "firebase/firestore";
import "../styles/OrderPlacing.css";

const OrderPlacing = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [editedLocation, setEditedLocation] = useState(state?.location);
  const selectedPharmacy = state?.selectedPharmacy;

  // Prescription list (fetched dynamically)
  const [prescriptionList, setPrescriptionList] = useState([]);

  useEffect(() => {
    // Fetch extracted prescription list dynamically
    const fetchPrescription = async () => {
      try {
        const response = await fetch("/prescriptionList.json"); // Read JSON file
        const data = await response.json();
        setPrescriptionList(data || []);
      } catch (error) {
        console.error("Error fetching prescription list:", error);
      }
    };

    fetchPrescription();

    if (!state?.location) {
      navigate("/location");
    }
  }, [state, navigate]);

  const handleConfirmOrder = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("⚠ You must be logged in to place an order.");
      navigate("/login");
      return;
    }

    if (!selectedPharmacy || !prescriptionList.length || !editedLocation) {
      alert("⚠ Please complete all steps before placing an order.");
      return;
    }

    const newOrder = {
      userId: user.uid, // Unique to the logged-in user
      pharmacy: selectedPharmacy.name,
      prescriptionList,
      location: editedLocation,
      date: new Date().toLocaleString(), // Store date of order
    };

    try {
      // ✅ Save order to Firestore
      await addDoc(collection(db, "orders"), newOrder);
      alert("✅ Order placed successfully!");
      navigate("/home");
    } catch (error) {
      console.error("Error saving order:", error);
      alert("⚠ Failed to place order. Please try again.");
    }
  };

  return (
    <div className="order-container">
      <h2>Confirm Your Order</h2>

      <h3>Pharmacy: {selectedPharmacy?.name || "⚠ Not Selected"}</h3>

      <h3>Prescription List:</h3>
      <ul>
        {prescriptionList.length > 0 ? (
          prescriptionList.map((med, index) => <li key={index}>{med}</li>)
        ) : (
          <p className="error-msg">⚠ No medicines detected.</p>
        )}
      </ul>

      <h3>Delivery Location:</h3>
      {editedLocation ? (
        <p>📍 {editedLocation.lat}, {editedLocation.lng}</p>
      ) : (
        <p className="error-msg">⚠ Location not set.</p>
      )}

      <button onClick={() => navigate("/location")} className="edit-location">
        Edit Location
      </button>

      <button
        onClick={handleConfirmOrder}
        className="confirm-btn"
        disabled={!selectedPharmacy || !prescriptionList.length || !editedLocation}
      >
        Place Order
      </button>
    </div>
  );
};

export default OrderPlacing;
