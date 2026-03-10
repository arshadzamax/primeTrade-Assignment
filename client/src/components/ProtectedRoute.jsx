import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
    const { isAuthenticated, isLoading, user } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neo-bg">
                <div className="neo-card p-8 animate-pop">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-4 border-neo-primary border-t-transparent rounded-full animate-spin" />
                        <span className="text-lg font-bold">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && user?.role !== "admin") {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
