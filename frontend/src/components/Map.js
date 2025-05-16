import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// This component handles map interactions
const MapController = ({ origin, destination }) => {
  const map = useMap();
  
  useEffect(() => {
    if (origin && destination) {
      // Center the map to fit both points
      const bounds = L.latLngBounds([origin, destination]);
      map.fitBounds(bounds, { padding: [50, 50] });
      
      // Draw a simple line between points
      const polyline = L.polyline([origin, destination], { color: '#4caf50', weight: 5 });
      polyline.addTo(map);
      
      // Clean up on unmount or when props change
      return () => {
        map.removeLayer(polyline);
      };
    }
  }, [map, origin, destination]);
  
  return null;
};

function Map({ 
  origin = [51.5074, -0.1278], // Default: London center
  destination = null,
  zoom = 13 
}) {
  const center = origin || [51.5074, -0.1278];
  
  return (
    <div className="map-container">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {origin && (
          <Marker position={origin}>
            <Popup>Starting Point</Popup>
          </Marker>
        )}
        
        {destination && (
          <Marker position={destination}>
            <Popup>Destination</Popup>
          </Marker>
        )}
        
        {origin && destination && (
          <MapController origin={origin} destination={destination} />
        )}
      </MapContainer>
    </div>
  );
}

export default Map;