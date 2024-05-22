"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamically import react-leaflet components
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

const HomePage = () => {
  const [locations, setLocations] = useState({});
  const [icon, setIcon] = useState(null);

  useEffect(() => {
    console.log("start");

    const fetchLocations = async () => {
      try {
        const response = await axios.get(
          "https://testing-na3j.onrender.com/locations"
        );
        setLocations(response.data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();

    const interval = setInterval(fetchLocations, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Ensure Leaflet-specific code only runs on the client side
    if (typeof window !== "undefined") {
      const L = require("leaflet");
      const icon = L.icon({
        iconUrl: "/images/marker-icon.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });
      setIcon(icon);
    }
  }, []);

  if (!icon) return null; // Ensure icon is loaded before rendering the map

  return (
    <div style={{ height: "100vh", width: "100%" }}>
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
            position={[locations[userId].latitude, locations[userId].longitude]}
            icon={icon}
          >
            <Popup>
              User: {locations[userId].username} <br /> Last updated:{" "}
              {new Date(locations[userId].timestamp).toLocaleTimeString()}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default HomePage;
