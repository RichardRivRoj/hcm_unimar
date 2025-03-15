'use client'

import Loader from "@/components/Loader"
import { useState } from "react"


const CalificationForm = ({ enrollment, onSuccess, updateEnrollment }) => {
    const [formData, setFormData] = useState({
        score: enrollment.score || '',
        attended: '',
        total: ''
    })
    
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const calculateAttendance = () => {
        if (!formData.attended || !formData.total) return 0
        return Math.round((formData.attended / formData.total) * 100)
    }

    const validateForm = () => {
        const newErrors = {}
        
        if (formData.score < 0 || formData.score > 100) {
            newErrors.score = 'El puntaje debe estar entre 0 y 100'
        }
        
        if (formData.attended < 0 || formData.total <= 0) {
            newErrors.attendance = 'Los valores de asistencia deben ser positivos'
        }
        
        if (formData.attended > formData.total) {
            newErrors.attendance = 'Las asistencias no pueden superar el total de sesiones'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        setLoading(true)
        try {
            const attendanceRate = calculateAttendance()
            
            const result = await updateEnrollment(
                formData.score,
                attendanceRate
            )
            
            if (result.success) {
                onSuccess()
            } else {
                setErrors({ submit: result.error })
            }
        } catch (error) {
            setErrors({ submit: 'Error al procesar la solicitud' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <form id="calification-form" onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                    Puntaje Final (0-100 puntos)
                    <span className="text-red-600">*</span>
                </label>
                <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    className={`block w-full p-2 border rounded ${
                        errors.score ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={formData.score}
                    onChange={(e) => setFormData({...formData, score: e.target.value})}
                />
                {errors.score && (
                    <p className="mt-1 text-sm text-red-600">{errors.score}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                    Ingrese el puntaje obtenido en la evaluación final
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Sesiones Asistidas
                        <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="number"
                        min="0"
                        required
                        className={`block w-full p-2 border rounded ${
                            errors.attendance ? 'border-red-500' : 'border-gray-300'
                        }`}
                        value={formData.attended}
                        onChange={(e) => setFormData({...formData, attended: parseInt(e.target.value)})}
                    />
                </div>
                
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Total de Sesiones
                        <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="number"
                        min="1"
                        required
                        className={`block w-full p-2 border rounded ${
                            errors.attendance ? 'border-red-500' : 'border-gray-300'
                        }`}
                        value={formData.total}
                        onChange={(e) => setFormData({...formData, total: parseInt(e.target.value)})}
                    />
                </div>
                
                {errors.attendance && (
                    <p className="col-span-2 mt-1 text-sm text-red-600">
                        {errors.attendance}
                    </p>
                )}
                
                <div className="col-span-2">
                    <p className="text-sm font-medium">
                        Tasa de Asistencia Calculada: 
                        <span className="ml-2 text-[#004b9a]">
                            {calculateAttendance()}%
                        </span>
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                        Calculado automáticamente en base a las sesiones ingresadas
                    </p>
                </div>
            </div>

            {errors.submit && (
                <p className="mt-4 text-sm text-red-600">{errors.submit}</p>
            )}

            {loading && (
                <div className="flex items-center justify-center p-4">
                    <Loader className="h-8 w-8 text-[#004b9a]" />
                </div>
            )}
        </form>
    )
}

export default CalificationForm;