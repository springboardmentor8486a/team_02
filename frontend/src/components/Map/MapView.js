import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapView.css';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const createCustomIcon = (color, type) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="marker-icon ${type}" style="background-color: ${color}">
        <i class="fas fa-${getIconForType(type)}"></i>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

const getIconForType = (type) => {
  const iconMap = {
    'litter': 'trash',
    'graffiti': 'paint-brush',
    'damage': 'exclamation-triangle',
    'other': 'map-marker-alt'
  };
  return iconMap[type] || 'map-marker-alt';
};

// Map event handling component
const MapEvents = ({ onMapClick }) => {
  useMapEvents({
    click: onMapClick,
  });
  return null;
};

const MapView = ({ 
  markers = [], 
  onAddMarker, 
  onUpdateMarker, 
  onDeleteMarker,
  selectedMarker,
  onMarkerSelect,
  center = [39.9042, 116.4074], // Beijing coordinates
  zoom = 13 
}) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showMarkerModal, setShowMarkerModal] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [newMarker, setNewMarker] = useState({
    type: 'litter',
    severity: 'medium',
    description: '',
    status: 'reported'
  });
  const [editingMarker, setEditingMarker] = useState(null);
  const mapRef = useRef(null);

  // Handle map click events
  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    const clickedLocation = { lat, lng };
    
    // Check if clicked on a marker
    const isClickOnMarker = markers.some(marker => 
      Math.abs(marker.lat - lat) < 0.0001 && Math.abs(marker.lng - lng) < 0.0001
    );
    
    if (!isClickOnMarker) {
      setSelectedLocation(clickedLocation);
      setShowLocationModal(true);
    }
  };

  // Handle marker click events
  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
    setShowMarkerModal(true);
  };

  // Handle map zoom events
  const handleZoomEnd = (e) => {
    const newZoom = e.target.getZoom();
    setCurrentZoom(newZoom);
  };

  // Add new marker
  const handleAddMarker = () => {
    if (selectedLocation && newMarker.description.trim()) {
      const marker = {
        id: Date.now().toString(),
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        ...newMarker,
        timestamp: new Date().toISOString(),
        reporter: 'current_user' // This should be obtained from user state
      };
      
      onAddMarker(marker);
      setShowLocationModal(false);
      setNewMarker({
        type: 'litter',
        severity: 'medium',
        description: '',
        status: 'reported'
      });
    }
  };

  // Update marker
  const handleUpdateMarker = () => {
    if (editingMarker) {
      onUpdateMarker(editingMarker);
      setShowMarkerModal(false);
      setEditingMarker(null);
    }
  };

  // Delete marker
  const handleDeleteMarker = () => {
    if (editingMarker) {
      onDeleteMarker(editingMarker.id);
      setShowMarkerModal(false);
      setEditingMarker(null);
    }
  };

  // Start editing marker
  const handleEditMarker = (marker) => {
    setEditingMarker({ ...marker });
  };

  // Get marker color
  const getMarkerColor = (type, severity) => {
    const colorMap = {
      'litter': severity === 'high' ? '#e74c3c' : severity === 'medium' ? '#f39c12' : '#27ae60',
      'graffiti': severity === 'high' ? '#8e44ad' : severity === 'medium' ? '#9b59b6' : '#bb8fce',
      'damage': severity === 'high' ? '#c0392b' : severity === 'medium' ? '#e67e22' : '#f1c40f',
      'other': severity === 'high' ? '#34495e' : severity === 'medium' ? '#7f8c8d' : '#95a5a6'
    };
    return colorMap[type] || '#3498db';
  };

  // Get status color
  const getStatusColor = (status) => {
    const statusMap = {
      'reported': '#3498db',
      'in_progress': '#f39c12',
      'completed': '#27ae60',
      'cancelled': '#e74c3c'
    };
    return statusMap[status] || '#3498db';
  };

  return React.createElement('div', { className: 'map-view' },
    React.createElement('div', { className: 'map-container' },
      React.createElement(MapContainer, {
        center: center,
        zoom: zoom,
        style: { height: '100%', width: '100%' },
        ref: mapRef,
        whenReady: (map) => {
          map.target.on('zoomend', handleZoomEnd);
        }
      },
        React.createElement(TileLayer, {
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }),
        
        React.createElement(MapEvents, { onMapClick: handleMapClick }),
        
        ...markers.map((marker) =>
          React.createElement(Marker, {
            key: marker.id,
            position: [marker.lat, marker.lng],
            icon: createCustomIcon(getMarkerColor(marker.type, marker.severity), marker.type),
            eventHandlers: {
              click: () => handleMarkerClick(marker)
            }
          },
            React.createElement(Popup, null,
              React.createElement('div', { className: 'marker-popup' },
                React.createElement('h4', null, marker.type.charAt(0).toUpperCase() + marker.type.slice(1)),
                React.createElement('p', null, marker.description),
                React.createElement('div', { className: 'marker-details' },
                  React.createElement('span', { className: `severity-badge ${marker.severity}` },
                    marker.severity
                  ),
                  React.createElement('span', { className: `status-badge ${marker.status}` },
                    marker.status
                  )
                ),
                React.createElement('small', null, new Date(marker.timestamp).toLocaleString())
              )
            )
          )
        )
      )
    ),

    // Zoom Level Display
    React.createElement('div', { className: 'zoom-display' },
      React.createElement('span', { className: 'zoom-level' },
        `Zoom Level: ${currentZoom}`
      )
    ),

    // Location Selection Modal
    showLocationModal && React.createElement('div', { className: 'modal-overlay' },
      React.createElement('div', { className: 'modal-content' },
        React.createElement('div', { className: 'modal-header' },
          React.createElement('h3', null, 'Add New Issue'),
          React.createElement('button', {
            className: 'close-btn',
            onClick: () => setShowLocationModal(false)
          }, '×')
        ),
        
        React.createElement('div', { className: 'modal-body' },
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', null, 'Issue Type'),
            React.createElement('select', {
              value: newMarker.type,
              onChange: (e) => setNewMarker({...newMarker, type: e.target.value})
            },
              React.createElement('option', { value: 'litter' }, 'Litter'),
              React.createElement('option', { value: 'graffiti' }, 'Graffiti'),
              React.createElement('option', { value: 'damage' }, 'Damage'),
              React.createElement('option', { value: 'other' }, 'Other')
            )
          ),
          
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', null, 'Severity'),
            React.createElement('select', {
              value: newMarker.severity,
              onChange: (e) => setNewMarker({...newMarker, severity: e.target.value})
            },
              React.createElement('option', { value: 'low' }, 'Low'),
              React.createElement('option', { value: 'medium' }, 'Medium'),
              React.createElement('option', { value: 'high' }, 'High')
            )
          ),
          
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', null, 'Description'),
            React.createElement('textarea', {
              value: newMarker.description,
              onChange: (e) => setNewMarker({...newMarker, description: e.target.value}),
              placeholder: 'Please describe the issue in detail...',
              rows: 3
            })
          ),
          
          React.createElement('div', { className: 'location-info' },
            React.createElement('p', null,
              React.createElement('strong', null, 'Location: '),
              `${selectedLocation?.lat.toFixed(6)}, ${selectedLocation?.lng.toFixed(6)}`
            )
          )
        ),
        
        React.createElement('div', { className: 'modal-footer' },
          React.createElement('button', {
            className: 'btn btn-secondary',
            onClick: () => setShowLocationModal(false)
          }, 'Cancel'),
          React.createElement('button', {
            className: 'btn btn-primary',
            onClick: handleAddMarker,
            disabled: !newMarker.description.trim()
          }, 'Add')
        )
      )
    ),

    // Marker Details Modal
    showMarkerModal && (selectedMarker || editingMarker) && React.createElement('div', { className: 'modal-overlay' },
      React.createElement('div', { className: 'modal-content' },
        React.createElement('div', { className: 'modal-header' },
          React.createElement('h3', null, editingMarker ? 'Edit Issue' : 'Issue Details'),
          React.createElement('button', {
            className: 'close-btn',
            onClick: () => {
              setShowMarkerModal(false);
              setEditingMarker(null);
            }
          }, '×')
        ),
        
        React.createElement('div', { className: 'modal-body' },
          editingMarker ? React.createElement(React.Fragment, null,
            React.createElement('div', { className: 'form-group' },
              React.createElement('label', null, 'Issue Type'),
              React.createElement('select', {
                value: editingMarker.type,
                onChange: (e) => setEditingMarker({...editingMarker, type: e.target.value})
              },
                React.createElement('option', { value: 'litter' }, 'Litter'),
                React.createElement('option', { value: 'graffiti' }, 'Graffiti'),
                React.createElement('option', { value: 'damage' }, 'Damage'),
                React.createElement('option', { value: 'other' }, 'Other')
              )
            ),
            
            React.createElement('div', { className: 'form-group' },
              React.createElement('label', null, 'Severity'),
              React.createElement('select', {
                value: editingMarker.severity,
                onChange: (e) => setEditingMarker({...editingMarker, severity: e.target.value})
              },
                React.createElement('option', { value: 'low' }, 'Low'),
                React.createElement('option', { value: 'medium' }, 'Medium'),
                React.createElement('option', { value: 'high' }, 'High')
              )
            ),
            
            React.createElement('div', { className: 'form-group' },
              React.createElement('label', null, 'Status'),
              React.createElement('select', {
                value: editingMarker.status,
                onChange: (e) => setEditingMarker({...editingMarker, status: e.target.value})
              },
                React.createElement('option', { value: 'reported' }, 'Reported'),
                React.createElement('option', { value: 'in_progress' }, 'In Progress'),
                React.createElement('option', { value: 'completed' }, 'Completed'),
                React.createElement('option', { value: 'cancelled' }, 'Cancelled')
              )
            ),
            
            React.createElement('div', { className: 'form-group' },
              React.createElement('label', null, 'Description'),
              React.createElement('textarea', {
                value: editingMarker.description,
                onChange: (e) => setEditingMarker({...editingMarker, description: e.target.value}),
                rows: 3
              })
            )
          ) : React.createElement('div', { className: 'marker-details-view' },
            React.createElement('div', { className: 'detail-row' },
              React.createElement('strong', null, 'Type: '),
              selectedMarker?.type
            ),
            React.createElement('div', { className: 'detail-row' },
              React.createElement('strong', null, 'Severity: '),
              React.createElement('span', { className: `severity-badge ${selectedMarker?.severity}` },
                selectedMarker?.severity
              )
            ),
            React.createElement('div', { className: 'detail-row' },
              React.createElement('strong', null, 'Status: '),
              React.createElement('span', { className: `status-badge ${selectedMarker?.status}` },
                selectedMarker?.status
              )
            ),
            React.createElement('div', { className: 'detail-row' },
              React.createElement('strong', null, 'Description: '),
              selectedMarker?.description
            ),
            React.createElement('div', { className: 'detail-row' },
              React.createElement('strong', null, 'Report Time: '),
              new Date(selectedMarker?.timestamp).toLocaleString()
            ),
            React.createElement('div', { className: 'detail-row' },
              React.createElement('strong', null, 'Reporter: '),
              selectedMarker?.reporter
            ),
            React.createElement('div', { className: 'detail-row' },
              React.createElement('strong', null, 'Location: '),
              `${selectedMarker?.lat.toFixed(6)}, ${selectedMarker?.lng.toFixed(6)}`
            )
          )
        ),
        
        React.createElement('div', { className: 'modal-footer' },
          editingMarker ? React.createElement(React.Fragment, null,
            React.createElement('button', {
              className: 'btn btn-danger',
              onClick: handleDeleteMarker
            }, 'Delete'),
            React.createElement('button', {
              className: 'btn btn-secondary',
              onClick: () => setEditingMarker(null)
            }, 'Cancel'),
            React.createElement('button', {
              className: 'btn btn-primary',
              onClick: handleUpdateMarker
            }, 'Save')
          ) : React.createElement(React.Fragment, null,
            React.createElement('button', {
              className: 'btn btn-secondary',
              onClick: () => setShowMarkerModal(false)
            }, 'Close'),
            React.createElement('button', {
              className: 'btn btn-primary',
              onClick: () => handleEditMarker(selectedMarker)
            }, 'Edit')
          )
        )
      )
    )
  );
};

export default MapView;
