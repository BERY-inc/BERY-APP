import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Polygon, Marker } from '@react-google-maps/api';
import { Zone } from '../services/metadataService';
import { Button } from './ui/button';
import { Loader2, MapPin, Navigation, MousePointer } from 'lucide-react';

interface ZoneMapSelectorProps {
    zones: Zone[];
    selectedZoneId: number | null;
    onZoneSelect: (zoneId: number) => void;
    onClose: () => void;
}

const containerStyle = {
    width: '100%',
    height: '400px'
};

// Default center (will be updated based on zones or user location)
const defaultCenter = {
    lat: 45.4215,
    lng: -75.6972
};

// Function to check if a point is inside a polygon
function isPointInPolygon(point: { lat: number; lng: number }, polygon: { lat: number; lng: number }[]): boolean {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].lng, yi = polygon[i].lat;
        const xj = polygon[j].lng, yj = polygon[j].lat;

        const intersect = ((yi > point.lat) !== (yj > point.lat))
            && (point.lng < (xj - xi) * (point.lat - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

export function ZoneMapSelector({ zones, selectedZoneId, onZoneSelect, onClose }: ZoneMapSelectorProps) {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""
    });

    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [markerLocation, setMarkerLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [loadingLocation, setLoadingLocation] = useState(false);

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        // Fit bounds to show all zones
        if (zones.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            zones.forEach(zone => {
                if (zone.formated_coordinates) {
                    zone.formated_coordinates.forEach(coord => {
                        bounds.extend(coord);
                    });
                }
            });
            map.fitBounds(bounds);
        } else {
            map.setCenter(defaultCenter);
            map.setZoom(2);
        }
        setMap(map);
    }, [zones]);

    const onUnmount = useCallback(function callback(map: google.maps.Map) {
        setMap(null);
    }, []);

    // Handle map click to manually place marker
    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            const location = {
                lat: e.latLng.lat(),
                lng: e.latLng.lng()
            };
            setMarkerLocation(location);

            // Auto-detect zone based on clicked location
            const detectedZone = zones.find(zone =>
                zone.formated_coordinates && isPointInPolygon(location, zone.formated_coordinates)
            );

            if (detectedZone) {
                onZoneSelect(detectedZone.id);
                console.log('Zone detected from click:', detectedZone.name);
                // Auto-close after a brief delay for visual feedback
                setTimeout(() => {
                    onClose();
                }, 800);
            } else {
                console.log('Clicked location is not in any zone');
                alert('This location is not in any available zone. Please click within a highlighted zone area.');
            }
        }
    };

    // Get user's current location
    const getUserLocation = () => {
        setLoadingLocation(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setMarkerLocation(location);

                    // Pan map to user location
                    if (map) {
                        map.panTo(location);
                        map.setZoom(10);
                    }

                    // Auto-detect zone
                    const detectedZone = zones.find(zone =>
                        zone.formated_coordinates && isPointInPolygon(location, zone.formated_coordinates)
                    );

                    if (detectedZone) {
                        onZoneSelect(detectedZone.id);
                        console.log('Auto-detected zone:', detectedZone.name);
                        // Auto-close after a brief delay for visual feedback
                        setTimeout(() => {
                            onClose();
                        }, 800);
                    } else {
                        console.log('No zone found for current location');
                        alert('Your current location is not in any available zone. Please select a location manually on the map.');
                    }

                    setLoadingLocation(false);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    alert('Unable to get your location. Please click on the map to select a location manually.');
                    setLoadingLocation(false);
                }
            );
        } else {
            alert('Geolocation is not supported by your browser. Please click on the map to select a location manually.');
            setLoadingLocation(false);
        }
    };

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center h-[400px] bg-slate-900 text-white">
                <Loader2 className="w-8 h-8 animate-spin mr-2" />
                Loading Map...
            </div>
        );
    }

    return (
        <div className="relative">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={defaultCenter}
                zoom={2}
                onLoad={onLoad}
                onUnmount={onUnmount}
                onClick={handleMapClick}
                options={{
                    styles: [
                        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                        {
                            featureType: "administrative.locality",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#d59563" }],
                        },
                        {
                            featureType: "poi",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#d59563" }],
                        },
                        {
                            featureType: "poi.park",
                            elementType: "geometry",
                            stylers: [{ color: "#263c3f" }],
                        },
                        {
                            featureType: "poi.park",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#6b9a76" }],
                        },
                        {
                            featureType: "road",
                            elementType: "geometry",
                            stylers: [{ color: "#38414e" }],
                        },
                        {
                            featureType: "road",
                            elementType: "geometry.stroke",
                            stylers: [{ color: "#212a37" }],
                        },
                        {
                            featureType: "road",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#9ca5b3" }],
                        },
                        {
                            featureType: "road.highway",
                            elementType: "geometry",
                            stylers: [{ color: "#746855" }],
                        },
                        {
                            featureType: "road.highway",
                            elementType: "geometry.stroke",
                            stylers: [{ color: "#1f2835" }],
                        },
                        {
                            featureType: "road.highway",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#f3d19c" }],
                        },
                        {
                            featureType: "transit",
                            elementType: "geometry",
                            stylers: [{ color: "#2f3948" }],
                        },
                        {
                            featureType: "transit.station",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#d59563" }],
                        },
                        {
                            featureType: "water",
                            elementType: "geometry",
                            stylers: [{ color: "#17263c" }],
                        },
                        {
                            featureType: "water",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#515c6d" }],
                        },
                        {
                            featureType: "water",
                            elementType: "labels.text.stroke",
                            stylers: [{ color: "#17263c" }],
                        }
                    ]
                }}
            >
                {/* Render zone polygons */}
                {zones.map(zone => (
                    <Polygon
                        key={zone.id}
                        paths={zone.formated_coordinates}
                        options={{
                            fillColor: selectedZoneId === zone.id ? "#3b82f6" : "#10b981",
                            fillOpacity: 0.35,
                            strokeColor: selectedZoneId === zone.id ? "#2563eb" : "#059669",
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                            clickable: false // Disable polygon click to allow map click through
                        }}
                    />
                ))}

                {/* Location marker */}
                {markerLocation && (
                    <Marker
                        position={markerLocation}
                        icon={{
                            path: window.google.maps.SymbolPath.CIRCLE,
                            scale: 10,
                            fillColor: "#ef4444",
                            fillOpacity: 1,
                            strokeColor: "#ffffff",
                            strokeWeight: 2,
                        }}
                    />
                )}
            </GoogleMap>

            {/* Instructions */}
            <div className="absolute top-4 right-4 bg-slate-800/90 backdrop-blur-sm text-white px-3 py-2 rounded-lg shadow-lg max-w-[200px]">
                <div className="flex items-start gap-2">
                    <MousePointer className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="text-xs">
                        Click on a highlighted zone to select it
                    </span>
                </div>
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                <Button
                    onClick={getUserLocation}
                    variant="default"
                    className="shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={loadingLocation}
                >
                    {loadingLocation ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Detecting...
                        </>
                    ) : (
                        <>
                            <Navigation className="w-4 h-4 mr-2" />
                            Use GPS
                        </>
                    )}
                </Button>
                <Button onClick={onClose} variant="secondary" className="shadow-lg">
                    Close
                </Button>
            </div>

            {/* Selected zone indicator */}
            {selectedZoneId && (
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-2 rounded-lg shadow-lg animate-pulse">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-medium">
                            {zones.find(z => z.id === selectedZoneId)?.name} ✓
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
