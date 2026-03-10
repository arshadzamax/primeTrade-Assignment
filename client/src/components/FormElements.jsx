import { useState } from "react";
import { HiOutlineEye, HiOutlineEyeOff, HiOutlineChevronDown } from "react-icons/hi";

export function Input({ label, error, type = "text", id, ...props }) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    return (
        <div className="space-y-1.5">
            {label && (
                <label htmlFor={id} className="block text-sm font-bold uppercase tracking-wider text-neo-text">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    id={id}
                    type={isPassword && showPassword ? "text" : type}
                    className={`neo-input ${error ? "border-neo-danger shadow-[2px_2px_0px_var(--color-neo-danger)]" : ""} ${isPassword ? "pr-12" : ""}`}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neo-muted hover:text-neo-text transition-colors"
                    >
                        {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                    </button>
                )}
            </div>
            {error && (
                <p className="text-sm font-bold text-neo-danger animate-shake">{error}</p>
            )}
        </div>
    );
}

export function Select({ label, error, id, children, ...props }) {
    return (
        <div className="space-y-1.5">
            {label && (
                <label htmlFor={id} className="block text-sm font-bold uppercase tracking-wider text-neo-text">
                    {label}
                </label>
            )}
            <div className="relative">
                <select id={id} className={`neo-select ${error ? "border-neo-danger" : ""}`} {...props}>
                    {children}
                </select>
                <HiOutlineChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neo-muted pointer-events-none" />
            </div>
            {error && (
                <p className="text-sm font-bold text-neo-danger animate-shake">{error}</p>
            )}
        </div>
    );
}

export function Button({ children, variant = "primary", loading = false, className = "", ...props }) {
    const variants = {
        primary: "bg-neo-primary text-white",
        secondary: "bg-neo-secondary text-white",
        accent: "bg-neo-accent text-neo-text",
        danger: "bg-neo-danger text-white",
        success: "bg-neo-success text-white",
        ghost: "bg-transparent border-transparent shadow-none hover:bg-neo-bg hover:border-neo-border hover:shadow-neo-sm",
        outline: "bg-neo-card text-neo-text",
    };

    return (
        <button
            className={`neo-btn ${variants[variant] || variants.primary} ${className}`}
            disabled={loading || props.disabled}
            {...props}
        >
            {loading && (
                <div className="w-5 h-5 border-3 border-current border-t-transparent rounded-full animate-spin" />
            )}
            {children}
        </button>
    );
}

export function TextArea({ label, error, id, ...props }) {
    return (
        <div className="space-y-1.5">
            {label && (
                <label htmlFor={id} className="block text-sm font-bold uppercase tracking-wider text-neo-text">
                    {label}
                </label>
            )}
            <textarea
                id={id}
                className={`neo-input resize-none ${error ? "border-neo-danger shadow-[2px_2px_0px_var(--color-neo-danger)]" : ""}`}
                rows={4}
                {...props}
            />
            {error && (
                <p className="text-sm font-bold text-neo-danger animate-shake">{error}</p>
            )}
        </div>
    );
}
