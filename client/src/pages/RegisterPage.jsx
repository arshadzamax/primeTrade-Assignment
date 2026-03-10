import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Input, Button } from "../components/FormElements";
import toast from "react-hot-toast";
import { HiOutlineLightningBolt } from "react-icons/hi";

export default function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
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
        if (!form.name.trim()) errs.name = "Name is required";
        if (!form.email) errs.email = "Email is required";
        if (!form.password) errs.password = "Password is required";
        else if (form.password.length < 8) errs.password = "Min 8 characters";
        else if (!/[A-Z]/.test(form.password)) errs.password = "Need one uppercase letter";
        else if (!/[0-9]/.test(form.password)) errs.password = "Need one number";
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
            await register(form);
            toast.success("Account created! 🚀");
            navigate("/dashboard");
        } catch (err) {
            const message = err.response?.data?.message || "Registration failed";
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
            <div className="fixed top-20 right-10 w-24 h-24 bg-neo-purple border-3 border-neo-border rounded-full shadow-neo-lg opacity-50 hidden lg:block" />
            <div className="fixed bottom-10 left-20 w-28 h-28 bg-neo-accent border-3 border-neo-border -rotate-12 shadow-neo opacity-40 hidden lg:block" />
            <div className="fixed top-1/2 left-1/6 w-14 h-14 bg-neo-pink border-3 border-neo-border rounded-lg shadow-neo rotate-12 opacity-50 hidden lg:block" />

            <div className="w-full max-w-md animate-pop">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-neo-secondary border-3 border-neo-border rounded-2xl shadow-neo-lg mb-4">
                        <HiOutlineLightningBolt className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight">
                        Create Account
                    </h1>
                    <p className="text-neo-muted font-medium mt-1">
                        Join PrimeTrade and start managing tasks
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="neo-card p-8 space-y-5">
                    <Input
                        label="Full Name"
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={handleChange}
                        error={errors.name}
                        autoFocus
                    />

                    <Input
                        label="Email"
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange}
                        error={errors.email}
                    />

                    <Input
                        label="Password"
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Min 8 chars, 1 uppercase, 1 number"
                        value={form.password}
                        onChange={handleChange}
                        error={errors.password}
                    />

                    <Button
                        type="submit"
                        variant="secondary"
                        loading={loading}
                        className="w-full text-lg py-3.5"
                    >
                        Create Account
                    </Button>
                </form>

                <p className="text-center mt-6 font-medium text-neo-muted">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-neo-secondary font-bold underline decoration-3 underline-offset-4 hover:text-neo-primary transition-colors"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
