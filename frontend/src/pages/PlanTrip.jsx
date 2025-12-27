import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, MapPin, Calendar, Users, DollarSign, ArrowLeft } from 'lucide-react';
import { tripAPI, destinationAPI } from '../services/api';

const PlanTrip = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        startCity: '',
        destination: '',
        startDate: '',
        endDate: '',
        numberOfTravelers: 1,
        travelType: 'SOLO',
        totalBudget: '',
        planType: 'BALANCED',
    });

    // Autocomplete state
    const [showStartCitySuggestions, setShowStartCitySuggestions] = useState(false);
    const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);

    // Data from backend
    const [popularCities, setPopularCities] = useState([]);
    const [popularDestinations, setPopularDestinations] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    // Fetch destinations from backend on component mount
    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const response = await destinationAPI.getAll();
                const destinations = response.data.data || [];

                // Set destinations
                setPopularDestinations(destinations);

                // For cities, we'll use major Indian cities (can be moved to backend later)
                setPopularCities([
                    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata',
                    'Pune', 'Ahmedabad', 'Surat', 'Jaipur', 'Lucknow', 'Kanpur',
                    'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Patna'
                ]);

                setLoadingData(false);
            } catch (err) {
                console.error('Failed to fetch destinations:', err);
                // Fallback to hardcoded list if API fails
                setPopularDestinations([
                    'Goa', 'Jaipur', 'Kerala', 'Manali', 'Udaipur', 'Rishikesh',
                    'Varanasi', 'Andaman Islands', 'Shimla', 'Agra', 'Ladakh',
                    'Munnar', 'Darjeeling', 'Mysore', 'Hampi', 'Ooty', 'Coorg',
                    'Nainital', 'Mussoorie', 'Gokarna', 'Pondicherry', 'Kasol'
                ]);
                setPopularCities([
                    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata',
                    'Pune', 'Ahmedabad', 'Surat', 'Jaipur', 'Lucknow', 'Kanpur',
                    'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Patna'
                ]);
                setLoadingData(false);
            }
        };

        fetchDestinations();
    }, []);

    // Filter suggestions based on input
    const getFilteredCities = (input) => {
        if (!input) return popularCities;
        return popularCities.filter(city =>
            city.toLowerCase().includes(input.toLowerCase())
        );
    };

    const getFilteredDestinations = (input) => {
        if (!input) return popularDestinations;
        return popularDestinations.filter(dest =>
            dest.toLowerCase().includes(input.toLowerCase())
        );
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError('');

        // Show suggestions when typing
        if (name === 'startCity') {
            setShowStartCitySuggestions(true);
        } else if (name === 'destination') {
            setShowDestinationSuggestions(true);
        }
    };

    const selectStartCity = (city) => {
        setFormData({ ...formData, startCity: city });
        setShowStartCitySuggestions(false);
    };

    const selectDestination = (destination) => {
        setFormData({ ...formData, destination: destination });
        setShowDestinationSuggestions(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await tripAPI.createTrip(formData);
            const tripId = response.data.data.tripId;
            navigate(`/trip/${tripId}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create trip plan');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-950">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-600/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center text-dark-400 hover:text-dark-200 mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Dashboard
                    </button>

                    <div className="flex items-center space-x-4 mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center glow">
                            <Plane className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-display font-bold gradient-text">Plan Your Trip</h1>
                            <p className="text-dark-400">Tell us about your travel plans</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="card">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Starting City */}
                        <div>
                            <label className="block text-sm font-medium text-dark-300 mb-2">
                                Starting City (Source)
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-500 z-10" />
                                <input
                                    type="text"
                                    name="startCity"
                                    value={formData.startCity}
                                    onChange={handleChange}
                                    onFocus={() => setShowStartCitySuggestions(true)}
                                    onBlur={() => setTimeout(() => setShowStartCitySuggestions(false), 200)}
                                    className="input-field pl-11"
                                    placeholder="e.g., Mumbai, Delhi, Bangalore"
                                    required
                                    autoComplete="off"
                                />
                                {/* Autocomplete Dropdown */}
                                {showStartCitySuggestions && (
                                    <div className="absolute z-50 w-full mt-1 bg-dark-800 border border-dark-700 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                                        {getFilteredCities(formData.startCity).map((city, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onMouseDown={() => selectStartCity(city)}
                                                className="w-full text-left px-4 py-3 hover:bg-dark-700 text-dark-200 transition-colors first:rounded-t-xl last:rounded-b-xl flex items-center space-x-2"
                                            >
                                                <MapPin className="w-4 h-4 text-dark-500" />
                                                <span>{city}</span>
                                            </button>
                                        ))}
                                        {getFilteredCities(formData.startCity).length === 0 && (
                                            <div className="px-4 py-3 text-dark-400 text-sm">
                                                No cities found
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Destination */}
                        <div>
                            <label className="block text-sm font-medium text-dark-300 mb-2">
                                Destination
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-500 z-10" />
                                <input
                                    type="text"
                                    name="destination"
                                    value={formData.destination}
                                    onChange={handleChange}
                                    onFocus={() => setShowDestinationSuggestions(true)}
                                    onBlur={() => setTimeout(() => setShowDestinationSuggestions(false), 200)}
                                    className="input-field pl-11"
                                    placeholder="e.g., Goa, Jaipur, Kerala"
                                    required
                                    autoComplete="off"
                                />
                                {/* Autocomplete Dropdown */}
                                {showDestinationSuggestions && (
                                    <div className="absolute z-50 w-full mt-1 bg-dark-800 border border-dark-700 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                                        {getFilteredDestinations(formData.destination).map((dest, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onMouseDown={() => selectDestination(dest)}
                                                className="w-full text-left px-4 py-3 hover:bg-dark-700 text-dark-200 transition-colors first:rounded-t-xl last:rounded-b-xl flex items-center space-x-2"
                                            >
                                                <MapPin className="w-4 h-4 text-primary-500" />
                                                <span>{dest}</span>
                                            </button>
                                        ))}
                                        {getFilteredDestinations(formData.destination).length === 0 && (
                                            <div className="px-4 py-3 text-dark-400 text-sm">
                                                No destinations found
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <p className="mt-2 text-xs text-dark-400">
                                We'll calculate travel costs from your starting city to this destination
                            </p>
                        </div>

                        {/* Dates */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-dark-300 mb-2">
                                    Start Date
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-500" />
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        className="input-field pl-11"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-dark-300 mb-2">
                                    End Date
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-500" />
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        className="input-field pl-11"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Number of Travelers */}
                        <div>
                            <label className="block text-sm font-medium text-dark-300 mb-2">
                                Number of Travelers
                            </label>
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-500" />
                                <input
                                    type="number"
                                    name="numberOfTravelers"
                                    value={formData.numberOfTravelers}
                                    onChange={handleChange}
                                    className="input-field pl-11"
                                    min="1"
                                    required
                                />
                            </div>
                        </div>

                        {/* Travel Type */}
                        <div>
                            <label className="block text-sm font-medium text-dark-300 mb-3">
                                Travel Type
                            </label>
                            <div className="grid grid-cols-3 gap-4">
                                {['SOLO', 'COUPLE', 'FAMILY'].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, travelType: type })}
                                        className={`py-3 px-4 rounded-xl font-medium transition-all ${formData.travelType === type
                                            ? 'bg-primary-500 text-white shadow-lg scale-105'
                                            : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Total Budget */}
                        <div>
                            <label className="block text-sm font-medium text-dark-300 mb-2">
                                Total Budget (₹)
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-500" />
                                <input
                                    type="number"
                                    name="totalBudget"
                                    value={formData.totalBudget}
                                    onChange={handleChange}
                                    className="input-field pl-11"
                                    placeholder="e.g., 50000"
                                    min="1"
                                    required
                                />
                            </div>
                        </div>

                        {/* Plan Type */}
                        <div>
                            <label className="block text-sm font-medium text-dark-300 mb-3">
                                Plan Type
                            </label>
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { type: 'BUDGET', desc: 'Save more', color: 'accent' },
                                    { type: 'BALANCED', desc: 'Best value', color: 'primary' },
                                    { type: 'COMFORT', desc: 'Premium stay', color: 'secondary' },
                                ].map(({ type, desc, color }) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, planType: type })}
                                        className={`p-4 rounded-xl border-2 transition-all ${formData.planType === type
                                            ? `border-${color}-500 bg-${color}-500/10 scale-105`
                                            : 'border-dark-700 bg-dark-800 hover:border-dark-600'
                                            }`}
                                    >
                                        <div className="font-semibold text-dark-100 mb-1">{type}</div>
                                        <div className="text-xs text-dark-400">{desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Your Trip Plan...
                                </span>
                            ) : (
                                'Generate Trip Plan'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PlanTrip;
