import { useState, useEffect, useCallback } from "react";
import { userApi, taskApi } from "../api";
import { Button } from "../components/FormElements";
import Modal from "../components/Modal";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import {
    HiOutlineTrash,
    HiOutlineExclamation,
    HiOutlineUserGroup,
    HiOutlineClipboardList,
    HiOutlineChevronLeft,
    HiOutlineChevronRight,
    HiOutlineShieldCheck,
} from "react-icons/hi";

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState("users");
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [userMeta, setUserMeta] = useState({});
    const [taskMeta, setTaskMeta] = useState({});
    const [loading, setLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [userPage, setUserPage] = useState(1);
    const [taskPage, setTaskPage] = useState(1);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await userApi.list({ page: userPage, limit: 10 });
            setUsers(data.data);
            setUserMeta(data.meta);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to load users");
        } finally {
            setLoading(false);
        }
    }, [userPage]);

    const fetchAllTasks = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await taskApi.listAll({ page: taskPage, limit: 10 });
            setTasks(data.data);
            setTaskMeta(data.meta);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to load tasks");
        } finally {
            setLoading(false);
        }
    }, [taskPage]);

    useEffect(() => {
        if (activeTab === "users") fetchUsers();
        else fetchAllTasks();
    }, [activeTab, fetchUsers, fetchAllTasks]);

    const handleDeleteUser = async (id) => {
        try {
            await userApi.delete(id);
            toast.success("User deleted! 🗑️");
            setDeleteTarget(null);
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || "Delete failed");
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            await taskApi.delete(id);
            toast.success("Task deleted! 🗑️");
            setDeleteTarget(null);
            fetchAllTasks();
        } catch (err) {
            toast.error(err.response?.data?.message || "Delete failed");
        }
    };

    return (
        <div className="min-h-screen bg-neo-bg">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8 animate-slide-in">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-neo-purple border-3 border-neo-border rounded-lg shadow-neo-sm flex items-center justify-center">
                            <HiOutlineShieldCheck className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight">
                            Admin Panel
                        </h1>
                    </div>
                    <p className="text-neo-muted font-medium">
                        Manage users and oversee all tasks in the system
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-3 mb-6">
                    <button
                        onClick={() => setActiveTab("users")}
                        className={`neo-btn ${activeTab === "users"
                                ? "bg-neo-purple text-white"
                                : "bg-neo-card text-neo-text"
                            }`}
                    >
                        <HiOutlineUserGroup className="w-5 h-5" />
                        Users
                        {userMeta.total > 0 && (
                            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                                {userMeta.total}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab("tasks")}
                        className={`neo-btn ${activeTab === "tasks"
                                ? "bg-neo-secondary text-white"
                                : "bg-neo-card text-neo-text"
                            }`}
                    >
                        <HiOutlineClipboardList className="w-5 h-5" />
                        All Tasks
                        {taskMeta.total > 0 && (
                            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                                {taskMeta.total}
                            </span>
                        )}
                    </button>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="neo-card p-16 flex items-center justify-center">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 border-4 border-neo-purple border-t-transparent rounded-full animate-spin" />
                            <span className="text-lg font-bold">Loading...</span>
                        </div>
                    </div>
                ) : activeTab === "users" ? (
                    <div className="space-y-3">
                        {users.length === 0 ? (
                            <div className="neo-card p-16 text-center">
                                <div className="text-5xl mb-4">👥</div>
                                <h3 className="text-xl font-extrabold">No users found</h3>
                            </div>
                        ) : (
                            <>
                                {/* Table Header */}
                                <div className="neo-card p-4 bg-neo-dark text-white hidden md:grid grid-cols-5 gap-4 font-bold uppercase text-sm tracking-wider">
                                    <span>Name</span>
                                    <span>Email</span>
                                    <span>Role</span>
                                    <span>Joined</span>
                                    <span className="text-right">Actions</span>
                                </div>

                                {users.map((u, i) => (
                                    <div
                                        key={u._id}
                                        className="neo-card neo-card-hover p-4 grid grid-cols-1 md:grid-cols-5 gap-4 items-center animate-slide-up"
                                        style={{ animationDelay: `${i * 0.05}s` }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg border-3 border-neo-border shadow-neo-sm flex items-center justify-center font-extrabold text-white ${u.role === 'admin' ? 'bg-neo-purple' : 'bg-neo-primary'}`}>
                                                {u.name[0].toUpperCase()}
                                            </div>
                                            <span className="font-bold">{u.name}</span>
                                        </div>
                                        <span className="text-neo-muted font-medium text-sm truncate">{u.email}</span>
                                        <span>
                                            <span className={`neo-badge ${u.role === 'admin' ? 'bg-neo-purple text-white' : 'bg-neo-bg text-neo-text'}`}>
                                                {u.role === 'admin' ? '👑 Admin' : '👤 User'}
                                            </span>
                                        </span>
                                        <span className="text-sm text-neo-muted font-medium">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </span>
                                        <div className="md:text-right">
                                            <Button
                                                variant="danger"
                                                className="py-2 px-3 text-sm"
                                                onClick={() => setDeleteTarget({ type: "user", id: u._id, name: u.name })}
                                            >
                                                <HiOutlineTrash className="w-4 h-4" />
                                                <span className="md:hidden">Delete</span>
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                                {/* Pagination */}
                                {userMeta.totalPages > 1 && (
                                    <div className="flex items-center justify-between neo-card p-4 mt-4">
                                        <span className="text-sm font-bold text-neo-muted">
                                            Page {userMeta.page} of {userMeta.totalPages}
                                        </span>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                className="py-2 px-3"
                                                disabled={userPage <= 1}
                                                onClick={() => setUserPage((p) => p - 1)}
                                            >
                                                <HiOutlineChevronLeft className="w-5 h-5" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="py-2 px-3"
                                                disabled={userPage >= userMeta.totalPages}
                                                onClick={() => setUserPage((p) => p + 1)}
                                            >
                                                <HiOutlineChevronRight className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {tasks.length === 0 ? (
                            <div className="neo-card p-16 text-center">
                                <div className="text-5xl mb-4">📋</div>
                                <h3 className="text-xl font-extrabold">No tasks in the system</h3>
                            </div>
                        ) : (
                            <>
                                {tasks.map((task, i) => (
                                    <div
                                        key={task._id}
                                        className="neo-card neo-card-hover p-5 animate-slide-up"
                                        style={{ animationDelay: `${i * 0.05}s` }}
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1 flex-wrap">
                                                    <h3 className="font-extrabold">{task.title}</h3>
                                                    <span className={`neo-badge ${task.status === 'done' ? 'bg-neo-success text-white' :
                                                            task.status === 'in_progress' ? 'bg-neo-info text-white' :
                                                                'bg-neo-warning text-white'
                                                        }`}>
                                                        {task.status.replace("_", " ")}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-neo-muted font-medium">
                                                    <span>by {task.owner?.name || "Unknown"}</span>
                                                    <span>•</span>
                                                    <span>{task.priority} priority</span>
                                                    <span>•</span>
                                                    <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <Button
                                                variant="danger"
                                                className="py-2 px-3 text-sm"
                                                onClick={() => setDeleteTarget({ type: "task", id: task._id, name: task.title })}
                                            >
                                                <HiOutlineTrash className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                                {taskMeta.totalPages > 1 && (
                                    <div className="flex items-center justify-between neo-card p-4 mt-4">
                                        <span className="text-sm font-bold text-neo-muted">
                                            Page {taskMeta.page} of {taskMeta.totalPages}
                                        </span>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                className="py-2 px-3"
                                                disabled={taskPage <= 1}
                                                onClick={() => setTaskPage((p) => p - 1)}
                                            >
                                                <HiOutlineChevronLeft className="w-5 h-5" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="py-2 px-3"
                                                disabled={taskPage >= taskMeta.totalPages}
                                                onClick={() => setTaskPage((p) => p + 1)}
                                            >
                                                <HiOutlineChevronRight className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </main>

            {/* Delete Confirmation */}
            <Modal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                title={`Delete ${deleteTarget?.type === "user" ? "User" : "Task"}`}
            >
                <div className="text-center py-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-neo-danger/10 border-3 border-neo-danger rounded-full mb-4">
                        <HiOutlineExclamation className="w-8 h-8 text-neo-danger" />
                    </div>
                    <p className="text-lg font-bold mb-2">
                        Delete &ldquo;{deleteTarget?.name}&rdquo;?
                    </p>
                    <p className="text-neo-muted font-medium mb-6">
                        {deleteTarget?.type === "user"
                            ? "This will also delete all their tasks."
                            : "This action cannot be undone."}
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Button
                            variant="danger"
                            onClick={() =>
                                deleteTarget?.type === "user"
                                    ? handleDeleteUser(deleteTarget.id)
                                    : handleDeleteTask(deleteTarget.id)
                            }
                        >
                            Yes, Delete
                        </Button>
                        <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
