import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, LogOut, Plus, MapPin, Calendar, DollarSign, Users, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { tripAPI } from '../services/api';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [tripToDelete, setTripToDelete] = useState(null);

    useEffect(() => {
        fetchTrips();
    }, []);

    const fetchTrips = async () => {
        try {
            const response = await tripAPI.getMyTrips();
            setTrips(response.data.data);
        } catch (error) {
            console.error('Error fetching trips:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleDeleteClick = (e, trip) => {
        e.stopPropagation(); // Prevent navigation to trip details
        setTripToDelete(trip);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!tripToDelete) return;

        setDeletingId(tripToDelete.tripId);
        try {
            await tripAPI.deleteTrip(tripToDelete.tripId);
            // Remove from local state
            setTrips(trips.filter(t => t.tripId !== tripToDelete.tripId));
            setShowDeleteConfirm(false);
            setTripToDelete(null);
        } catch (error) {
            console.error('Error deleting trip:', error);
            alert('Failed to delete trip. Please try again.');
        } finally {
            setDeletingId(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setTripToDelete(null);
    };

    const getPlanTypeColor = (planType) => {
        switch (planType) {
            case 'BUDGET':
                return 'bg-accent-500/20 text-accent-400 border-accent-500/30';
            case 'BALANCED':
                return 'bg-primary-500/20 text-primary-400 border-primary-500/30';
            case 'COMFORT':
                return 'bg-secondary-500/20 text-secondary-400 border-secondary-500/30';
            default:
                return 'bg-dark-700 text-dark-300 border-dark-600';
        }
    };

    return (
        <div className="min-h-screen bg-dark-950">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-600/5 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center glow">
                            <Plane className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-display font-bold gradient-text">Planora</h1>
                            <p className="text-dark-400 text-sm">Welcome back, {user?.username}!</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="btn-outline flex items-center space-x-2">
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-dark-400 text-sm mb-1">Total Trips</p>
                                <p className="text-3xl font-bold text-dark-100">{trips.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-primary-400" />
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-dark-400 text-sm mb-1">Active Plans</p>
                                <p className="text-3xl font-bold text-dark-100">
                                    {trips.filter(t => t.status === 'DRAFT').length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-accent-500/20 rounded-xl flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-accent-400" />
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-dark-400 text-sm mb-1">Total Budget</p>
                                <p className="text-3xl font-bold text-dark-100">
                                    ₹{trips.reduce((sum, trip) => sum + trip.totalBudget, 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-secondary-500/20 rounded-xl flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-secondary-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Create New Trip Button */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/plan-trip')}
                        className="btn-primary w-full md:w-auto flex items-center justify-center space-x-2"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Plan New Trip</span>
                    </button>
                </div>

                {/* Trips List */}
                <div>
                    <h2 className="text-2xl font-display font-bold text-dark-100 mb-6">Your Trips</h2>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-500"></div>
                        </div>
                    ) : trips.length === 0 ? (
                        <div className="card text-center py-16">
                            <MapPin className="w-16 h-16 text-dark-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-dark-300 mb-2">No trips yet</h3>
                            <p className="text-dark-500 mb-6">Start planning your first adventure!</p>
                            <button onClick={() => navigate('/plan-trip')} className="btn-primary inline-flex items-center space-x-2">
                                <Plus className="w-5 h-5" />
                                <span>Create Your First Trip</span>
                            </button>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {trips.map((trip) => (
                                <div
                                    key={trip.tripId}
                                    onClick={() => navigate(`/trip/${trip.tripId}`)}
                                    className="card-hover"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-dark-100 mb-1">
                                                {trip.destinationName}
                                            </h3>
                                            <p className="text-dark-400 text-sm flex items-center">
                                                <MapPin className="w-4 h-4 mr-1" />
                                                From {trip.startCity}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getPlanTypeColor(trip.planType)}`}>
                                                {trip.planType}
                                            </span>
                                            <button
                                                onClick={(e) => handleDeleteClick(e, trip)}
                                                disabled={deletingId === trip.tripId}
                                                className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                                                title="Delete trip"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center text-dark-400 text-sm">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center text-dark-400 text-sm">
                                            <Users className="w-4 h-4 mr-2" />
                                            {trip.numberOfTravelers} {trip.numberOfTravelers === 1 ? 'Traveler' : 'Travelers'}
                                        </div>
                                        <div className="flex items-center text-dark-400 text-sm">
                                            <DollarSign className="w-4 h-4 mr-2" />
                                            ₹{trip.totalBudget.toLocaleString()}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-dark-800">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-dark-500">{trip.numberOfDays} days</span>
                                            <span className="text-primary-400 font-medium">View Details →</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-dark-900 rounded-xl p-6 max-w-md w-full mx-4 border border-dark-700">
                        <h3 className="text-xl font-bold text-dark-100 mb-2">Delete Trip?</h3>
                        <p className="text-dark-400 mb-6">
                            Are you sure you want to delete the trip to <span className="text-primary-400 font-semibold">{tripToDelete?.destinationName}</span>? This action cannot be undone.
                        </p>
                        <div className="flex space-x-3">
                            <button
                                onClick={cancelDelete}
                                className="flex-1 px-4 py-2 bg-dark-800 hover:bg-dark-700 text-dark-200 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={deletingId !== null}
                                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
                            >
                                {deletingId ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
