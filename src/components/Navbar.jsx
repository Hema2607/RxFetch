import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <h2 className="logo" onClick={() => navigate("/")}>
        RxFetch
      </h2>
      <div className="nav-links">
        <button onClick={() => navigate("/history")} className="nav-btn">
          Past History
        </button>
        <button onClick={() => navigate("/profile")} className="nav-btn">
          Profile
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
