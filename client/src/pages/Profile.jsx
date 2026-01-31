import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import { User, Mail, Shield, Save, Loader, CheckCircle, Edit, X, BadgeCheck, CheckSquare, Folder, TrendingUp, Calendar, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user, login } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name,
                email: user.email
            }));
        }
    }, [user]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/dashboard/stats');
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            }
        };
        fetchStats();
    }, []);

    // Auto-dismiss messages
    useEffect(() => {
        if (message || error) {
            const timer = setTimeout(() => {
                setMessage('');
                setError('');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [message, error]);

    const validateEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        // Validation
        if (!formData.name.trim() || formData.name.length < 2) {
            setError('Name must be at least 2 characters long');
            setLoading(false);
            return;
        }

        if (!validateEmail(formData.email)) {
            setError('Please enter a valid email address');
            setLoading(false);
            return;
        }

        if (formData.password) {
            if (formData.password.length < 6) {
                setError('Password must be at least 6 characters long');
                setLoading(false);
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match');
                setLoading(false);
                return;
            }
        }

        try {
            const { data } = await api.put('/users/profile', {
                name: formData.name,
                email: formData.email,
                password: formData.password || undefined
            });

            localStorage.setItem('token', data.token);
            setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
            setMessage('Profile updated successfully');
            setIsEditing(false);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <Layout>
            <div className="h-[calc(100vh-theme(spacing.16))] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col">
                {/* Header */}
                <div className="mb-4 flex-shrink-0">
                    <h1 className="text-xl font-bold text-gray-900">Profile Settings</h1>
                    <p className="text-gray-500 text-xs mt-0.5">Manage your account information and preferences</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">

                    {/* Left Column: Fixed (4 cols) */}
                    <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto pr-1">
                        {/* Profile Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-shrink-0">
                            {/* Banner */}
                            <div className="h-24 bg-gradient-to-r from-indigo-500 via-skyblue-500 to-pink-500 relative">
                                <div className="absolute inset-0 bg-black/10"></div>
                            </div>

                            {/* Avatar & Info */}
                            <div className="px-5 pb-5 relative">
                                <div className="flex justify-center -mt-10 mb-3">
                                    <div className="relative">
                                        <div className="h-20 w-20 rounded-full border-4 border-white bg-indigo-50 flex items-center justify-center text-indigo-600 text-2xl font-bold shadow-md">
                                            {user?.name?.charAt(0)}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <h2 className="text-lg font-bold text-gray-900 flex items-center justify-center gap-2">
                                        {user?.name}
                                        {user?.role === 'admin' && <BadgeCheck size={16} className="text-blue-500" />}
                                    </h2>
                                    <p className="text-gray-500 text-xs mb-3">{user?.email}</p>

                                    <div className="flex justify-center gap-2">
                                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-100 uppercase tracking-wide">
                                            {user?.role || 'User'}
                                        </span>
                                        <span className="px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-bold border border-green-100 uppercase tracking-wide flex items-center">
                                            <CheckCircle size={10} className="mr-1" /> Active
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>Member Since</span>
                                        <span className="font-medium text-gray-900 flex items-center">
                                            <Calendar size={12} className="mr-1" />
                                            {formatDate(user?.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Productivity Stats */}
                        {stats && (
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex-shrink-0">
                                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center">
                                    <TrendingUp className="w-3.5 h-3.5 text-indigo-500 mr-2" />
                                    Productivity
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                                        <div className="flex items-center text-gray-600">
                                            <div className="p-1.5 bg-white rounded-md shadow-sm mr-2.5">
                                                <CheckSquare size={14} className="text-indigo-600" />
                                            </div>
                                            <span className="text-xs font-medium">Total Tasks</span>
                                        </div>
                                        <span className="text-base font-bold text-gray-900">{stats.totalTasks}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                                        <div className="flex items-center text-gray-600">
                                            <div className="p-1.5 bg-white rounded-md shadow-sm mr-2.5">
                                                <Folder size={14} className="text-purple-600" />
                                            </div>
                                            <span className="text-xs font-medium">Total Projects</span>
                                        </div>
                                        <span className="text-base font-bold text-gray-900">{stats.totalProjects}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Edit Form (8 cols) - Full Height with Internal Scroll */}
                    <div className="lg:col-span-8 h-full min-h-0">
                        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full max-h-full">
                            <div className="px-6 py-4 border-b border-gray-100 flex-shrink-0 flex justify-between items-center bg-gray-50/50">
                                <div>
                                    <h2 className="text-base font-bold text-gray-900">Personal Details</h2>
                                </div>
                                {message && (
                                    <span className="text-[10px] font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full flex items-center shadow-sm">
                                        <CheckCircle size={10} className="mr-1" /> Saved
                                    </span>
                                )}
                            </div>

                            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                                {error && (
                                    <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-xs flex items-center animate-shake">
                                        <Shield className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-6">
                                    {/* Personal Info */}
                                    <div>
                                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                                            Personal Information
                                            <span className="ml-2 h-px bg-gray-100 flex-1"></span>
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1.5">Full Name</label>
                                                <div className="relative group">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 transition-colors group-focus-within:text-indigo-500" />
                                                    <input
                                                        type="text"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        disabled={!isEditing}
                                                        className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg transition-all outline-none ${!isEditing ? 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500'}`}
                                                        placeholder="Your Name"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1.5">Email Address</label>
                                                <div className="relative group">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 transition-colors group-focus-within:text-indigo-500" />
                                                    <input
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        disabled={!isEditing}
                                                        className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg transition-all outline-none ${!isEditing ? 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500'}`}
                                                        placeholder="you@example.com"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Security */}
                                    <div>
                                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                                            Security
                                            <span className="ml-2 h-px bg-gray-100 flex-1"></span>
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1.5">New Password</label>
                                                <input
                                                    type="password"
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                    disabled={!isEditing}
                                                    className={`w-full px-3 py-2 text-sm border rounded-lg transition-all outline-none ${!isEditing ? 'bg-gray-50 border-gray-200 text-gray-500 placeholder:text-gray-400 cursor-not-allowed' : 'bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500'}`}
                                                    placeholder={!isEditing ? "••••••••" : "Leave blank to keep current"}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1.5">Confirm Password</label>
                                                <input
                                                    type="password"
                                                    value={formData.confirmPassword}
                                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                    disabled={!isEditing}
                                                    className={`w-full px-3 py-2 text-sm border rounded-lg transition-all outline-none ${!isEditing ? 'bg-gray-50 border-gray-200 text-gray-500 placeholder:text-gray-400 cursor-not-allowed' : 'bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500'}`}
                                                    placeholder={!isEditing ? "••••••••" : "Confirm new password"}
                                                />
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-gray-400 flex items-center mt-2">
                                            <Shield className="w-3 h-3 mr-1" />
                                            Passwords are encrypted securely.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex-shrink-0 flex justify-end">
                                {!isEditing ? (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(true)}
                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30"
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit Profile
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditing(false);
                                                if (user) {
                                                    setFormData({
                                                        name: user.name,
                                                        email: user.email,
                                                        password: '',
                                                        confirmPassword: ''
                                                    });
                                                    setError('');
                                                    setMessage('');
                                                }
                                            }}
                                            className="inline-flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors mr-3"
                                        >
                                            <X className="h-4 w-4 mr-2" />
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {loading ? <Loader className="animate-spin h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                            Save Changes
                                        </button>
                                    </>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Profile;
