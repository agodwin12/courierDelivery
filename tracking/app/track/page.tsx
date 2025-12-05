'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';

declare global {
    interface Window {
        google: any;
    }
}

interface TrackingUpdate {
    id: number;
    status: string;
    location_address: string;
    notes: string;
    latitude: string;
    longitude: string;
    recorded_at: string;
}

interface DeliveryData {
    id: number;
    tracking_number: string;
    sender_name: string;
    sender_phone: string;
    sender_email: string;
    sender_address: string;
    sender_latitude: string;
    sender_longitude: string;
    receiver_name: string;
    receiver_phone: string;
    receiver_email: string;
    receiver_address: string;
    receiver_latitude: string;
    receiver_longitude: string;
    package_description: string;
    package_weight: string;
    package_length: string;
    package_width: string;
    package_height: string;
    delivery_method: string;
    delivery_status: string;
    start_time: string;
    end_time: string;
    estimated_arrival: string;
    actual_delivery_time: string | null;
    delivery_cost: string;
    special_instructions: string;
    current_latitude: string;
    current_longitude: string;
    current_location_address: string;
    created_at: string;
}

function TrackingContent() {
    const searchParams = useSearchParams();
    const trackingNumber = searchParams.get('tracking');

    const [delivery, setDelivery] = useState<DeliveryData | null>(null);
    const [trackingHistory, setTrackingHistory] = useState<TrackingUpdate[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [mapsLoaded, setMapsLoaded] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    // Fetch tracking data
    const handleTrackDelivery = async (trackNum: string) => {
        setLoading(true);
        setError('');
        setDelivery(null);
        setTrackingHistory([]);

        try {
            const response = await fetch(`${API_URL}/deliveries/track/${trackNum}`);
            const data = await response.json();

            if (response.ok) {
                setDelivery(data.delivery);
                setTrackingHistory(data.tracking_updates || []);
            } else {
                setError(data.message || 'Tracking number not found');
            }
        } catch (err: any) {
            setError('Unable to connect to server. Please try again later.');
            console.error('Track delivery error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Auto-track if tracking number in URL
    useEffect(() => {
        if (trackingNumber) {
            handleTrackDelivery(trackingNumber);
        }
    }, [trackingNumber]);

    const animatedWords = [
        { text: 'SWIFT', angle: 'top-left', delay: 0 },
        { text: 'RELIABLE', angle: 'top-right', delay: 0.2 },
        { text: 'TRUSTED', angle: 'bottom-left', delay: 0.4 },
        { text: 'TRACKING', angle: 'bottom-right', delay: 0.6 },
    ];

    return (
        <>
            <Script
                src={`https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&loading=async`}
                strategy="afterInteractive"
                onLoad={() => {
                    console.log('✅ Google Maps loaded');
                    setMapsLoaded(true);
                }}
                onError={() => {
                    console.error('❌ Google Maps error');
                    setError('Failed to load Google Maps');
                }}
            />

            <div className="min-h-screen bg-white">
                {/* Top Bar */}
                <div className="bg-[#2d2d2d] text-white py-3 px-6">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
                        <p className="mb-2 md:mb-0">The Reliable Delivery Company. Your friend with a truck.</p>
                        <div className="flex gap-6">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span className="hidden sm:inline">Make a call: +1(123)456-7890</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <Link href="/" className="flex items-center gap-3">
                                <div className="w-14 h-14 bg-[#8BC34A] rounded-full flex items-center justify-center relative">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    <div className="absolute -bottom-1 w-full h-2 bg-[#7CB342] rounded-full"></div>
                                </div>
                                <span className="text-3xl font-bold text-[#2d2d2d]">MovinCargo</span>
                            </Link>

                            {/* Desktop Menu */}
                            <div className="hidden lg:flex items-center gap-8">
                                <Link href="/" className="text-gray-700 font-medium hover:text-[#8BC34A] transition-colors">
                                    Home
                                </Link>
                                <Link href="/track" className="text-[#8BC34A] font-medium hover:text-[#7CB342] transition-colors">
                                    Track
                                </Link>
                                <Link href="/services" className="text-gray-700 font-medium hover:text-[#8BC34A] transition-colors">
                                    Services
                                </Link>
                                <Link href="/admin/login" className="px-6 py-3 bg-[#8BC34A] text-white font-semibold rounded hover:bg-[#7CB342] transition-colors">
                                    Login
                                </Link>
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                className="lg:hidden text-gray-700"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>

                        {/* Mobile Menu */}
                        {mobileMenuOpen && (
                            <div className="lg:hidden mt-4 pb-4 border-t pt-4">
                                <div className="flex flex-col gap-4">
                                    <Link href="/" className="text-gray-700 font-medium hover:text-[#8BC34A]">Home</Link>
                                    <Link href="/track" className="text-[#8BC34A] font-medium">Track</Link>
                                    <Link href="/services" className="text-gray-700 font-medium hover:text-[#8BC34A]">Services</Link>
                                    <Link href="/admin/login" className="px-6 py-3 bg-[#8BC34A] text-white font-semibold rounded text-center">
                                        Login
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </nav>

                {!delivery && (
                    <>
                        {/* Hero Section */}
                        <section className="relative h-[400px] overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#8BC34A] to-[#7CB342]">
                                <div className="absolute inset-0 bg-black/20"></div>
                            </div>

                            {/* Animated Background Words */}
                            <div className="absolute inset-0 overflow-hidden">
                                {animatedWords.map((word, idx) => (
                                    <div
                                        key={idx}
                                        className={`absolute text-6xl md:text-8xl font-bold text-white/10 animate-word-${word.angle}`}
                                        style={{
                                            animationDelay: `${word.delay}s`,
                                            ...(word.angle === 'top-left' && { top: '-10%', left: '-10%' }),
                                            ...(word.angle === 'top-right' && { top: '-10%', right: '-10%' }),
                                            ...(word.angle === 'bottom-left' && { bottom: '-10%', left: '-10%' }),
                                            ...(word.angle === 'bottom-right' && { bottom: '-10%', right: '-10%' }),
                                        }}
                                    >
                                        {word.text}
                                    </div>
                                ))}
                            </div>

                            {/* Hero Content */}
                            <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center justify-center text-center">
                                <div className="text-white">
                                    <h1 className="text-5xl md:text-6xl font-bold mb-4">Track Your Delivery</h1>
                                    <p className="text-xl">Real-time package tracking at your fingertips</p>
                                </div>
                            </div>
                        </section>

                        {/* Search Section */}
                        <div className="max-w-4xl mx-auto px-6 -mt-16 relative z-20">
                            <div className="bg-white rounded-2xl shadow-2xl p-8">
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const trackNum = formData.get('tracking') as string;
                                    if (trackNum) handleTrackDelivery(trackNum);
                                }} className="flex flex-col sm:flex-row gap-4">
                                    <input
                                        type="text"
                                        name="tracking"
                                        placeholder="Enter tracking number (e.g., MC-2024-ABC123)"
                                        className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent text-lg"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-8 py-4 bg-gradient-to-r from-[#8BC34A] to-[#7CB342] text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 whitespace-nowrap"
                                    >
                                        {loading ? 'Tracking...' : 'Track Package'}
                                    </button>
                                </form>

                                {error && (
                                    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                                        <p className="text-red-700 text-center">{error}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="h-20"></div>
                    </>
                )}

                {/* Tracking Results */}
                {delivery && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="mb-6">
                            <button
                                onClick={() => {
                                    setDelivery(null);
                                    setTrackingHistory([]);
                                    setError('');
                                }}
                                className="flex items-center gap-2 text-[#8BC34A] hover:text-[#7CB342] font-medium"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Track Another Package
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Main Info Card */}
                            <div className="bg-white rounded-2xl shadow-xl p-6">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                                    <div>
                                        <h3 className="text-sm text-gray-600">Tracking Number</h3>
                                        <p className="text-2xl font-bold text-[#8BC34A] font-mono">{delivery.tracking_number}</p>
                                    </div>
                                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                        delivery.delivery_status === 'delivered' ? 'bg-green-100 text-green-800' :
                                            delivery.delivery_status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                                                delivery.delivery_status === 'out_for_delivery' ? 'bg-orange-100 text-orange-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {delivery.delivery_status.replace('_', ' ').toUpperCase()}
                                    </span>
                                </div>

                                {/* Sender & Receiver Grid */}
                                <div className="grid md:grid-cols-2 gap-6 mb-6 pb-6 border-b">
                                    <div className="space-y-3">
                                        <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-[#8BC34A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                            </svg>
                                            Sender Information
                                        </h4>
                                        <div>
                                            <p className="text-sm text-gray-600">Name</p>
                                            <p className="font-semibold text-gray-900">{delivery.sender_name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Contact</p>
                                            <p className="text-gray-900">{delivery.sender_phone}</p>
                                            <p className="text-gray-900">{delivery.sender_email}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Address</p>
                                            <p className="text-gray-900">{delivery.sender_address}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-[#8BC34A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            </svg>
                                            Receiver Information
                                        </h4>
                                        <div>
                                            <p className="text-sm text-gray-600">Name</p>
                                            <p className="font-semibold text-gray-900">{delivery.receiver_name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Contact</p>
                                            <p className="text-gray-900">{delivery.receiver_phone}</p>
                                            <p className="text-gray-900">{delivery.receiver_email}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Address</p>
                                            <p className="text-gray-900">{delivery.receiver_address}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Package Details */}
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Package Description</p>
                                        <p className="font-semibold text-gray-900">{delivery.package_description}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Weight</p>
                                        <p className="font-semibold text-gray-900">{delivery.package_weight} kg</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Dimensions (L×W×H)</p>
                                        <p className="font-semibold text-gray-900">
                                            {delivery.package_length} × {delivery.package_width} × {delivery.package_height} cm
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Delivery Method</p>
                                        <p className="font-semibold text-gray-900 capitalize">{delivery.delivery_method}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Delivery Cost</p>
                                        <p className="font-semibold text-gray-900">${delivery.delivery_cost}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Estimated Arrival</p>
                                        <p className="font-semibold text-gray-900">
                                            {new Date(delivery.estimated_arrival).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Special Instructions */}
                                {delivery.special_instructions && (
                                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                                        <p className="text-sm font-semibold text-yellow-800 mb-1">Special Instructions</p>
                                        <p className="text-sm text-yellow-700">{delivery.special_instructions}</p>
                                    </div>
                                )}

                                {/* Current Location */}
                                {delivery.current_location_address && (
                                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                        <p className="text-sm font-semibold text-blue-800 mb-1">Current Location</p>
                                        <p className="text-sm text-blue-700">{delivery.current_location_address}</p>
                                    </div>
                                )}
                            </div>

                            {/* Map Component */}
                            {mapsLoaded && delivery && (
                                <MapComponent
                                    delivery={delivery}
                                    trackingHistory={trackingHistory}
                                />
                            )}

                            {/* Tracking History */}
                            {trackingHistory.length > 0 && (
                                <div className="bg-white rounded-2xl shadow-xl p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">Tracking History</h3>
                                    <div className="space-y-6">
                                        {trackingHistory.map((update, index) => (
                                            <div key={update.id} className="flex gap-4">
                                                <div className="flex flex-col items-center">
                                                    <div
                                                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                                                        style={{ backgroundColor: getStatusColor(update.status) }}
                                                    >
                                                        {index + 1}
                                                    </div>
                                                    {index < trackingHistory.length - 1 && (
                                                        <div className="w-0.5 flex-1 bg-gray-300 mt-2"></div>
                                                    )}
                                                </div>
                                                <div className="flex-1 pb-6">
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                                        <span className="font-semibold text-gray-900 capitalize">
                                                            {update.status.replace('_', ' ')}
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            {new Date(update.recorded_at).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-1">{update.location_address}</p>
                                                    {update.notes && (
                                                        <p className="text-sm text-gray-500 italic">{update.notes}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <footer className="bg-[#2d2d2d] text-white py-16 mt-20">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid md:grid-cols-4 gap-12">
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-[#8BC34A] rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <span className="text-2xl font-bold">MovinCargo</span>
                                </div>
                                <p className="text-gray-300">The Reliable Delivery Company</p>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold mb-6">Quick Links</h3>
                                <ul className="space-y-3">
                                    <li><Link href="/" className="text-gray-300 hover:text-[#8BC34A] transition-colors">Home</Link></li>
                                    <li><Link href="/track" className="text-gray-300 hover:text-[#8BC34A] transition-colors">Track</Link></li>
                                    <li><Link href="/services" className="text-gray-300 hover:text-[#8BC34A] transition-colors">Services</Link></li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold mb-6">Contact</h3>
                                <ul className="space-y-3 text-gray-300">
                                    <li>+1(123)456-7890</li>
                                    <li>contact@movincargo.com</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold mb-6">Follow Us</h3>
                                <div className="flex gap-3">
                                    <a href="#" className="w-10 h-10 bg-[#1a1a1a] rounded flex items-center justify-center hover:bg-[#8BC34A] transition-colors">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
                            <p className="text-gray-400 text-sm">© 2024 MovinCargo. All Rights Reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

// Map Component – dedicated inner div for Google Maps, overlay as sibling
interface MapComponentProps {
    delivery: DeliveryData;
    trackingHistory: TrackingUpdate[];
}

function MapComponent({ delivery, trackingHistory }: MapComponentProps) {
    const mapRef = useRef<any>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const markersRef = useRef<any[]>([]);
    const polylineRef = useRef<any | null>(null);
    const [mapReady, setMapReady] = useState(false);

    // Create map once per mount
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!window.google) return;
        if (!mapContainerRef.current) return;

        const currentLat = parseFloat(delivery.current_latitude || delivery.sender_latitude || '0');
        const currentLng = parseFloat(delivery.current_longitude || delivery.sender_longitude || '0');
        if (isNaN(currentLat) || isNaN(currentLng)) return;

        try {
            const map = new window.google.maps.Map(mapContainerRef.current, {
                center: { lat: currentLat, lng: currentLng },
                zoom: 6,
                styles: [{ featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }]
            });

            mapRef.current = map;
            setMapReady(true);
        } catch (err) {
            console.error('Map init error:', err);
        }

        return () => {
            try {
                markersRef.current.forEach(marker => {
                    if (marker && typeof marker.setMap === 'function') {
                        marker.setMap(null);
                    }
                });
                markersRef.current = [];

                if (polylineRef.current && typeof polylineRef.current.setMap === 'function') {
                    polylineRef.current.setMap(null);
                }
                polylineRef.current = null;

                mapRef.current = null;
            } catch (e) {
                console.warn('Map cleanup warning:', e);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // only once

    // Update markers & path when data changes
    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        // Clear previous overlays
        markersRef.current.forEach(marker => {
            if (marker && typeof marker.setMap === 'function') {
                marker.setMap(null);
            }
        });
        markersRef.current = [];

        if (polylineRef.current && typeof polylineRef.current.setMap === 'function') {
            polylineRef.current.setMap(null);
        }
        polylineRef.current = null;

        const pathCoordinates: any[] = [];
        const markers: any[] = [];

        // Sender
        const senderLat = parseFloat(delivery.sender_latitude);
        const senderLng = parseFloat(delivery.sender_longitude);
        if (!isNaN(senderLat) && !isNaN(senderLng)) {
            pathCoordinates.push({ lat: senderLat, lng: senderLng });
            const senderMarker = new window.google.maps.Marker({
                position: { lat: senderLat, lng: senderLng },
                map,
                title: 'Sender',
                icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: '#4CAF50',
                    fillOpacity: 1,
                    strokeColor: '#fff',
                    strokeWeight: 3
                },
                label: { text: 'A', color: '#fff', fontSize: '14px', fontWeight: 'bold' }
            });
            markers.push(senderMarker);
        }

        // History
        trackingHistory.forEach((update, index) => {
            const lat = parseFloat(update.latitude);
            const lng = parseFloat(update.longitude);
            if (!isNaN(lat) && !isNaN(lng)) {
                pathCoordinates.push({ lat, lng });
                const historyMarker = new window.google.maps.Marker({
                    position: { lat, lng },
                    map,
                    title: update.status,
                    icon: {
                        path: window.google.maps.SymbolPath.CIRCLE,
                        scale: 6,
                        fillColor: getStatusColor(update.status),
                        fillOpacity: 1,
                        strokeColor: '#fff',
                        strokeWeight: 2
                    },
                    label: { text: (index + 1).toString(), color: '#fff', fontSize: '10px', fontWeight: 'bold' }
                });
                markers.push(historyMarker);
            }
        });

        // Current
        const currentLat = parseFloat(delivery.current_latitude || delivery.sender_latitude || '0');
        const currentLng = parseFloat(delivery.current_longitude || delivery.sender_longitude || '0');
        if (!isNaN(currentLat) && !isNaN(currentLng)) {
            pathCoordinates.push({ lat: currentLat, lng: currentLng });
            const currentMarker = new window.google.maps.Marker({
                position: { lat: currentLat, lng: currentLng },
                map,
                title: 'Current Location',
                icon: getMarkerIcon(delivery.delivery_method),
                animation: window.google.maps.Animation.DROP
            });
            markers.push(currentMarker);
        }

        // Receiver
        const receiverLat = parseFloat(delivery.receiver_latitude);
        const receiverLng = parseFloat(delivery.receiver_longitude);
        if (!isNaN(receiverLat) && !isNaN(receiverLng)) {
            pathCoordinates.push({ lat: receiverLat, lng: receiverLng });
            const receiverMarker = new window.google.maps.Marker({
                position: { lat: receiverLat, lng: receiverLng },
                map,
                title: 'Destination',
                icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: '#F44336',
                    fillOpacity: 1,
                    strokeColor: '#fff',
                    strokeWeight: 3
                },
                label: { text: 'B', color: '#fff', fontSize: '14px', fontWeight: 'bold' }
            });
            markers.push(receiverMarker);
        }

        markersRef.current = markers;

        // Path
        if (pathCoordinates.length > 1) {
            const polyline = new window.google.maps.Polyline({
                path: pathCoordinates,
                geodesic: true,
                strokeColor: '#8BC34A',
                strokeOpacity: 0.8,
                strokeWeight: 4,
                map
            });
            polylineRef.current = polyline;
        }

        // Bounds
        if (pathCoordinates.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            pathCoordinates.forEach(coord => bounds.extend(coord));
            map.fitBounds(bounds);
        }
    }, [delivery, trackingHistory]);

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-4 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Live Tracking Map</h3>
            </div>

            {/* IMPORTANT: overlay is sibling, map div is dedicated inner child */}
            <div className="w-full h-[500px] relative">
                {!mapReady && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8BC34A] mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading map...</p>
                        </div>
                    </div>
                )}

                <div ref={mapContainerRef} className="w-full h-full" />
            </div>
        </div>
    );
}

// Helper functions
function getMarkerIcon(method: string) {
    if (typeof window === 'undefined' || !window.google) {
        return undefined as any;
    }

    const icons: any = {
        road: {
            url:
                'data:image/svg+xml;charset=UTF-8,' +
                encodeURIComponent(
                    '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#8BC34A" stroke="#fff" stroke-width="2"/><text x="20" y="28" font-size="20" text-anchor="middle" fill="#fff">🚚</text></svg>'
                ),
            scaledSize: new window.google.maps.Size(40, 40)
        },
        flight: {
            url:
                'data:image/svg+xml;charset=UTF-8,' +
                encodeURIComponent(
                    '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#2196F3" stroke="#fff" stroke-width="2"/><text x="20" y="28" font-size="20" text-anchor="middle" fill="#fff">✈️</text></svg>'
                ),
            scaledSize: new window.google.maps.Size(40, 40)
        },
        sea: {
            url:
                'data:image/svg+xml;charset=UTF-8,' +
                encodeURIComponent(
                    '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#00BCD4" stroke="#fff" stroke-width="2"/><text x="20" y="28" font-size="20" text-anchor="middle" fill="#fff">🚢</text></svg>'
                ),
            scaledSize: new window.google.maps.Size(40, 40)
        }
    };
    return icons[method] || icons.road;
}

function getStatusColor(status: string) {
    const key = status.toLowerCase();
    const colors: any = {
        pending: '#FFA726',
        picked_up: '#66BB6A',
        in_transit: '#42A5F5',
        at_checkpoint: '#AB47BC',
        out_for_delivery: '#FF7043',
        arrived: '#26A69A',
        delivered: '#66BB6A',
        cancelled: '#EF5350'
    };
    return colors[key] || '#9E9E9E';
}

export default function TrackPage() {
    return (
        <>
            <style jsx global>{`
                @keyframes word-top-left {
                    0% { transform: translate(-100%, -100%) rotate(-45deg); opacity: 0; }
                    100% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
                }
                @keyframes word-top-right {
                    0% { transform: translate(100%, -100%) rotate(45deg); opacity: 0; }
                    100% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
                }
                @keyframes word-bottom-left {
                    0% { transform: translate(-100%, 100%) rotate(45deg); opacity: 0; }
                    100% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
                }
                @keyframes word-bottom-right {
                    0% { transform: translate(100%, 100%) rotate(-45deg); opacity: 0; }
                    100% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
                }
                .animate-word-top-left { animation: word-top-left 1.5s ease-out forwards; }
                .animate-word-top-right { animation: word-top-right 1.5s ease-out forwards; }
                .animate-word-bottom-left { animation: word-bottom-left 1.5s ease-out forwards; }
                .animate-word-bottom-right { animation: word-bottom-right 1.5s ease-out forwards; }
            `}</style>
            <Suspense
                fallback={
                    <div className="min-h-screen flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8BC34A]"></div>
                    </div>
                }
            >
                <TrackingContent />
            </Suspense>
        </>
    );
}
