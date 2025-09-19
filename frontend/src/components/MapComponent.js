/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // ✅ Leaflet ko import karein

// ✅ Yeh code default marker icon ko theek karta hai
delete L.Icon.Default.prototype._get  
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const LocationMarker = ({ setLocation }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setLocation(e.latlng); // Parent component ko location bhejenge
    },
  });

  return position === null ? null : <Marker position={position}></Marker>;
};

const MapComponent = ({ setFormLocation }) => {
  const [defaultPosition, setDefaultPosition] = useState([28.7041, 77.1025]); // Default location

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MapContainer
        center={defaultPosition}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker setLocation={setFormLocation} />
      </MapContainer>
    </div>
  );
};

export default MapComponent;