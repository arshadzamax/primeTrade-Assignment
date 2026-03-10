import { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import { authApi } from "../api";

const AuthContext = createContext(null);

const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
};

function authReducer(state, action) {
    switch (action.type) {
        case "SET_USER":
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                isLoading: false,
            };
        case "LOGOUT":
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
            };
        case "SET_LOADING":
            return { ...state, isLoading: action.payload };
        default:
            return state;
    }
}

export function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Check auth on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                dispatch({ type: "SET_LOADING", payload: false });
                return;
            }

            try {
                const { data } = await authApi.getMe();
                dispatch({ type: "SET_USER", payload: data.data });
            } catch {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                dispatch({ type: "LOGOUT" });
            }
        };

        checkAuth();
    }, []);

    const login = useCallback(async (credentials) => {
        const { data } = await authApi.login(credentials);
        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("refreshToken", data.data.refreshToken);
        dispatch({ type: "SET_USER", payload: data.data.user });
        return data;
    }, []);

    const register = useCallback(async (userData) => {
        const { data } = await authApi.register(userData);
        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("refreshToken", data.data.refreshToken);
        dispatch({ type: "SET_USER", payload: data.data.user });
        return data;
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        dispatch({ type: "LOGOUT" });
    }, []);

    const value = {
        ...state,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
