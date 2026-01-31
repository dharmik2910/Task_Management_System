import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, Flag, CheckSquare, Square, Clock, ArrowLeft, Trash2, Edit2, X, MoreVertical, Eye } from 'lucide-react';
import TaskModal from '../components/TaskModal';
import ConfirmationModal from '../components/ConfirmationModal';
import TaskDetailsModal from '../components/TaskDetailsModal';

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState(null);

    // New Task State
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        status: 'Todo',
        priority: 'Medium',
        dueDate: ''
    });

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);

    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewTask, setViewTask] = useState(null);

    useEffect(() => {
        const fetchProjectAndTasks = async () => {
            try {
                const [projectRes, tasksRes] = await Promise.all([
                    api.get(`/projects/${id}`),
                    api.get(`/tasks/project/${id}`)
                ]);
                setProject(projectRes.data);
                setTasks(tasksRes.data);
            } catch (error) {
                console.error('Failed to fetch data', error);
                // navigate('/projects');
            } finally {
                setLoading(false);
            }
        };

        fetchProjectAndTasks();
    }, [id, navigate]);

    const handleCreateTask = async (taskData) => {
        try {
            const { data } = await api.post('/tasks', { ...taskData, projectId: id });
            setTasks([...tasks, data]);
            closeModal();
        } catch (error) {
            console.error('Failed to create task', error);
        }
    };

    const handleUpdateTaskData = async (taskData) => {
        try {
            const { data } = await api.put(`/tasks/${editingTaskId}`, taskData);
            setTasks(tasks.map(t => t._id === editingTaskId ? data : t));
            closeModal();
        } catch (error) {
            console.error('Failed to update task', error);
        }
    };

    const confirmDeleteTask = async () => {
        if (!taskToDelete) return;
        try {
            await api.delete(`/tasks/${taskToDelete}`);
            setTasks(tasks.filter(t => t._id !== taskToDelete));
        } catch (error) {
            console.error('Failed to delete task', error);
        }
        setTaskToDelete(null);
    };

    const handleDeleteClick = (taskId) => {
        setTaskToDelete(taskId);
        setIsDeleteModalOpen(true);
    };

    const openEditModal = (task) => {
        setNewTask({
            title: task.title,
            description: task.description || '',
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
        });
        setEditingTaskId(task._id);
        setIsEditMode(true);
        setIsTaskModalOpen(true);
    };

    const openViewModal = (task) => {
        setViewTask(task);
        setIsViewModalOpen(true);
    };

    const closeModal = () => {
        setIsTaskModalOpen(false);
        setIsEditMode(false);
        setEditingTaskId(null);
        setNewTask(null); // Clear local state used for passing to modal
        setIsViewModalOpen(false);
        setViewTask(null);
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'text-red-600 bg-red-50 ring-red-500/10';
            case 'Medium': return 'text-yellow-600 bg-yellow-50 ring-yellow-500/10';
            case 'Low': return 'text-green-600 bg-green-50 ring-green-500/10';
            default: return 'text-gray-600 bg-gray-50 ring-gray-500/10';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Done': return <CheckSquare className="w-5 h-5 text-indigo-600" />;
            case 'In Progress': return <Clock className="w-5 h-5 text-amber-500" />;
            default: return <Square className="w-5 h-5 text-gray-400" />;
        }
    };

    if (loading) return (
        <Layout>
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        </Layout>
    );

    return (
        <Layout>
            <div className="mb-6">
                <button
                    onClick={() => navigate('/projects')}
                    className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
                >
                    <ArrowLeft size={16} className="mr-1" />
                    Back to Projects
                </button>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{project?.title}</h1>
                        <p className="text-gray-500 mt-1">{project?.description}</p>
                    </div>
                    <button
                        onClick={() => { setIsEditMode(false); setIsTaskModalOpen(true); setNewTask(null); }}
                        className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30"
                    >
                        <Plus size={20} className="mr-2" />
                        Add Task
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {['Todo', 'In Progress', 'Done'].map((status) => (
                    <div key={status} className="bg-gray-50 rounded-2xl p-4 h-full min-h-[500px]">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h2 className="font-semibold text-gray-700 flex items-center gap-2">
                                {status === 'Todo' && <div className="w-2 h-2 rounded-full bg-gray-400" />}
                                {status === 'In Progress' && <div className="w-2 h-2 rounded-full bg-amber-400" />}
                                {status === 'Done' && <div className="w-2 h-2 rounded-full bg-green-400" />}
                                {status}
                                <span className="text-gray-400 text-xs font-normal ml-1">
                                    ({tasks.filter(t => t.status === status).length})
                                </span>
                            </h2>
                        </div>

                        <div className="space-y-3">
                            {tasks.filter(t => t.status === status).map((task) => (
                                <motion.div
                                    key={task._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <h3 className={`font-medium text-gray-900 mb-1 truncate ${task.status === 'Done' ? 'text-gray-500' : ''}`}>
                                                {task.title}
                                            </h3>

                                            {task.description && (
                                                <p className="text-gray-500 text-xs mb-3 line-clamp-2">{task.description}</p>
                                            )}

                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${task.priority === 'High' ? 'bg-red-50 text-red-700 border-red-100' :
                                                    task.priority === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                                        'bg-green-50 text-green-700 border-green-100'
                                                    }`}>
                                                    <Flag size={10} className="mr-1" />
                                                    {task.priority}
                                                </span>
                                                {task.dueDate && (
                                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium text-gray-500 bg-gray-50 border border-gray-200">
                                                        <Calendar size={10} className="mr-1" />
                                                        {new Date(task.dueDate).toLocaleDateString('en-GB')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => openViewModal(task)}
                                                className="text-gray-400 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                                                title="View Details"
                                            >
                                                <Eye size={14} />
                                            </button>
                                            <button
                                                onClick={() => openEditModal(task)}
                                                className="text-gray-400 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                                                title="Edit Task"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(task._id)}
                                                className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                                                title="Delete Task"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {tasks.filter(t => t.status === status).length === 0 && (
                                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
                                    <p className="text-gray-400 text-sm">No tasks</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <TaskModal
                isOpen={isTaskModalOpen}
                onClose={closeModal}
                onSubmit={isEditMode ? handleUpdateTaskData : handleCreateTask}
                initialData={newTask}
                isEditMode={isEditMode}
            />

            <TaskDetailsModal
                isOpen={isViewModalOpen}
                onClose={closeModal}
                task={viewTask}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDeleteTask}
                title="Delete Task"
                message="Are you sure you want to delete this task? This action cannot be undone."
                confirmText="Delete Task"
            />
        </Layout>
    );
};

export default ProjectDetails;
