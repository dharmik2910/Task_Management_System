import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Folder, CheckSquare, LogOut, Menu, X, User, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(() => {
        const saved = localStorage.getItem('sidebarCollapsed');
        return saved === 'true';
    });
    const location = useLocation();

    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', isCollapsed);
    }, [isCollapsed]);

    const navigation = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Projects', href: '/projects', icon: Folder },
        { name: 'My Tasks', href: '/tasks', icon: CheckSquare },
        { name: 'Profile', href: '/profile', icon: User },
    ];

    const isActive = (path) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                className={`fixed lg:static inset-y-0 left-0 z-50 ${isCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 transform lg:transform-none transition-all duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } flex flex-col`}
            >
                <div className="h-16 flex items-center px-4 border-b border-gray-100 justify-between">
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors mr-2 hidden lg:block"
                            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        >
                            <Menu size={20} />
                        </button>

                        {!isCollapsed && (
                            <Link to="/" className="flex items-center group">
                                <div className="h-8 w-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold mr-3 shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all">
                                    T
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent group-hover:from-indigo-600 group-hover:to-purple-600 transition-all whitespace-nowrap overflow-hidden">
                                    TaskFlow
                                </span>
                            </Link>
                        )}
                        {isCollapsed && (
                            <Link to="/" className="flex items-center justify-center w-full">
                                <div className="h-8 w-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30 transition-all">
                                    T
                                </div>
                            </Link>
                        )}
                    </div>

                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden text-gray-400 hover:text-gray-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                    {navigation.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative ${active
                                    ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 top-0'
                                    } ${isCollapsed ? 'justify-center' : ''}`}
                                title={isCollapsed ? item.name : ''}
                            >
                                <item.icon
                                    className={`h-5 w-5 transition-colors flex-shrink-0 ${active ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
                                        } ${!isCollapsed && 'mr-3'}`}
                                />
                                {!isCollapsed && <span className="whitespace-nowrap overflow-hidden">{item.name}</span>}
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-gray-100">
                    <div className={`flex items-center p-2 rounded-xl bg-gray-50 mb-3 ${isCollapsed ? 'justify-center' : ''}`}>
                        <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold flex-shrink-0">
                            {user?.name?.charAt(0) || <User size={18} />}
                        </div>
                        {!isCollapsed && (
                            <div className="overflow-hidden ml-3">
                                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={logout}
                        className={`w-full flex items-center px-2 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors ${isCollapsed ? 'justify-center' : ''}`}
                        title={isCollapsed ? 'Sign Out' : ''}
                    >
                        <LogOut size={18} className={!isCollapsed ? 'mr-2' : ''} />
                        {!isCollapsed && <span>Sign Out</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="lg:hidden h-16 flex items-center px-4 bg-white border-b border-gray-200">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                        <Menu size={24} />
                    </button>
                    <Link to="/" className="ml-4 text-lg font-bold text-gray-900 hover:text-indigo-600 transition-colors">TaskFlow</Link>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
