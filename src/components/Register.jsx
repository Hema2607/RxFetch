import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import "../styles/Auth.css";

const Register = () => {
  const [userData, setUserData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    age: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (userData.password !== userData.confirmPassword) {
      setError("⚠ Passwords do not match!");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: userData.name,
        phone: userData.phone,
        email: userData.email,
        address: userData.address,
        age: userData.age,
      });

      navigate("/home");
    } catch (err) {
      setError("⚠ Failed to create account. Try again!");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <h1>Welcome to RxFetch</h1>
        <p>
          RxFetch is an AI-powered medicine delivery platform designed for elderly and disabled users.  
          Upload your prescription, detect medicines automatically, and get them delivered from nearby pharmacies!
        </p>
      </div>
      <div className="auth-box">
        <h2>Register</h2>
        {error && <p className="error-msg">{error}</p>}
        <form onSubmit={handleRegister}>
          <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
          <input type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="text" name="address" placeholder="Address" onChange={handleChange} required />
          <input type="number" name="age" placeholder="Age" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />
          <button type="submit">Register</button>
        </form>
        <p>Already have an account? <span onClick={() => navigate("/login")}>Login</span></p>
      </div>
    </div>
  );
};

export default Register;
