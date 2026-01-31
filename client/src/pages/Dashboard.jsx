import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { Folder, CheckSquare, TrendingUp, AlertCircle, Clock, CheckCircle, Plus } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, delay, linkTo }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
    >
        <Link to={linkTo} className="block bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                </div>
                <div className={`p-3 rounded-xl ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </Link>
    </motion.div>
);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/dashboard/stats');
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch dashboard stats', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500">Overview of your productivity</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Projects"
                        value={stats?.counts?.projects || 0}
                        icon={Folder}
                        color="bg-indigo-500"
                        delay={0.1}
                        linkTo="/projects"
                    />
                    <StatCard
                        title="Tasks To Do"
                        value={stats?.counts?.tasksByStatus?.todo || 0}
                        icon={Clock}
                        color="bg-amber-500"
                        delay={0.2}
                        linkTo="/tasks?status=Todo"
                    />
                    <StatCard
                        title="In Progress"
                        value={stats?.counts?.tasksByStatus?.inProgress || 0}
                        icon={TrendingUp}
                        color="bg-blue-500"
                        delay={0.3}
                        linkTo="/tasks?status=In Progress"
                    />
                    <StatCard
                        title="Completed"
                        value={stats?.counts?.tasksByStatus?.done || 0}
                        icon={CheckCircle}
                        color="bg-green-500"
                        delay={0.4}
                        linkTo="/tasks?status=Done"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Projects */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-96"
                    >
                        <div className="flex items-center justify-between mb-6 shrink-0">
                            <h2 className="text-lg font-bold text-gray-900">Recent Projects</h2>
                            <Link to="/projects" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">View All</Link>
                        </div>

                        <div className="overflow-y-auto pr-2 custom-scrollbar flex-1">
                            {stats?.recentProjects?.length > 0 ? (
                                <div className="space-y-4">
                                    {stats.recentProjects.map((project) => (
                                        <Link key={project._id} to={`/projects/${project._id}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors block">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mr-4">
                                                    <Folder size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-900">{project.title}</h3>
                                                    <p className="text-xs text-gray-500">{new Date(project.createdAt).toLocaleDateString('en-GB')}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                {/* Could add project specific stats here if available */}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 mb-4">No projects yet</p>
                                    <Link to="/projects" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                                        <Plus size={16} className="mr-2" />
                                        New Project
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Task Priority Distribution (Placeholder for chart or list) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-96"
                    >
                        <h2 className="text-lg font-bold text-gray-900 mb-6 shrink-0">Task Priority</h2>
                        <div className="space-y-4 flex-1 flex flex-col justify-center">
                            <div className="flex flex-col">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 mr-3 animate-pulse"></div>
                                        <span className="font-medium text-gray-700">High Priority</span>
                                    </div>
                                    <span className="font-bold text-gray-900 bg-gray-50 px-2 py-1 rounded-md">{stats?.counts?.tasksByPriority?.high || 0}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div className="bg-red-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${(stats?.counts?.tasksByPriority?.high / stats?.counts?.tasks) * 100 || 0}%` }}></div>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 mr-3"></div>
                                        <span className="font-medium text-gray-700">Medium Priority</span>
                                    </div>
                                    <span className="font-bold text-gray-900 bg-gray-50 px-2 py-1 rounded-md">{stats?.counts?.tasksByPriority?.medium || 0}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div className="bg-yellow-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${(stats?.counts?.tasksByPriority?.medium / stats?.counts?.tasks) * 100 || 0}%` }}></div>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 mr-3"></div>
                                        <span className="font-medium text-gray-700">Low Priority</span>
                                    </div>
                                    <span className="font-bold text-gray-900 bg-gray-50 px-2 py-1 rounded-md">{stats?.counts?.tasksByPriority?.low || 0}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${(stats?.counts?.tasksByPriority?.low / stats?.counts?.tasks) * 100 || 0}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
