"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// delete L.Icon.Default.prototype._getIconUrl;

// Dynamically import MapContainer to prevent SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  {
    ssr: false,
  }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  {
    ssr: false,
  }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  {
    ssr: false,
  }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png").default,
//   iconUrl: require("leaflet/dist/images/marker-icon.png").default,
//   shadowUrl: require("leaflet/dist/images/marker-shadow.png").default,
// });

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

    fetchLocations(); // Fetch locations initially

    const interval = setInterval(fetchLocations, 5000); // Fetch new data every 5 seconds

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  const icon = L.icon({
    iconUrl: "/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

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
              User: {userId} <br /> Last updated:{" "}
              {new Date(locations[userId].timestamp).toLocaleTimeString()}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default HomePage;
