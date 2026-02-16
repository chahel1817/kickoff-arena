export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
            <div className="glass p-8 rounded-3xl w-full max-w-lg relative animate-in fade-in zoom-in duration-300">
                <h2 className="text-2xl font-bold mb-6">{title}</h2>
                {children}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-muted hover:text-white transition-colors"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}
