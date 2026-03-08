import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "300px",
};

export default function MapView({ place }) {
  if (!place?.location) return null;

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const lat = place.location.latitude;
  const lng = place.location.longitude;
  const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

  if (!apiKey) {
    return (
      <div className="bg-slate-800 p-5 rounded-xl mb-4 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-3">📍 الموقع على الخريطة</h2>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          افتح الموقع في Google Maps
        </a>
      </div>
    );
  }

  const center = { lat, lng };

  return (
    <div className="bg-slate-800 rounded-xl mb-4 border border-slate-700 overflow-hidden">
      <h2 className="text-xl font-bold text-white p-4 pb-0">📍 الموقع على الخريطة</h2>
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
          <Marker position={center} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
}