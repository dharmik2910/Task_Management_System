import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, Plus, X, Search, MoreVertical, Trash2, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import ConfirmationModal from '../components/ConfirmationModal';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentProject, setCurrentProject] = useState({ title: '', description: '' });
    const [projectIdToEdit, setProjectIdToEdit] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeDropdown, setActiveDropdown] = useState(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);

    const [error, setError] = useState('');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const { data } = await api.get('/projects');
            setProjects(data);
        } catch (error) {
            console.error('Failed to fetch projects', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        setError('');
        if (!currentProject.title.trim()) {
            setError('Project title is required');
            return;
        }
        try {
            const { data } = await api.post('/projects', currentProject);
            setProjects([data, ...projects]);
            closeModal();
        } catch (error) {
            console.error('Failed to create project', error);
            setError('Failed to create project');
        }
    };

    const handleUpdateProject = async (e) => {
        e.preventDefault();
        setError('');
        if (!currentProject.title.trim()) {
            setError('Project title is required');
            return;
        }
        try {
            const { data } = await api.put(`/projects/${projectIdToEdit}`, currentProject);
            setProjects(projects.map(p => p._id === projectIdToEdit ? data : p));
            closeModal();
        } catch (error) {
            console.error('Failed to update project', error);
            setError('Failed to update project');
        }
    };

    const confirmDeleteProject = async () => {
        if (!projectToDelete) return;
        try {
            await api.delete(`/projects/${projectToDelete}`);
            setProjects(projects.filter(p => p._id !== projectToDelete));
        } catch (error) {
            console.error('Failed to delete project', error);
        }
        setProjectToDelete(null);
    };

    const handleDeleteClick = (projectId, e) => {
        e.preventDefault();
        e.stopPropagation();
        setProjectToDelete(projectId);
        setIsDeleteModalOpen(true);
        setActiveDropdown(null);
    };

    const openCreateModal = () => {
        setIsEdit(false);
        setError('');
        setCurrentProject({ title: '', description: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (project, e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsEdit(true);
        setError('');
        setProjectIdToEdit(project._id);
        setCurrentProject({ title: project.title, description: project.description });
        setIsModalOpen(true);
        setActiveDropdown(null);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setError('');
        setCurrentProject({ title: '', description: '' });
        setProjectIdToEdit(null);
        setIsEdit(false);
    };

    const toggleDropdown = (projectId, e) => {
        e.preventDefault();
        e.stopPropagation();
        setActiveDropdown(activeDropdown === projectId ? null : projectId);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setActiveDropdown(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const filteredProjects = projects.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Layout>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
                    <p className="text-gray-500">Manage your ongoing projects</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30"
                >
                    <Plus size={20} className="mr-2" />
                    New Project
                </button>
            </div>

            <div className="relative mb-8">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project, index) => (
                        <motion.div
                            key={project._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 flex flex-col h-full"
                        >
                            <Link to={`/projects/${project._id}`} className="p-6 flex-1 flex flex-col">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                                        <Folder size={20} />
                                    </div>
                                    <div className="relative">
                                        <button
                                            onClick={(e) => toggleDropdown(project._id, e)}
                                            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50 transition-colors"
                                        >
                                            <MoreVertical size={20} />
                                        </button>

                                        {activeDropdown === project._id && (
                                            <div className="absolute right-0 top-8 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={(e) => openEditModal(project, e)}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center transition-colors"
                                                >
                                                    <Edit size={16} className="mr-2" />
                                                    Edit Project
                                                </button>
                                                <button
                                                    onClick={(e) => handleDeleteClick(project._id, e)}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors"
                                                >
                                                    <Trash2 size={16} className="mr-2" />
                                                    Delete Project
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{project.title}</h3>
                                <p className="text-gray-500 text-sm mb-6 line-clamp-2">{project.description}</p>

                                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                    <span className="text-xs text-gray-400">
                                        {new Date(project.createdAt).toLocaleDateString('en-GB')}
                                    </span>
                                    <span className="text-sm font-medium text-indigo-600 group-hover:text-indigo-700">
                                        View Tasks →
                                    </span>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                    <Folder size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No projects found</h3>
                    <p className="text-gray-500 mt-1">Get started by creating a new project.</p>
                </div>
            )}

            {/* Create/Edit Project Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        >
                            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-gray-900">{isEdit ? 'Edit Project' : 'Create New Project'}</h2>
                                    <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                                        <X size={24} />
                                    </button>
                                </div>

                                {error && (
                                    <div className="mx-6 mt-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={isEdit ? handleUpdateProject : handleCreateProject} className="p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                                            <input
                                                type="text"
                                                required
                                                value={currentProject.title}
                                                onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                                placeholder="e.g., Website Redesign"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                            <textarea
                                                required
                                                rows="3"
                                                value={currentProject.description}
                                                onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                                                placeholder="Brief description of the project..."
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-8 flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30"
                                        >
                                            {isEdit ? 'Save Changes' : 'Create Project'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDeleteProject}
                title="Delete Project"
                message="Are you sure you want to delete this project? This will delete all tasks within the project and cannot be undone."
                confirmText="Delete Project"
            />
        </Layout>
    );
};

export default Projects;
