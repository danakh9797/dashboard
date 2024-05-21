"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const HomePage = () => {
  const [locations, setLocations] = useState({});

  useEffect(() => {
    console.log("start");

    const fetchLocations = async () => {
      try {
        await axios
          .get("https://testing-na3j.onrender.com/locations")
          .then((response) => setLocations(response.data));
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();

    const interval = setInterval(fetchLocations, 5000);

    return () => clearInterval(interval);
  }, []);

  const icon = L.icon({
    iconUrl: "/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      {typeof window !== "undefined" && (
        <MapContainer
          center={[21.42664, 39.82563]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {Object.keys(locations).map((userId) => (
            <Marker
              key={userId}
              position={[
                locations[userId].latitude,
                locations[userId].longitude,
              ]}
              icon={icon}
            >
              <Popup>
                User: {userId} <br /> Last updated:{" "}
                {new Date(locations[userId].timestamp).toLocaleTimeString()}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default HomePage;
