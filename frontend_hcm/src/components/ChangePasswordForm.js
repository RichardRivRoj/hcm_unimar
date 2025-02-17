'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/auth'

const ChangePasswordForm = () => {
    const { user, updatePassword } = useAuth()
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null)

    const submitForm = async (e) => {
        e.preventDefault()
        
        await updatePassword({
            current_password: currentPassword,
            password: newPassword,
            password_confirmation: passwordConfirmation,
            setErrors,
            setStatus
        })
    }

    return (
        <div className="max-w-md p-6 mx-auto bg-white rounded-lg shadow-md">
            <h2 className="mb-6 text-2xl font-bold text-gray-800">Cambiar Contraseña</h2>
            
            {/* Mensajes de estado */}
            {status === 'password-updated' && (
                <div className="p-3 mb-4 text-green-700 bg-green-100 rounded">
                    ¡Contraseña actualizada exitosamente!
                </div>
            )}
            
            {errors.length > 0 && (
                <div className="p-3 mb-4 text-red-700 bg-red-100 rounded">
                    {errors.map((error, index) => (
                        <p key={index}>{error}</p>
                    ))}
                </div>
            )}

            <form onSubmit={submitForm} className="space-y-4">
                <div>
                    <label className="block mb-2 text-gray-700">Contraseña actual</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2 text-gray-700">Nueva contraseña</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2 text-gray-700">Confirmar nueva contraseña</label>
                    <input
                        type="password"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full px-4 py-2 text-white transition-colors bg-blue-600 rounded hover:bg-blue-700"
                >
                    Cambiar Contraseña
                </button>
            </form>
        </div>
    )
}

export default ChangePasswordForm;