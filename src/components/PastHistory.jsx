import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebaseConfig"; // Firestore and Auth
import { collection, query, where, getDocs } from "firebase/firestore";
import "../styles/PastHistory.css";

const PastHistory = () => {
  const [pastOrders, setPastOrders] = useState([]); // Ensure it's an empty array by default
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return; // Prevent fetching if user is not logged in

    const fetchPastOrders = async () => {
      try {
        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, where("userId", "==", user.uid)); // Fetch orders for logged-in user
        const querySnapshot = await getDocs(q);

        const orders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPastOrders(orders); // Store fetched orders
        setLoading(false);
      } catch (error) {
        console.error("Error fetching past orders:", error);
        setLoading(false);
      }
    };

    fetchPastOrders();
  }, [user]);

  return (
    <div className="past-history-container">
      <h2>Past Orders</h2>

      {loading ? (
        <p>Loading orders...</p>
      ) : pastOrders.length === 0 ? (
        <p>No past orders found.</p>
      ) : (
        <div className="order-list">
          {pastOrders.map((order, index) => (
            <div key={index} className="order-card">
              <h3>{order.pharmacy}</h3>
              <p><strong>Date:</strong> {order.date}</p>
              <p><strong>Location:</strong> 📍 {order.location.lat}, {order.location.lng}</p>
              <h4>Prescriptions:</h4>
              <ul>
                {order.prescriptionList.map((med, i) => (
                  <li key={i}>{med}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PastHistory;
