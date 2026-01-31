import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Flag, CheckSquare, Folder, Clock } from 'lucide-react';

const TaskDetailsModal = ({ isOpen, onClose, task }) => {
    if (!task) return null;

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'text-red-700 bg-red-50 ring-red-600/10';
            case 'Medium': return 'text-yellow-700 bg-yellow-50 ring-yellow-600/10';
            case 'Low': return 'text-green-700 bg-green-50 ring-green-600/10';
            default: return 'text-gray-700 bg-gray-50 ring-gray-600/10';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Done': return 'text-green-700 bg-green-50 ring-green-600/10';
            case 'In Progress': return 'text-amber-700 bg-amber-50 ring-amber-600/10';
            case 'Todo': return 'text-gray-700 bg-gray-50 ring-gray-600/10';
            default: return 'text-gray-700 bg-gray-50 ring-gray-600/10';
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden pointer-events-auto max-h-[90vh] flex flex-col">
                            <div className="p-6 border-b border-gray-100 flex items-start justify-between bg-gray-50/50">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 leading-snug">{task.title}</h2>
                                    {task.project && (
                                        <div className="flex items-center text-indigo-600 text-sm mt-1 font-medium">
                                            <Folder size={14} className="mr-1.5" />
                                            {task.project.title}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100 flex-shrink-0 ml-4"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto custom-scrollbar">
                                <div className="flex flex-wrap gap-3 mb-6">
                                    <div className={`px-2.5 py-1 rounded-lg text-xs font-medium ring-1 ring-inset inline-flex items-center ${getStatusColor(task.status)}`}>
                                        {task.status === 'Done' ? <CheckSquare size={14} className="mr-1.5" /> : task.status === 'In Progress' ? <Clock size={14} className="mr-1.5" /> : <div className="w-3.5 h-3.5 border-2 border-current rounded-sm mr-1.5 mb-[1px]" />}
                                        {task.status}
                                    </div>
                                    <div className={`px-2.5 py-1 rounded-lg text-xs font-medium ring-1 ring-inset inline-flex items-center ${getPriorityColor(task.priority)}`}>
                                        <Flag size={14} className="mr-1.5" />
                                        {task.priority} Priority
                                    </div>
                                    {task.dueDate && (
                                        <div className="px-2.5 py-1 rounded-lg text-xs font-medium text-gray-600 bg-gray-50 ring-1 ring-inset ring-gray-500/10 inline-flex items-center">
                                            <Calendar size={14} className="mr-1.5" />
                                            Due {new Date(task.dueDate).toLocaleDateString('en-GB')}
                                        </div>
                                    )}
                                </div>

                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 min-h-[120px]">
                                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</h3>
                                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                        {task.description || <span className="text-gray-400 italic">No description provided.</span>}
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 border-t border-gray-100 bg-gray-50 text-center text-xs text-gray-400">
                                Created on {new Date(task.createdAt).toLocaleDateString('en-GB')}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default TaskDetailsModal;
