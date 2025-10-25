import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapPage = ({ onLocationSelect, initialCenter }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // Use ref to store callback to avoid adding it as dependency
  const onLocationSelectRef = useRef(onLocationSelect);
  
  useEffect(() => {
    onLocationSelectRef.current = onLocationSelect;
  }, [onLocationSelect]);

  // Default center (New York)
  const defaultCenter = [40.7128, -74.0060];

  useEffect(() => {
    // Prevent re-initialization if map already exists
    if (mapInstanceRef.current) {
      return;
    }

    // Initialize map only once
    const leafletMap = L.map(mapRef.current).setView(
      initialCenter ? [initialCenter.lat, initialCenter.lng] : defaultCenter,
      13
    );

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(leafletMap);

    // Add click event listener
    leafletMap.on('click', (e) => {
      const { lat, lng } = e.latlng;

      // Remove existing marker
      if (markerRef.current) {
        leafletMap.removeLayer(markerRef.current);
      }

      // Add new marker
      const newMarker = L.marker([lat, lng], {
        draggable: true,
      }).addTo(leafletMap);

      // Bind popup to marker
      newMarker.bindPopup('Selected Location<br>Drag to adjust').openPopup();

      markerRef.current = newMarker;

      // Call the callback with coordinates
      if (onLocationSelectRef.current) {
        onLocationSelectRef.current(lat, lng);
      }

      // Add drag end listener
      newMarker.on('dragend', (dragEvent) => {
        const newPosition = dragEvent.target.getLatLng();
        const newLat = newPosition.lat;
        const newLng = newPosition.lng;
        
        // Update popup content
        newMarker.setPopupContent('Selected Location (Adjusted)<br>Drag to adjust');
        
        if (onLocationSelectRef.current) {
          onLocationSelectRef.current(newLat, newLng);
        }
      });
    });

    // If initial center is provided, add a marker
    if (initialCenter) {
      const initialMarker = L.marker([initialCenter.lat, initialCenter.lng], {
        draggable: true,
      }).addTo(leafletMap);
      
      initialMarker.bindPopup('Current Location<br>Drag to adjust').openPopup();
      markerRef.current = initialMarker;

      // Add drag end listener for initial marker
      initialMarker.on('dragend', (dragEvent) => {
        const newPosition = dragEvent.target.getLatLng();
        const newLat = newPosition.lat;
        const newLng = newPosition.lng;
        
        initialMarker.setPopupContent('Selected Location (Adjusted)<br>Drag to adjust');
        
        if (onLocationSelectRef.current) {
          onLocationSelectRef.current(newLat, newLng);
        }
      });
    }

    mapInstanceRef.current = leafletMap;

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only initialize once - initialCenter and defaultCenter are intentionally excluded

  // Separate effect to update map view when initialCenter changes
  useEffect(() => {
    if (mapInstanceRef.current && initialCenter) {
      mapInstanceRef.current.setView([initialCenter.lat, initialCenter.lng], 13);
      
      // Update or add marker for new initial center
      if (markerRef.current) {
        mapInstanceRef.current.removeLayer(markerRef.current);
      }
      
      const newMarker = L.marker([initialCenter.lat, initialCenter.lng], {
        draggable: true,
      }).addTo(mapInstanceRef.current);
      
      newMarker.bindPopup('Current Location<br>Drag to adjust').openPopup();
      markerRef.current = newMarker;

      // Add drag end listener
      newMarker.on('dragend', (dragEvent) => {
        const newPosition = dragEvent.target.getLatLng();
        const newLat = newPosition.lat;
        const newLng = newPosition.lng;
        
        newMarker.setPopupContent('Selected Location (Adjusted)<br>Drag to adjust');
        
        if (onLocationSelectRef.current) {
          onLocationSelectRef.current(newLat, newLng);
        }
      });
    }
  }, [initialCenter]);

  return (
    <div 
      ref={mapRef} 
      style={{ 
        width: '100%', 
        height: '400px', 
        borderRadius: '8px',
        border: '2px solid #e2e8f0'
      }} 
    />
  );
};

export default MapPage;