import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { taskApi } from "../api";
import { Input, Button, Select, TextArea } from "../components/FormElements";
import Modal from "../components/Modal";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import {
    HiOutlinePlus,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineSearch,
    HiOutlineClock,
    HiOutlineChevronLeft,
    HiOutlineChevronRight,
    HiOutlineRefresh,
    HiOutlineExclamation,
    HiOutlineClipboardList,
} from "react-icons/hi";

const STATUS_CONFIG = {
    todo: { label: "To Do", color: "bg-neo-warning", emoji: "📋" },
    in_progress: { label: "In Progress", color: "bg-neo-info", emoji: "⚡" },
    done: { label: "Done", color: "bg-neo-success", emoji: "✅" },
};

const PRIORITY_CONFIG = {
    low: { label: "Low", color: "bg-neo-success/20 text-neo-success" },
    medium: { label: "Medium", color: "bg-neo-warning/20 text-neo-warning" },
    high: { label: "High", color: "bg-neo-danger/20 text-neo-danger" },
};

const EMPTY_TASK = {
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
};

export default function DashboardPage() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [form, setForm] = useState(EMPTY_TASK);
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    // Filters
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        status: "",
        priority: "",
        sortBy: "createdAt",
        order: "desc",
        search: "",
    });

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try {
            const params = { ...filters };
            Object.keys(params).forEach((key) => {
                if (!params[key]) delete params[key];
            });

            const { data } = await taskApi.list(params);
            setTasks(data.data);
            setMeta(data.meta);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to load tasks");
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
    };

    const openCreateModal = () => {
        setEditingTask(null);
        setForm(EMPTY_TASK);
        setFormErrors({});
        setModalOpen(true);
    };

    const openEditModal = (task) => {
        setEditingTask(task);
        setForm({
            title: task.title,
            description: task.description || "",
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
        });
        setFormErrors({});
        setModalOpen(true);
    };

    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (formErrors[e.target.name]) {
            setFormErrors({ ...formErrors, [e.target.name]: "" });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) {
            setFormErrors({ title: "Title is required" });
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                ...form,
                dueDate: form.dueDate || undefined,
            };

            if (editingTask) {
                await taskApi.update(editingTask._id, payload);
                toast.success("Task updated! ✏️");
            } else {
                await taskApi.create(payload);
                toast.success("Task created! 🎉");
            }

            setModalOpen(false);
            fetchTasks();
        } catch (err) {
            toast.error(err.response?.data?.message || "Operation failed");
            if (err.response?.data?.errors) {
                const fieldErrors = {};
                err.response.data.errors.forEach((e) => {
                    if (e.field) fieldErrors[e.field] = e.message;
                });
                setFormErrors(fieldErrors);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await taskApi.delete(id);
            toast.success("Task deleted! 🗑️");
            setDeleteId(null);
            fetchTasks();
        } catch (err) {
            toast.error(err.response?.data?.message || "Delete failed");
        }
    };

    const stats = {
        total: meta.total || 0,
        todo: tasks.filter((t) => t.status === "todo").length,
        inProgress: tasks.filter((t) => t.status === "in_progress").length,
        done: tasks.filter((t) => t.status === "done").length,
    };

    return (
        <div className="min-h-screen bg-neo-bg">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                    <div className="animate-slide-in">
                        <h1 className="text-3xl font-extrabold tracking-tight">
                            Hey, {user?.name?.split(" ")[0]}! 👋
                        </h1>
                        <p className="text-neo-muted font-medium mt-1">
                            Here&apos;s what&apos;s on your plate today
                        </p>
                    </div>

                    <Button onClick={openCreateModal} className="animate-pop">
                        <HiOutlinePlus className="w-5 h-5" />
                        New Task
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "Total Tasks", value: stats.total, color: "bg-neo-accent", icon: "📊" },
                        { label: "To Do", value: stats.todo, color: "bg-neo-warning", icon: "📋" },
                        { label: "In Progress", value: stats.inProgress, color: "bg-neo-info", icon: "⚡" },
                        { label: "Done", value: stats.done, color: "bg-neo-success", icon: "✅" },
                    ].map((stat, i) => (
                        <div
                            key={stat.label}
                            className={`neo-card p-4 ${stat.color} animate-slide-up`}
                            style={{ animationDelay: `${i * 0.08}s` }}
                        >
                            <div className="text-3xl mb-1">{stat.icon}</div>
                            <p className="text-2xl font-extrabold">{stat.value}</p>
                            <p className="text-sm font-bold uppercase tracking-wider opacity-80">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="neo-card p-4 mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                        <div className="relative lg:col-span-2">
                            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neo-muted" />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                className="neo-input pl-10"
                                value={filters.search}
                                onChange={(e) => handleFilterChange("search", e.target.value)}
                            />
                        </div>

                        <Select
                            value={filters.status}
                            onChange={(e) => handleFilterChange("status", e.target.value)}
                        >
                            <option value="">All Status</option>
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="done">Done</option>
                        </Select>

                        <Select
                            value={filters.priority}
                            onChange={(e) => handleFilterChange("priority", e.target.value)}
                        >
                            <option value="">All Priority</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </Select>

                        <Button
                            variant="outline"
                            onClick={() => {
                                setFilters({
                                    page: 1,
                                    limit: 10,
                                    status: "",
                                    priority: "",
                                    sortBy: "createdAt",
                                    order: "desc",
                                    search: "",
                                });
                            }}
                            className="w-full"
                        >
                            <HiOutlineRefresh className="w-4 h-4" />
                            Reset
                        </Button>
                    </div>
                </div>

                {/* Task List */}
                {loading ? (
                    <div className="neo-card p-16 flex items-center justify-center">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 border-4 border-neo-primary border-t-transparent rounded-full animate-spin" />
                            <span className="text-lg font-bold">Loading tasks...</span>
                        </div>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="neo-card p-16 text-center animate-pop">
                        <div className="text-6xl mb-4">📭</div>
                        <h3 className="text-xl font-extrabold mb-2">No tasks found</h3>
                        <p className="text-neo-muted font-medium mb-6">
                            {filters.search || filters.status || filters.priority
                                ? "Try adjusting your filters"
                                : "Create your first task to get started!"}
                        </p>
                        {!filters.search && !filters.status && !filters.priority && (
                            <Button onClick={openCreateModal}>
                                <HiOutlinePlus className="w-5 h-5" />
                                Create Task
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {tasks.map((task, i) => (
                            <div
                                key={task._id}
                                className="neo-card neo-card-hover p-5 animate-slide-up"
                                style={{ animationDelay: `${i * 0.05}s` }}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                                            <span className="text-lg">{STATUS_CONFIG[task.status]?.emoji}</span>
                                            <h3 className="text-lg font-extrabold truncate">{task.title}</h3>
                                            <span
                                                className={`neo-badge ${STATUS_CONFIG[task.status]?.color} text-white`}
                                            >
                                                {STATUS_CONFIG[task.status]?.label}
                                            </span>
                                            <span
                                                className={`neo-badge ${PRIORITY_CONFIG[task.priority]?.color}`}
                                            >
                                                {PRIORITY_CONFIG[task.priority]?.label}
                                            </span>
                                        </div>

                                        {task.description && (
                                            <p className="text-neo-muted font-medium text-sm mb-2 line-clamp-2">
                                                {task.description}
                                            </p>
                                        )}

                                        <div className="flex items-center gap-4 text-xs text-neo-muted font-medium">
                                            {task.dueDate && (
                                                <span className="flex items-center gap-1">
                                                    <HiOutlineClock className="w-3.5 h-3.5" />
                                                    Due: {new Date(task.dueDate).toLocaleDateString()}
                                                </span>
                                            )}
                                            <span>
                                                Created: {new Date(task.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <Button
                                            variant="accent"
                                            className="py-2 px-3 text-sm"
                                            onClick={() => openEditModal(task)}
                                        >
                                            <HiOutlinePencil className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="danger"
                                            className="py-2 px-3 text-sm"
                                            onClick={() => setDeleteId(task._id)}
                                        >
                                            <HiOutlineTrash className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Pagination */}
                        {meta.totalPages > 1 && (
                            <div className="flex items-center justify-between neo-card p-4 mt-6">
                                <p className="text-sm font-bold text-neo-muted">
                                    Page {meta.page} of {meta.totalPages} ({meta.total} tasks)
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        className="py-2 px-3"
                                        disabled={meta.page <= 1}
                                        onClick={() =>
                                            setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
                                        }
                                    >
                                        <HiOutlineChevronLeft className="w-5 h-5" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="py-2 px-3"
                                        disabled={meta.page >= meta.totalPages}
                                        onClick={() =>
                                            setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
                                        }
                                    >
                                        <HiOutlineChevronRight className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editingTask ? "Edit Task" : "New Task"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Title"
                        id="task-title"
                        name="title"
                        placeholder="What needs to be done?"
                        value={form.title}
                        onChange={handleFormChange}
                        error={formErrors.title}
                        autoFocus
                    />

                    <TextArea
                        label="Description"
                        id="task-desc"
                        name="description"
                        placeholder="Add details..."
                        value={form.description}
                        onChange={handleFormChange}
                        error={formErrors.description}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Status"
                            id="task-status"
                            name="status"
                            value={form.status}
                            onChange={handleFormChange}
                        >
                            <option value="todo">📋 To Do</option>
                            <option value="in_progress">⚡ In Progress</option>
                            <option value="done">✅ Done</option>
                        </Select>

                        <Select
                            label="Priority"
                            id="task-priority"
                            name="priority"
                            value={form.priority}
                            onChange={handleFormChange}
                        >
                            <option value="low">🟢 Low</option>
                            <option value="medium">🟡 Medium</option>
                            <option value="high">🔴 High</option>
                        </Select>
                    </div>

                    <Input
                        label="Due Date"
                        id="task-due"
                        name="dueDate"
                        type="date"
                        value={form.dueDate}
                        onChange={handleFormChange}
                    />

                    <div className="flex gap-3 pt-2">
                        <Button
                            type="submit"
                            loading={submitting}
                            className="flex-1"
                            variant={editingTask ? "accent" : "primary"}
                        >
                            {editingTask ? "Update Task" : "Create Task"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setModalOpen(false)}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                title="Delete Task"
            >
                <div className="text-center py-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-neo-danger/10 border-3 border-neo-danger rounded-full mb-4">
                        <HiOutlineExclamation className="w-8 h-8 text-neo-danger" />
                    </div>
                    <p className="text-lg font-bold mb-2">Are you sure?</p>
                    <p className="text-neo-muted font-medium mb-6">
                        This action cannot be undone.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Button
                            variant="danger"
                            onClick={() => handleDelete(deleteId)}
                        >
                            Yes, Delete
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteId(null)}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
