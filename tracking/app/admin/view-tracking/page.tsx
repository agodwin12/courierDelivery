'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Delivery {
    id: number;
    tracking_number: string;
    sender_name: string;
    receiver_name: string;
    receiver_address: string;
    delivery_method: string;
    delivery_status: string;
    start_time: string;
    end_time: string;
    created_at: string;
}

interface Stats {
    total: number;
    pending: number;
    in_transit: number;
    delivered: number;
    cancelled: number;
}

export default function ViewTracking() {
    const router = useRouter();
    const [currentAdmin, setCurrentAdmin] = useState<any>(null);
    const [deliveries, setDeliveries] = useState<Delivery[]>([]);
    const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, in_transit: 0, delivered: 0, cancelled: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterMethod, setFilterMethod] = useState('');

    // Modal states
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);

    // Form states
    const [statusFormData, setStatusFormData] = useState({
        status: ''
    });

    const [locationFormData, setLocationFormData] = useState({
        latitude: '',
        longitude: '',
        address: '',
        status: 'in_transit',
        notes: ''
    });

    // Get API URL from environment variable
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

    // Check authentication
    useEffect(() => {
        const token = localStorage.getItem('token');
        const adminData = localStorage.getItem('admin');

        if (!token || !adminData) {
            router.push('/admin/login');
            return;
        }

        setCurrentAdmin(JSON.parse(adminData));
        fetchDeliveries();
        fetchStats();
    }, [filterStatus, filterMethod]);

    // Fetch all deliveries
    const fetchDeliveries = async () => {
        try {
            const token = localStorage.getItem('token');
            let url = `${API_URL}/deliveries?`;

            if (filterStatus) url += `status=${filterStatus}&`;
            if (filterMethod) url += `method=${filterMethod}&`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setDeliveries(data.deliveries);
            } else {
                setError(data.message);
            }
        } catch (err: any) {
            setError('Failed to fetch deliveries');
        } finally {
            setLoading(false);
        }
    };

    // Fetch statistics
    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/deliveries/stats/overview`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setStats(data.stats);
            }
        } catch (err: any) {
            console.error('Failed to fetch stats');
        }
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        router.push('/admin/login');
    };

    // Open status modal
    const openStatusModal = (delivery: Delivery) => {
        setSelectedDelivery(delivery);
        setStatusFormData({ status: delivery.delivery_status });
        setShowStatusModal(true);
    };

    // Open location modal
    const openLocationModal = (delivery: Delivery) => {
        setSelectedDelivery(delivery);
        setLocationFormData({
            latitude: '',
            longitude: '',
            address: '',
            status: 'in_transit',
            notes: ''
        });
        setShowLocationModal(true);
    };

    // Handle update status
    const handleUpdateStatus = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!selectedDelivery) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/deliveries/${selectedDelivery.id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: statusFormData.status })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Status updated successfully!');
                setShowStatusModal(false);
                fetchDeliveries();
                fetchStats();
            } else {
                setError(data.message || 'Failed to update status');
            }
        } catch (err: any) {
            setError('An error occurred while updating status');
        }
    };

    // Handle update location
    const handleUpdateLocation = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!selectedDelivery) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/deliveries/${selectedDelivery.id}/location`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(locationFormData)
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Location updated successfully!');
                setShowLocationModal(false);
                fetchDeliveries();
            } else {
                setError(data.message || 'Failed to update location');
            }
        } catch (err: any) {
            setError('An error occurred while updating location');
        }
    };

    // Handle delete delivery
    const handleDeleteDelivery = async (deliveryId: number) => {
        if (!confirm('Are you sure you want to delete this delivery?')) return;

        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/deliveries/${deliveryId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Delivery deleted successfully!');
                fetchDeliveries();
                fetchStats();
            } else {
                setError(data.message || 'Failed to delete delivery');
            }
        } catch (err: any) {
            setError('An error occurred while deleting delivery');
        }
    };

    // Get status badge color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'in_transit': return 'bg-blue-100 text-blue-800';
            case 'arrived': return 'bg-purple-100 text-purple-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Get method icon
    const getMethodIcon = (method: string) => {
        switch (method) {
            case 'road':
                return '🚚';
            case 'flight':
                return '✈️';
            case 'sea':
                return '🚢';
            default:
                return '📦';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#8BC34A] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-[#2d2d2d] text-white flex flex-col">
                {/* Logo */}
                <div className="p-6 border-b border-gray-700">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#8BC34A] rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold">MovinCargo</span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4">
                    <Link
                        href="/admin/dashboard"
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 text-gray-300 hover:bg-gray-700 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span>Dashboard</span>
                    </Link>

                    <Link
                        href="/admin/create-tracking"
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 text-gray-300 hover:bg-gray-700 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Create Tracking</span>
                    </Link>

                    <Link
                        href="/admin/view-tracking"
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 bg-[#8BC34A] text-white transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span>View All Tracking</span>
                    </Link>
                </nav>

                {/* User Info & Logout */}
                <div className="p-4 border-t border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-[#8BC34A] rounded-full flex items-center justify-center">
              <span className="text-white font-bold">
                {currentAdmin?.full_name?.charAt(0) || 'A'}
              </span>
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-sm">{currentAdmin?.full_name}</p>
                            <p className="text-xs text-gray-400">{currentAdmin?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Header */}
                <header className="bg-white shadow-sm p-6">
                    <h1 className="text-3xl font-bold text-[#2d2d2d]">View All Tracking</h1>
                    <p className="text-gray-600 mt-1">Monitor and manage all deliveries</p>
                </header>

                {/* Content */}
                <div className="p-6">
                    {/* Success/Error Messages */}
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-green-700">{success}</p>
                        </div>
                    )}

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow p-4">
                            <p className="text-gray-600 text-sm mb-1">Total</p>
                            <p className="text-2xl font-bold text-[#2d2d2d]">{stats.total}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <p className="text-gray-600 text-sm mb-1">Pending</p>
                            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <p className="text-gray-600 text-sm mb-1">In Transit</p>
                            <p className="text-2xl font-bold text-blue-600">{stats.in_transit}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <p className="text-gray-600 text-sm mb-1">Delivered</p>
                            <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <p className="text-gray-600 text-sm mb-1">Cancelled</p>
                            <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow p-4 mb-6">
                        <div className="flex flex-wrap gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                                >
                                    <option value="">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="in_transit">In Transit</option>
                                    <option value="arrived">Arrived</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Method</label>
                                <select
                                    value={filterMethod}
                                    onChange={(e) => setFilterMethod(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                                >
                                    <option value="">All Methods</option>
                                    <option value="road">🚚 Road</option>
                                    <option value="flight">✈️ Flight</option>
                                    <option value="sea">🚢 Sea</option>
                                </select>
                            </div>

                            {(filterStatus || filterMethod) && (
                                <div className="flex items-end">
                                    <button
                                        onClick={() => {
                                            setFilterStatus('');
                                            setFilterMethod('');
                                        }}
                                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Deliveries Table */}
                    <div className="bg-white rounded-lg shadow overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking #</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sender</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receiver</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {deliveries.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                        <p className="text-lg font-semibold">No deliveries found</p>
                                        <p className="text-sm">Create your first tracking number to get started</p>
                                    </td>
                                </tr>
                            ) : (
                                deliveries.map((delivery) => (
                                    <tr key={delivery.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-mono font-bold text-[#8BC34A]">{delivery.tracking_number}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{delivery.sender_name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{delivery.receiver_name}</div>
                                            <div className="text-xs text-gray-500">{delivery.receiver_address.substring(0, 30)}...</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-2xl">{getMethodIcon(delivery.delivery_method)}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(delivery.delivery_status)}`}>
                          {delivery.delivery_status}
                        </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(delivery.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => openStatusModal(delivery)}
                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                                title="Update Status"
                                            >
                                                Status
                                            </button>
                                            <button
                                                onClick={() => openLocationModal(delivery)}
                                                className="text-[#8BC34A] hover:text-[#7CB342] mr-3"
                                                title="Update Location"
                                            >
                                                Location
                                            </button>
                                            <button
                                                onClick={() => handleDeleteDelivery(delivery.id)}
                                                className="text-red-600 hover:text-red-900"
                                                title="Delete"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Update Status Modal */}
            {showStatusModal && selectedDelivery && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-[#2d2d2d]">Update Status</h2>
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">Tracking Number:</p>
                            <p className="font-mono font-bold text-[#8BC34A]">{selectedDelivery.tracking_number}</p>
                        </div>

                        <form onSubmit={handleUpdateStatus} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Status</label>
                                <select
                                    value={statusFormData.status}
                                    onChange={(e) => setStatusFormData({ status: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                                    required
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in_transit">In Transit</option>
                                    <option value="arrived">Arrived</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowStatusModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-[#8BC34A] hover:bg-[#7CB342] text-white rounded-lg transition-colors"
                                >
                                    Update Status
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Update Location Modal */}
            {showLocationModal && selectedDelivery && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-[#2d2d2d]">Update Location</h2>
                            <button
                                onClick={() => setShowLocationModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">Tracking Number:</p>
                            <p className="font-mono font-bold text-[#8BC34A]">{selectedDelivery.tracking_number}</p>
                        </div>

                        <form onSubmit={handleUpdateLocation} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Latitude *</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={locationFormData.latitude}
                                        onChange={(e) => setLocationFormData({ ...locationFormData, latitude: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                                        placeholder="e.g., 34.0522"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Longitude *</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={locationFormData.longitude}
                                        onChange={(e) => setLocationFormData({ ...locationFormData, longitude: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                                        placeholder="e.g., -118.2437"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                <input
                                    type="text"
                                    value={locationFormData.address}
                                    onChange={(e) => setLocationFormData({ ...locationFormData, address: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                                    placeholder="e.g., Los Angeles, CA"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select
                                    value={locationFormData.status}
                                    onChange={(e) => setLocationFormData({ ...locationFormData, status: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                                >
                                    <option value="picked_up">Picked Up</option>
                                    <option value="in_transit">In Transit</option>
                                    <option value="at_checkpoint">At Checkpoint</option>
                                    <option value="out_for_delivery">Out for Delivery</option>
                                    <option value="arrived">Arrived</option>
                                    <option value="delivered">Delivered</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                                <textarea
                                    value={locationFormData.notes}
                                    onChange={(e) => setLocationFormData({ ...locationFormData, notes: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                                    placeholder="Optional notes..."
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowLocationModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-[#8BC34A] hover:bg-[#7CB342] text-white rounded-lg transition-colors"
                                >
                                    Update Location
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}