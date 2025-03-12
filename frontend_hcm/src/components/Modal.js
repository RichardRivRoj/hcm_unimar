'use client';

export const Modal = ({ isOpen, onClose, children }) => {
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

// Componente Modal Mejorado
export const TrainingModal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-[90%] max-w-4xl p-6 bg-white rounded-lg shadow-xl">
                <div className="flex justify-end mb-4">
                    <button
                        onClick={onClose}
                        className="text-2xl text-gray-600 hover:text-gray-900"
                    >
                        &times;
                    </button>
                </div>
                <div className="max-h-[80vh] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};