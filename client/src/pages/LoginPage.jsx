import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Input, Button } from "../components/FormElements";
import toast from "react-hot-toast";
import { HiOutlineLightningBolt, HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: "" });
        }
    };

    const validate = () => {
        const errs = {};
        if (!form.email) errs.email = "Email is required";
        if (!form.password) errs.password = "Password is required";
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) {
            setErrors(errs);
            return;
        }

        setLoading(true);
        try {
            await login(form);
            toast.success("Welcome back! 🎉");
            navigate("/dashboard");
        } catch (err) {
            const message = err.response?.data?.message || "Login failed";
            toast.error(message);
            if (err.response?.data?.errors) {
                const fieldErrors = {};
                err.response.data.errors.forEach((e) => {
                    if (e.field) fieldErrors[e.field] = e.message;
                });
                setErrors(fieldErrors);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neo-bg flex items-center justify-center p-4">
            {/* Decorative elements */}
            <div className="fixed top-10 left-10 w-20 h-20 bg-neo-accent border-3 border-neo-border rounded-full shadow-neo opacity-60 hidden lg:block" />
            <div className="fixed bottom-20 right-20 w-32 h-32 bg-neo-primary border-3 border-neo-border rotate-12 shadow-neo-lg opacity-40 hidden lg:block" />
            <div className="fixed top-1/3 right-1/4 w-16 h-16 bg-neo-success border-3 border-neo-border rounded-lg shadow-neo rotate-45 opacity-50 hidden lg:block" />

            <div className="w-full max-w-md animate-pop">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-neo-primary border-3 border-neo-border rounded-2xl shadow-neo-lg mb-4">
                        <HiOutlineLightningBolt className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight">
                        Welcome Back
                    </h1>
                    <p className="text-neo-muted font-medium mt-1">
                        Sign in to your PrimeTrade account
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="neo-card p-8 space-y-5">
                    <Input
                        label="Email"
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange}
                        error={errors.email}
                        autoFocus
                    />

                    <Input
                        label="Password"
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        value={form.password}
                        onChange={handleChange}
                        error={errors.password}
                    />

                    <Button
                        type="submit"
                        loading={loading}
                        className="w-full text-lg py-3.5"
                    >
                        Sign In
                    </Button>
                </form>

                <p className="text-center mt-6 font-medium text-neo-muted">
                    Don&apos;t have an account?{" "}
                    <Link
                        to="/register"
                        className="text-neo-primary font-bold underline decoration-3 underline-offset-4 hover:text-neo-secondary transition-colors"
                    >
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
}
