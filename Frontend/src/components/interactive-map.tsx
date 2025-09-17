import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import { 
  MapPin, 
  Search, 
  Crosshair, 
  Navigation,
  Layers,
  Plus,
  Minus,
  RotateCcw,
  CheckCircle
} from 'lucide-react';

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface InteractiveMapProps {
  selectedLocation: Location | null;
  onLocationSelect: (location: Location) => void;
  className?: string;
}

export function InteractiveMap({ selectedLocation, onLocationSelect, className = "" }: InteractiveMapProps) {
  const [mapView, setMapView] = useState<'street' | 'satellite'>('street');
  const [zoom, setZoom] = useState(15);
  const [searchAddress, setSearchAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [nearbyIssues] = useState([
    { id: '1', lat: 40.7128, lng: -74.0060, type: 'pothole', status: 'pending' },
    { id: '2', lat: 40.7589, lng: -73.9851, type: 'streetlight', status: 'resolved' },
    { id: '3', lat: 40.7505, lng: -73.9934, type: 'garbage', status: 'in_review' }
  ]);

  const mapRef = useRef<HTMLDivElement>(null);

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser');
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        });
      });

      const location: Location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        address: 'Current Location'
      };

      setCurrentLocation(location);
      onLocationSelect(location);
      toast.success('Location detected successfully!');
    } catch (error) {
      console.error('Geolocation error:', error);
      toast.error('Unable to detect your location. Please search for an address.');
    }
  };

  const searchForAddress = async () => {
    if (!searchAddress.trim()) return;
    
    setIsSearching(true);
    try {
      // Demo implementation - in a real app, this would use a geocoding API
      // For now, we'll simulate with some demo locations
      const demoLocations: Record<string, Location> = {
        'main street': { lat: 40.7128, lng: -74.0060, address: 'Main Street, Demo City' },
        'oak avenue': { lat: 40.7589, lng: -73.9851, address: 'Oak Avenue, Demo City' },
        'park road': { lat: 40.7505, lng: -73.9934, address: 'Park Road, Demo City' },
        'downtown': { lat: 40.7614, lng: -73.9776, address: 'Downtown, Demo City' }
      };

      const searchKey = searchAddress.toLowerCase();
      const found = Object.keys(demoLocations).find(key => 
        searchKey.includes(key) || key.includes(searchKey)
      );

      if (found) {
        const location = demoLocations[found];
        onLocationSelect(location);
        toast.success(`Found: ${location.address}`);
      } else {
        // Generate a random nearby location for demo
        const randomLocation: Location = {
          lat: 40.7500 + (Math.random() - 0.5) * 0.02,
          lng: -73.9900 + (Math.random() - 0.5) * 0.02,
          address: searchAddress
        };
        onLocationSelect(randomLocation);
        toast.success(`Location found: ${searchAddress}`);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search for address. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleMapClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;
    
    const rect = mapRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Convert pixel coordinates to lat/lng (simplified calculation)
    const mapWidth = rect.width;
    const mapHeight = rect.height;
    
    // Demo calculation - in a real map, this would use proper projection math
    const centerLat = selectedLocation?.lat || 40.7589;
    const centerLng = selectedLocation?.lng || -73.9851;
    
    const latRange = 0.02 / zoom * 15; // Adjust based on zoom
    const lngRange = 0.02 / zoom * 15;
    
    const lat = centerLat + (0.5 - y / mapHeight) * latRange;
    const lng = centerLng + (x / mapWidth - 0.5) * lngRange;
    
    const newLocation: Location = {
      lat: Number(lat.toFixed(6)),
      lng: Number(lng.toFixed(6)),
      address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    };
    
    onLocationSelect(newLocation);
    toast.success('Location selected on map');
  }, [selectedLocation, zoom, onLocationSelect]);

  const getIssueIcon = (type: string) => {
    const icons = {
      pothole: '🕳️',
      streetlight: '💡',
      garbage: '🗑️',
      water: '💧',
      road: '🛣️'
    };
    return icons[type as keyof typeof icons] || '📍';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'in_review': return 'bg-blue-500';
      case 'resolved': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-primary" />
              <span>Select Location</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMapView(mapView === 'street' ? 'satellite' : 'street')}
                className="text-xs"
              >
                <Layers className="w-4 h-4 mr-1" />
                {mapView === 'street' ? 'Satellite' : 'Street'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Controls */}
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search for an address or landmark..."
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchForAddress()}
                className="pl-10"
              />
            </div>
            <Button
              onClick={searchForAddress}
              disabled={isSearching || !searchAddress.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              {isSearching ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="outline"
              onClick={getCurrentLocation}
              className="hover:bg-primary hover:text-white"
            >
              <Crosshair className="w-4 h-4" />
            </Button>
          </div>

          {/* Map Container */}
          <div className="relative">
            <div
              ref={mapRef}
              className={`w-full h-80 rounded-lg border-2 border-dashed border-gray-300 cursor-crosshair transition-all duration-200 ${
                mapView === 'satellite' 
                  ? 'bg-gradient-to-br from-green-800 via-green-700 to-green-900' 
                  : 'bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300'
              } relative overflow-hidden`}
              onClick={handleMapClick}
            >
              {/* Map Grid */}
              <div className="absolute inset-0 opacity-20">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={`h-${i}`}
                    className="absolute w-full border-t border-gray-400"
                    style={{ top: `${i * 10}%` }}
                  />
                ))}
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={`v-${i}`}
                    className="absolute h-full border-l border-gray-400"
                    style={{ left: `${i * 10}%` }}
                  />
                ))}
              </div>

              {/* Street/Building Overlay */}
              {mapView === 'street' && (
                <div className="absolute inset-0">
                  {/* Demo streets */}
                  <div className="absolute bg-gray-600 h-2 w-full top-1/3 opacity-60"></div>
                  <div className="absolute bg-gray-600 w-2 h-full left-1/2 opacity-60"></div>
                  <div className="absolute bg-gray-600 h-1 w-3/4 top-2/3 left-1/8 opacity-40"></div>
                  
                  {/* Demo buildings */}
                  <div className="absolute bg-gray-500 w-8 h-8 top-1/4 left-1/4 opacity-50 rounded"></div>
                  <div className="absolute bg-gray-500 w-6 h-12 top-1/2 left-3/4 opacity-50 rounded"></div>
                  <div className="absolute bg-gray-500 w-10 h-6 bottom-1/4 right-1/4 opacity-50 rounded"></div>
                </div>
              )}

              {/* Nearby Issues */}
              {nearbyIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  style={{
                    left: `${Math.random() * 80 + 10}%`,
                    top: `${Math.random() * 80 + 10}%`,
                  }}
                  title={`${issue.type} - ${issue.status}`}
                >
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(issue.status)} border-2 border-white shadow-md`}></div>
                </div>
              ))}

              {/* Selected Location Marker */}
              {selectedLocation && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="w-6 h-6 bg-red-500 rounded-full border-3 border-white shadow-lg animate-pulse"></div>
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                      Selected Location
                    </div>
                  </div>
                </div>
              )}

              {/* Current Location Marker */}
              {currentLocation && (
                <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md">
                    <div className="w-2 h-2 bg-blue-300 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
                  </div>
                </div>
              )}

              {/* Map Controls */}
              <div className="absolute top-2 right-2 flex flex-col space-y-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(Math.min(zoom + 1, 20))}
                  className="w-8 h-8 p-0 bg-white/90 hover:bg-white"
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(Math.max(zoom - 1, 1))}
                  className="w-8 h-8 p-0 bg-white/90 hover:bg-white"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(15)}
                  className="w-8 h-8 p-0 bg-white/90 hover:bg-white"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>

              {/* Zoom Level */}
              <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                Zoom: {zoom}
              </div>
            </div>

            {/* Click Instructions */}
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-3 py-2 rounded-lg">
              Click on the map to select a location
            </div>
          </div>

          {/* Selected Location Info */}
          {selectedLocation && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-900">Location Selected</span>
              </div>
              <div className="space-y-1 text-sm">
                <p className="text-gray-700">
                  <strong>Address:</strong> {selectedLocation.address || 'Custom location'}
                </p>
                <p className="text-gray-700 font-mono">
                  <strong>Coordinates:</strong> {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                </p>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Nearby Issues</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Pending</span>
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>In Review</span>
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Resolved</span>
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}