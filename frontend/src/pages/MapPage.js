import React, { useState } from 'react';
import MapView from '../components/Map/MapView';
import './MapPage.css';

const MapPage = () => {
  const [markers, setMarkers] = useState([
    {
      id: '1',
      lat: 39.9042,
      lng: 116.4074,
      type: 'litter',
      severity: 'medium',
      description: 'Trash accumulation near the park entrance',
      status: 'reported',
      timestamp: new Date().toISOString(),
      reporter: 'user123'
    },
    {
      id: '2',
      lat: 39.9052,
      lng: 116.4084,
      type: 'damage',
      severity: 'high',
      description: 'Broken streetlight on Main Street',
      status: 'in_progress',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      reporter: 'user456'
    },
    {
      id: '3',
      lat: 39.9032,
      lng: 116.4064,
      type: 'graffiti',
      severity: 'low',
      description: 'Graffiti on the side of the building',
      status: 'completed',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      reporter: 'user789'
    }
  ]);

  const [selectedMarker, setSelectedMarker] = useState(null);

  const handleAddMarker = (newMarker) => {
    setMarkers([...markers, newMarker]);
  };

  const handleUpdateMarker = (updatedMarker) => {
    setMarkers(markers.map(marker => 
      marker.id === updatedMarker.id ? updatedMarker : marker
    ));
  };

  const handleDeleteMarker = (markerId) => {
    setMarkers(markers.filter(marker => marker.id !== markerId));
  };

  const handleMarkerSelect = (marker) => {
    setSelectedMarker(marker);
  };

  return React.createElement('div', { className: 'map-page' },
    React.createElement('div', { className: 'map-page-header' },
      React.createElement('div', { className: 'container' },
        React.createElement('h1', { className: 'map-page-title' },
          'Community Issues Map'
        ),
        React.createElement('p', { className: 'map-page-description' },
          'Report and track civic issues in your neighborhood. Click on the map to add a new issue or click on existing markers to view details.'
        )
      )
    ),
    
    React.createElement('div', { className: 'map-page-content' },
      React.createElement(MapView, {
        markers: markers,
        onAddMarker: handleAddMarker,
        onUpdateMarker: handleUpdateMarker,
        onDeleteMarker: handleDeleteMarker,
        selectedMarker: selectedMarker,
        onMarkerSelect: handleMarkerSelect,
        center: [39.9042, 116.4074],
        zoom: 13
      })
    )
  );
};

export default MapPage;
