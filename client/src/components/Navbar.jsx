import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HiOutlineLogout, HiOutlineViewGrid, HiOutlineUsers, HiOutlineLightningBolt } from "react-icons/hi";

export default function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="neo-card rounded-none border-x-0 border-t-0 sticky top-0 z-50 bg-neo-card">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-neo-primary border-3 border-neo-border rounded-lg shadow-neo-sm flex items-center justify-center group-hover:shadow-neo-hover group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-all">
                            <HiOutlineLightningBolt className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-extrabold tracking-tight hidden sm:block">
                            Prime<span className="text-neo-primary">Trade</span>
                        </span>
                    </Link>

                    {/* Navigation */}
                    {isAuthenticated && (
                        <div className="flex items-center gap-3">
                            <Link
                                to="/dashboard"
                                className={`neo-btn text-sm py-2 px-4 ${isActive("/dashboard")
                                        ? "bg-neo-primary text-white"
                                        : "bg-neo-card text-neo-text hover:bg-neo-accent"
                                    }`}
                            >
                                <HiOutlineViewGrid className="w-4 h-4" />
                                <span className="hidden sm:inline">Dashboard</span>
                            </Link>

                            {user?.role === "admin" && (
                                <Link
                                    to="/admin"
                                    className={`neo-btn text-sm py-2 px-4 ${isActive("/admin")
                                            ? "bg-neo-purple text-white"
                                            : "bg-neo-card text-neo-text hover:bg-neo-purple/20"
                                        }`}
                                >
                                    <HiOutlineUsers className="w-4 h-4" />
                                    <span className="hidden sm:inline">Admin</span>
                                </Link>
                            )}

                            {/* User badge */}
                            <div className="neo-badge bg-neo-accent text-neo-text ml-2">
                                {user?.role === "admin" ? "👑" : "👤"} {user?.name?.split(" ")[0]}
                            </div>

                            <button
                                onClick={handleLogout}
                                className="neo-btn text-sm py-2 px-4 bg-neo-danger text-white hover:bg-neo-danger/90"
                            >
                                <HiOutlineLogout className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
