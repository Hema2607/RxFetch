import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/PharmacyList.css";

const PharmacyList = () => {
  const { state } = useLocation();
  const location = state?.location;
  const prescriptionList = state?.prescriptionList || [];
  const navigate = useNavigate();
  const [pharmacies, setPharmacies] = useState([]);

  useEffect(() => {
    if (!location) return;

    const overpassUrl = `https://overpass-api.de/api/interpreter`;
    const query = `
      [out:json];
      node
        ["amenity"="pharmacy"]
        (around:10000,${location.lat},${location.lng});
      out;
    `;

    axios
      .post(overpassUrl, query)
      .then((response) => {
        const pharmacyData = response.data.elements.map((place) => ({
          id: place.id,
          name: place.tags.name || "Unnamed Pharmacy",
          lat: place.lat,
          lon: place.lon,
        }));
        setPharmacies(pharmacyData);
      })
      .catch((error) => console.error("Error fetching pharmacies:", error));
  }, [location]);

  const handleSelectPharmacy = (pharmacy) => {
    navigate("/order", {
      state: { selectedPharmacy: pharmacy, location, prescriptionList },
    });
  };

  return (
    <div className="pharmacy-list-container">
      <h2>Nearby Pharmacies</h2>
      {pharmacies.length > 0 ? (
        <ul className="pharmacy-list">
          {pharmacies.map((pharmacy) => (
            <li key={pharmacy.id} className="pharmacy-item">
              <i className="fas fa-prescription-bottle-alt"></i> {pharmacy.name}
              <br />
              📍 ({pharmacy.lat}, {pharmacy.lon})
              <button onClick={() => handleSelectPharmacy(pharmacy)}>
                Select
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-pharmacies">No pharmacies found nearby.</p>
      )}
    </div>
  );
};

export default PharmacyList;
