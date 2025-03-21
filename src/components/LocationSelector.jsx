import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/LocationSelector.css";
import L from "leaflet";
import { useNavigate } from "react-router-dom";

const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const LocationSelector = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const navigate = useNavigate();

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const newPosition = { lat: e.latlng.lat, lng: e.latlng.lng };
        setSelectedLocation(newPosition);
      },
    });

    return selectedLocation ? <Marker position={selectedLocation} icon={customIcon} /> : null;
  };

  const handleConfirm = () => {
    if (!selectedLocation) {
      alert("Please select a location on the map!");
      return;
    }
    navigate("/pharmacies", { state: { location: selectedLocation } });
  };

  return (
    <div className="location-selector-container">
      <h2>Select Your Location</h2>
      <MapContainer center={[20.5937, 78.9629]} zoom={5} className="map">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker />
      </MapContainer>
      <button onClick={handleConfirm} className="confirm-btn">
        Confirm Location
      </button>
    </div>
  );
};

export default LocationSelector;
