import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { Mail, Loader, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            const { data } = await api.post('/users/forgotpassword', { email });
            setMessage(data.data); // "Email sent..."
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute bottom-0 left-0 w-[1000px] h-[1000px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative z-10 w-full max-w-md p-8 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20"
            >
                <div className="mb-6">
                    <Link to="/login" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Login
                    </Link>
                </div>

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Forgot Password?</h2>
                    <p className="text-gray-500 mt-2">Enter your email to receive a reset link</p>
                </div>

                {message ? (
                    <div className="text-center">
                        <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-lg text-sm border border-green-200">
                            {message}
                        </div>
                        <Link to="/login" className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors">
                            Return to Login
                        </Link>
                    </div>
                ) : (
                    <>
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {loading ? <Loader className="animate-spin h-5 w-5" /> : 'Send Reset Link'}
                            </button>
                        </form>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
