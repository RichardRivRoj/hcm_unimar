'use client'

import { useEffect } from 'react'

export const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-lg p-6 bg-white rounded-lg">
                <button
                    onClick={onClose}
                    className="float-right text-gray-600 hover:text-gray-900">
                    &times;
                </button>
                {children}
            </div>
        </div>
    )
}


export const GeneralModal = ({
    isOpen,
    onClose,
    title,
    children,
    actions,
    size = 'md',
}) => {
    if (!isOpen) return null
    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        p2xl: 'max-w-2xl',
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
            <div className={`w-full ${sizes[size]} p-6 bg-white rounded-lg `}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700">
                        &times;
                    </button>
                </div>
                <div className="mb-4">{children}</div>
                <div className="flex justify-end gap-2">{actions}</div>
            </div>
        </div>
    )
}

export const DeleteModal = ({ isOpen, onClose, title, children, actions }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md p-6 bg-white rounded-lg">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700">
                        &times;
                    </button>
                </div>
                <div className="mb-4">{children}</div>
                <div className="flex justify-end gap-2">{actions}</div>
            </div>
        </div>
    )
}

// Componente Modal Mejorado
export const TrainingModal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-[90%] max-w-4xl p-6 bg-white rounded-lg shadow-xl">
                <div className="flex justify-end mb-4">
                    <button
                        onClick={onClose}
                        className="text-2xl text-gray-600 hover:text-gray-900">
                        &times;
                    </button>
                </div>
                <div className="max-h-[80vh] overflow-y-auto">{children}</div>
            </div>
        </div>
    )
}
