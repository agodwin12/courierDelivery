'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { QRCodeSVG } from 'qrcode.react';
import { generateDeliveryPDF } from '@/utils/pdfGenerator';

interface DeliveryInfo {
    tracking_number: string;
    sender_name: string;
    receiver_name: string;
    receiver_address: string;
    delivery_method: string;
    delivery_status: string;
    start_time: string;
    end_time: string;
    estimated_arrival: string;
    actual_delivery_time: string;
    current_latitude: number;
    current_longitude: number;
    current_location_address: string;
}

interface TrackingUpdate {
    id: number;
    latitude: number;
    longitude: number;
    location_address: string;
    status: string;
    notes: string;
    recorded_at: string;
}

declare global {
    interface Window {
        google: any;
        initMap: () => void;
    }
}

export default function TrackPage() {
    const [trackingNumber, setTrackingNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [delivery, setDelivery] = useState<DeliveryInfo | null>(null);
    const [trackingUpdates, setTrackingUpdates] = useState<TrackingUpdate[]>([]);
    const [mapsLoaded, setMapsLoaded] = useState(false);
    const [mapReady, setMapReady] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [eta, setEta] = useState<string>('');
    const [totalDistance, setTotalDistance] = useState<number>(0);
    const [downloadingPDF, setDownloadingPDF] = useState(false);

    // Handle search
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!trackingNumber.trim()) {
            setError('Please enter a tracking number');
            return;
        }

        setLoading(true);
        setError('');
        setDelivery(null);
        setTrackingUpdates([]);
        setMapReady(false);
        setEta('');
        setTotalDistance(0);

        try {
            const response = await fetch(`http://localhost:3001/api/deliveries/track/${trackingNumber}`);
            const data = await response.json();

            if (response.ok) {
                console.log('✅ Delivery data received:', data.delivery);
                setDelivery(data.delivery);
                setTrackingUpdates(data.tracking_updates || []);
            } else {
                setError(data.message || 'Tracking number not found');
            }
        } catch (err: any) {
            setError('An error occurred while tracking your delivery');
            console.error('❌ Tracking error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Initialize map when both delivery and Google Maps are ready
    useEffect(() => {
        if (delivery && delivery.current_latitude && delivery.current_longitude && mapsLoaded && !mapReady) {
            console.log('🗺️ Both delivery and maps ready, initializing map...');
            console.log('📍 Coordinates:', delivery.current_latitude, delivery.current_longitude);
            setTimeout(() => initMap(), 500);
        }
    }, [delivery, mapsLoaded, mapReady]);

    // Initialize map
    const initMap = () => {
        console.log('🚀 initMap() called');

        if (!delivery) {
            console.log('❌ No delivery data');
            return;
        }

        if (!window.google || !window.google.maps) {
            console.log('❌ Google Maps not loaded yet');
            return;
        }

        const mapElement = document.getElementById('map');
        if (!mapElement) {
            console.log('❌ Map element not found in DOM');
            return;
        }

        console.log('✅ All checks passed, creating map...');

        try {
            const currentPosition = {
                lat: parseFloat(delivery.current_latitude.toString()),
                lng: parseFloat(delivery.current_longitude.toString())
            };

            console.log('📍 Creating map at position:', currentPosition);

            // Create map
            const map = new window.google.maps.Map(mapElement, {
                zoom: 10,
                center: currentPosition,
                mapTypeControl: true,
                streetViewControl: false,
                fullscreenControl: true,
                zoomControl: true,
            });

            console.log('✅ Map object created');

            // Get icon based on delivery method
            let iconUrl = '';
            if (delivery.delivery_method === 'flight') {
                iconUrl = 'http://maps.google.com/mapfiles/kml/shapes/airports.png';
            } else if (delivery.delivery_method === 'road') {
                iconUrl = 'http://maps.google.com/mapfiles/kml/shapes/truck.png';
            } else if (delivery.delivery_method === 'sea') {
                iconUrl = 'http://maps.google.com/mapfiles/kml/shapes/sailing.png';
            }

            // Add current location marker
            const currentMarker = new window.google.maps.Marker({
                position: currentPosition,
                map: map,
                title: 'Current Location',
                icon: iconUrl ? {
                    url: iconUrl,
                    scaledSize: new window.google.maps.Size(40, 40)
                } : undefined,
                animation: window.google.maps.Animation.BOUNCE
            });

            console.log('✅ Current marker added');

            // Info window for current location
            const currentInfoWindow = new window.google.maps.InfoWindow({
                content: `
          <div style="padding: 12px; max-width: 250px;">
            <h3 style="margin: 0 0 8px 0; color: #8BC34A; font-weight: bold; font-size: 16px;">📍 Current Location</h3>
            <p style="margin: 5px 0; color: #666; font-size: 14px;">${delivery.current_location_address || 'In Transit'}</p>
            <p style="margin: 5px 0 0 0; font-weight: bold; color: #333; font-size: 13px;">Status: ${delivery.delivery_status.toUpperCase()}</p>
          </div>
        `
            });

            currentMarker.addListener('click', () => {
                currentInfoWindow.open(map, currentMarker);
            });

            // Bounds to fit all markers
            const bounds = new window.google.maps.LatLngBounds();
            bounds.extend(currentPosition);

            // Add tracking history markers
            const pathCoordinates: any[] = [];

            trackingUpdates.forEach((update, index) => {
                const updatePosition = {
                    lat: parseFloat(update.latitude.toString()),
                    lng: parseFloat(update.longitude.toString())
                };

                pathCoordinates.push(updatePosition);
                bounds.extend(updatePosition);

                const marker = new window.google.maps.Marker({
                    position: updatePosition,
                    map: map,
                    title: update.location_address,
                    label: {
                        text: (trackingUpdates.length - index).toString(),
                        color: 'white',
                        fontWeight: 'bold'
                    },
                    icon: {
                        path: window.google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillColor: '#8BC34A',
                        fillOpacity: 0.9,
                        strokeColor: 'white',
                        strokeWeight: 2
                    }
                });

                const updateInfoWindow = new window.google.maps.InfoWindow({
                    content: `
            <div style="padding: 12px; max-width: 250px;">
              <p style="margin: 0 0 5px 0; font-weight: bold; color: #8BC34A; font-size: 14px;">#${trackingUpdates.length - index}: ${update.status.replace(/_/g, ' ').toUpperCase()}</p>
              <p style="margin: 5px 0; color: #666; font-size: 13px;">${update.location_address}</p>
              <p style="margin: 5px 0 0 0; color: #999; font-size: 12px;">${new Date(update.recorded_at).toLocaleString()}</p>
              ${update.notes ? `<p style="margin: 5px 0 0 0; font-size: 12px; font-style: italic; color: #666;">${update.notes}</p>` : ''}
            </div>
          `
                });

                marker.addListener('click', () => {
                    updateInfoWindow.open(map, marker);
                });
            });

            console.log('✅ Tracking history markers added');

            // Add current position to path
            pathCoordinates.push(currentPosition);

            // Draw route if we have multiple points
            if (pathCoordinates.length > 1) {
                const routePath = new window.google.maps.Polyline({
                    path: pathCoordinates,
                    geodesic: true,
                    strokeColor: '#8BC34A',
                    strokeOpacity: 0.8,
                    strokeWeight: 4,
                    icons: [{
                        icon: {
                            path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                            scale: 3,
                            strokeColor: '#7CB342',
                            fillColor: '#7CB342',
                            fillOpacity: 1
                        },
                        offset: '100%',
                        repeat: '100px'
                    }]
                });

                routePath.setMap(map);
                console.log('✅ Route path drawn');

                // Animate the route
                let count = 0;
                setInterval(() => {
                    count = (count + 1) % 200;
                    const icons = routePath.get('icons');
                    if (icons && icons[0]) {
                        icons[0].offset = (count / 2) + '%';
                        routePath.set('icons', icons);
                    }
                }, 20);
            }

            // Add destination marker
            if (delivery.receiver_address) {
                const geocoder = new window.google.maps.Geocoder();
                geocoder.geocode({ address: delivery.receiver_address }, (results: any, status: any) => {
                    if (status === 'OK' && results && results[0]) {
                        const destPosition = results[0].geometry.location;
                        bounds.extend(destPosition);

                        const destMarker = new window.google.maps.Marker({
                            position: destPosition,
                            map: map,
                            title: 'Destination',
                            label: {
                                text: '🏁',
                                fontSize: '24px',
                                fontWeight: 'bold'
                            },
                            icon: {
                                path: window.google.maps.SymbolPath.CIRCLE,
                                scale: 15,
                                fillColor: '#ff0000',
                                fillOpacity: 0.8,
                                strokeColor: 'white',
                                strokeWeight: 3
                            }
                        });

                        const destInfoWindow = new window.google.maps.InfoWindow({
                            content: `
                <div style="padding: 12px; max-width: 250px;">
                  <h3 style="margin: 0 0 8px 0; color: #ff0000; font-weight: bold; font-size: 16px;">🏁 Destination</h3>
                  <p style="margin: 5px 0; color: #666; font-size: 14px;">${delivery.receiver_address}</p>
                  <p style="margin: 5px 0 0 0; font-weight: bold; color: #333; font-size: 13px;">Receiver: ${delivery.receiver_name}</p>
                </div>
              `
                        });

                        destMarker.addListener('click', () => {
                            destInfoWindow.open(map, destMarker);
                        });

                        console.log('✅ Destination marker added');

                        // Calculate ETA
                        const destLat = destPosition.lat();
                        const destLng = destPosition.lng();
                        const distance = calculateDistance(currentPosition.lat, currentPosition.lng, destLat, destLng);

                        let avgSpeed = 60;
                        if (delivery?.delivery_method === 'flight') {
                            avgSpeed = 500;
                        } else if (delivery?.delivery_method === 'sea') {
                            avgSpeed = 40;
                        }

                        const hours = distance / avgSpeed;
                        const days = Math.floor(hours / 24);
                        const remainingHours = Math.floor(hours % 24);
                        const minutes = Math.floor((hours % 1) * 60);

                        let etaText = '';
                        if (days > 0) etaText += `${days}d `;
                        if (remainingHours > 0) etaText += `${remainingHours}h `;
                        if (minutes > 0) etaText += `${minutes}m`;

                        setEta(etaText.trim());
                        setTotalDistance(Math.round(distance));

                        console.log('✅ ETA calculated:', etaText);

                        // Fit bounds
                        map.fitBounds(bounds);
                    }
                });
            } else {
                // Fit bounds without destination
                map.fitBounds(bounds);
            }

            setMapReady(true);
            console.log('✅✅✅ MAP INITIALIZED SUCCESSFULLY! ✅✅✅');

        } catch (error) {
            console.error('❌ Error creating map:', error);
        }
    };

    // Calculate distance
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    // Download PDF
    const handleDownloadPDF = async () => {
        if (!delivery) return;

        setDownloadingPDF(true);

        try {
            const qrCodeElement = document.getElementById('qr-code-svg');
            let qrCodeDataUrl = '';

            if (qrCodeElement) {
                const svgData = new XMLSerializer().serializeToString(qrCodeElement);
                const canvas = document.createElement('canvas');
                canvas.width = 200;
                canvas.height = 200;
                const ctx = canvas.getContext('2d');
                const img = new Image();

                await new Promise((resolve) => {
                    img.onload = () => {
                        ctx?.drawImage(img, 0, 0);
                        qrCodeDataUrl = canvas.toDataURL('image/png');
                        resolve(true);
                    };
                    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
                });
            }

            await generateDeliveryPDF(delivery, trackingUpdates, qrCodeDataUrl);

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setDownloadingPDF(false);
        }
    };

    // Download QR Code
    const downloadQR = () => {
        const svg = document.getElementById('qr-code-display');
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL('image/png');

            const downloadLink = document.createElement('a');
            downloadLink.download = `MovingCargo-QR-${trackingNumber}.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    };

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'in_transit': return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'arrived': return 'bg-purple-100 text-purple-800 border-purple-300';
            case 'delivered': return 'bg-green-100 text-green-800 border-green-300';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    // Get method icon
    const getMethodIcon = (method: string) => {
        switch (method) {
            case 'road': return '🚚';
            case 'flight': return '✈️';
            case 'sea': return '🚢';
            default: return '📦';
        }
    };

    return (
        <>
            {/* Google Maps Script */}
            <Script
                src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBn88TP5X-xaRCYo5gYxvGnVy_0WYotZWo"
                strategy="afterInteractive"
                onLoad={() => {
                    console.log('✅ Google Maps script loaded via Next.js Script component');
                    setMapsLoaded(true);
                }}
                onError={(e) => {
                    console.error('❌ Error loading Google Maps:', e);
                }}
            />

            <div className="min-h-screen bg-gray-50">
                {/* Hidden QR Code for PDF */}
                {delivery && (
                    <div style={{ position: 'absolute', left: '-9999px' }}>
                        <QRCodeSVG
                            id="qr-code-svg"
                            value={`${typeof window !== 'undefined' ? window.location.origin : ''}/track?tracking=${delivery.tracking_number}`}
                            size={200}
                            level="H"
                            includeMargin={true}
                        />
                    </div>
                )}

                {/* Navigation */}
                <nav className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <Link href="/" className="flex items-center gap-3">
                                <div className="w-14 h-14 bg-[#8BC34A] rounded-full flex items-center justify-center relative">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    <div className="absolute -bottom-1 w-full h-2 bg-[#7CB342] rounded-full"></div>
                                </div>
                                <span className="text-3xl font-bold text-[#2d2d2d]">MovingCargo</span>
                            </Link>

                            <div className="flex items-center gap-4">
                                <Link href="/" className="text-gray-600 hover:text-[#8BC34A] font-semibold transition-colors">
                                    Home
                                </Link>
                                <Link href="/admin/login" className="px-6 py-3 bg-[#8BC34A] hover:bg-[#7CB342] text-white font-semibold rounded-lg transition-colors">
                                     Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="bg-gradient-to-br from-[#8BC34A] to-[#7CB342] text-white py-20">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h1 className="text-5xl font-bold mb-4">Track Your Delivery</h1>
                        <p className="text-xl text-white/90 mb-8">Enter your tracking number to see real-time updates</p>

                        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                            <div className="bg-white rounded-2xl shadow-2xl p-4 flex gap-3">
                                <input
                                    type="text"
                                    value={trackingNumber}
                                    onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
                                    placeholder="Enter Tracking Number (e.g., ST-2024-123456)"
                                    className="flex-1 px-6 py-4 text-lg text-gray-800 outline-none rounded-lg"
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-4 bg-[#8BC34A] hover:bg-[#7CB342] text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Tracking...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                            <span>Track</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Results Section */}
                <div className="max-w-7xl mx-auto px-6 py-12">
                    {/* Error Message */}
                    {error && (
                        <div className="max-w-2xl mx-auto mb-8 p-6 bg-red-50 border-2 border-red-200 rounded-lg">
                            <div className="flex items-center gap-3">
                                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <h3 className="text-lg font-bold text-red-800">Tracking Number Not Found</h3>
                                    <p className="text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Delivery Information */}
                    {delivery && (
                        <div className="space-y-6">
                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-4 justify-end">
                                <button
                                    onClick={() => setShowQR(true)}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                    </svg>
                                    Show QR Code
                                </button>

                                <button
                                    onClick={handleDownloadPDF}
                                    disabled={downloadingPDF}
                                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {downloadingPDF ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Generating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                            Download PDF
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Status Banner */}
                            <div className={`rounded-2xl border-2 p-8 ${getStatusColor(delivery.delivery_status)}`}>
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div className="flex-1 min-w-[200px]">
                                        <p className="text-sm font-semibold mb-2">Tracking Number</p>
                                        <p className="text-3xl font-bold font-mono mb-4">{delivery.tracking_number}</p>

                                        {eta && (
                                            <div className="flex items-center gap-6 mt-4 flex-wrap">
                                                <div>
                                                    <p className="text-sm font-semibold mb-1">Estimated Time</p>
                                                    <p className="text-2xl font-bold">{eta}</p>
                                                </div>
                                                {totalDistance > 0 && (
                                                    <div>
                                                        <p className="text-sm font-semibold mb-1">Distance Remaining</p>
                                                        <p className="text-2xl font-bold">{totalDistance} km</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm font-semibold mb-2">Delivery Status</p>
                                        <div className="flex items-center gap-3">
                                            <span className="text-4xl">{getMethodIcon(delivery.delivery_method)}</span>
                                            <span className="text-3xl font-bold uppercase">{delivery.delivery_status.replace(/_/g, ' ')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* QR Code Modal */}
                            {showQR && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowQR(false)}>
                                    <div className="bg-white rounded-2xl max-w-md w-full p-8 relative" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            onClick={() => setShowQR(false)}
                                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>

                                        <h2 className="text-2xl font-bold text-center mb-6">QR Code</h2>

                                        <div className="flex justify-center mb-6">
                                            <div className="p-4 bg-white border-4 border-[#8BC34A] rounded-lg">
                                                <QRCodeSVG
                                                    id="qr-code-display"
                                                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/track?tracking=${delivery.tracking_number}`}
                                                    size={256}
                                                    level="H"
                                                    includeMargin={true}
                                                />
                                            </div>
                                        </div>

                                        <p className="text-center text-gray-600 mb-4">
                                            Scan this QR code to track your delivery
                                        </p>

                                        <button
                                            onClick={downloadQR}
                                            className="w-full px-6 py-3 bg-[#8BC34A] hover:bg-[#7CB342] text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            Download QR Code
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Google Map */}
                            {delivery.current_latitude && delivery.current_longitude && (
                                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                    <div className="p-6 bg-gradient-to-r from-[#8BC34A] to-[#7CB342] text-white">
                                        <h2 className="text-2xl font-bold flex items-center gap-2">
                                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                            </svg>
                                            Route Map & Current Location
                                        </h2>
                                        <p className="text-white/90 mt-1">{delivery.current_location_address || 'Tracking in progress...'}</p>

                                        <div className="mt-4 flex flex-wrap gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 bg-white rounded-full border-2 border-white"></div>
                                                <span>Tracking Points</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-1 bg-white"></div>
                                                <span>Route Path</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl">🏁</span>
                                                <span>Destination</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <div
                                            id="map"
                                            className="w-full h-[600px]"
                                            style={{ background: '#e5e7eb' }}
                                        ></div>

                                        {/* Loading Overlay */}
                                        {!mapReady && (
                                            <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center z-10">
                                                <div className="text-center">
                                                    <svg className="animate-spin h-12 w-12 text-[#8BC34A] mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    <p className="text-lg font-semibold text-gray-700">Loading map...</p>
                                                    <p className="text-sm text-gray-500 mt-2">
                                                        {!mapsLoaded ? 'Loading Google Maps API...' : 'Initializing map...'}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-4">
                                                        Open console (F12) to see detailed loading progress
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Delivery Details - Compact */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white rounded-xl shadow p-4">
                                    <p className="text-sm text-gray-600 mb-1">From</p>
                                    <p className="font-bold text-gray-900">{delivery.sender_name}</p>
                                </div>
                                <div className="bg-white rounded-xl shadow p-4">
                                    <p className="text-sm text-gray-600 mb-1">To</p>
                                    <p className="font-bold text-gray-900">{delivery.receiver_name}</p>
                                    <p className="text-sm text-gray-600 mt-1">{delivery.receiver_address}</p>
                                </div>
                                <div className="bg-white rounded-xl shadow p-4">
                                    <p className="text-sm text-gray-600 mb-1">Method</p>
                                    <p className="font-bold text-gray-900 flex items-center gap-2">
                                        <span className="text-2xl">{getMethodIcon(delivery.delivery_method)}</span>
                                        <span className="capitalize">{delivery.delivery_method}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Tracking History */}
                            {trackingUpdates.length > 0 && (
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <h3 className="text-2xl font-bold text-[#2d2d2d] mb-6 flex items-center gap-2">
                                        <svg className="w-7 h-7 text-[#8BC34A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        Tracking History ({trackingUpdates.length} Updates)
                                    </h3>
                                    <div className="space-y-4">
                                        {trackingUpdates.map((update, index) => (
                                            <div key={update.id} className="flex gap-4 relative">
                                                {index !== trackingUpdates.length - 1 && (
                                                    <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-gray-200"></div>
                                                )}
                                                <div className="w-10 h-10 bg-[#8BC34A] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 z-10 shadow-lg">
                                                    {trackingUpdates.length - index}
                                                </div>
                                                <div className="flex-1 pb-8">
                                                    <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                        <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                                                            <p className="font-bold text-gray-900 capitalize">{update.status.replace(/_/g, ' ')}</p>
                                                            <p className="text-sm text-gray-500">{new Date(update.recorded_at).toLocaleString()}</p>
                                                        </div>
                                                        <p className="text-gray-700 mb-1 flex items-center gap-2">
                                                            <svg className="w-4 h-4 text-[#8BC34A] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            {update.location_address}
                                                        </p>
                                                        {update.notes && (
                                                            <p className="text-sm text-gray-600 italic mt-2 pl-6 bg-white rounded p-2">💬 {update.notes}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <footer className="bg-[#2d2d2d] text-white py-12 mt-20">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col md:flex-row items-center justify-between">
                            <div className="flex items-center gap-3 mb-4 md:mb-0">
                                <div className="w-12 h-12 bg-[#8BC34A] rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <span className="text-2xl font-bold">MovingCargo</span>
                            </div>
                            <p className="text-gray-400">© 2024 MovingCargo. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}