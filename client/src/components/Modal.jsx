import { HiOutlineX } from "react-icons/hi";

export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-neo-dark/50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative neo-card p-6 w-full max-w-lg shadow-neo-xl animate-pop bg-neo-card">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-extrabold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="neo-btn py-2 px-2 bg-neo-bg"
                    >
                        <HiOutlineX className="w-5 h-5" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}
