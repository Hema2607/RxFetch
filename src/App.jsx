import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Welcome from "./components/Welcome";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import UploadPrescription from "./components/UploadPrescription";
import LocationSelector from "./components/LocationSelector";
import PharmacyList from "./components/PharmacyList";
import OrderPlacing from "./components/OrderPlacing";
import PastHistory from "./components/PastHistory";
import Profile from "./components/Profile";
import Navbar from "./components/Navbar";

const App = () => {
  const [prescriptionList, setPrescriptionList] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);

  const location = useLocation(); // ✅ Get current route

  // ✅ Hide Navbar on Welcome, Login, and Register pages
  const hideNavbarPaths = ["/", "/login", "/register"];
  const showNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {/* ✅ Show Navbar on all pages except Welcome, Login, and Register */}
      {showNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={
            <Home
              prescriptionList={prescriptionList}
              setPrescriptionList={setPrescriptionList}
            />
          }
        />
        <Route
          path="/upload-prescription"
          element={<UploadPrescription setPrescriptionList={setPrescriptionList} />}
        />
        <Route
          path="/location"
          element={<LocationSelector onLocationSelect={setSelectedLocation} />}
        />
        <Route
          path="/pharmacies"
          element={
            <PharmacyList
              location={selectedLocation}
              onSelectPharmacy={setSelectedPharmacy}
            />
          }
        />
        <Route
          path="/order"
          element={
            <OrderPlacing
              selectedPharmacy={selectedPharmacy}
              prescriptionList={prescriptionList}
              userLocation={selectedLocation}
              onUpdateLocation={() => setSelectedLocation(null)}
            />
          }
        />
        <Route path="/history" element={<PastHistory />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
};

export default App;
