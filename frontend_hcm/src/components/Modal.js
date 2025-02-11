'use client';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-lg p-6 bg-white rounded-lg">
                <button
                    onClick={onClose}
                    className="float-right text-gray-600 hover:text-gray-900"
                >
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;