import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
width: "100%",
height: "300px"
};

export default function MapView({ place }) {

if (!place?.location) return null;

const center = {
lat: place.location.latitude,
lng: place.location.longitude
};

return (
<LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
<GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
<Marker position={center}/>
</GoogleMap>
</LoadScript>
);
}