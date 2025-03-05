'use client'

import { useState, useEffect } from 'react'
import { useUpdateEmployeeRequest } from '@/hooks/employee/useEmployeeRequests'

const EditRequestForm = ({ request, onSuccess, onCancel }) => {
    const [description, setDescription] = useState('')
    
    const { updateRequest, loading, error } = useUpdateEmployeeRequest()

    // Cargar datos cuando el componente se monta
    useEffect(() => {
        if (request?.description) {
            try {
                const parsed = JSON.parse(request.description)
                // Compatibilidad con diferentes formatos
                setDescription(parsed.content || parsed.descripcion || '')
            } catch (error) {
                console.error('Error parsing description:', error)
                setDescription(request.description) // Fallback a texto plano
            }
        }
    }, [request])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            // Asegurar formato JSON válido
            const jsonData = JSON.stringify({ content: description })
            await updateRequest(request.id, jsonData)
            onSuccess?.()
        } catch (error) {
            console.error('Error actualizando:', error)
        }
    }


    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-lg font-medium">Editar Solicitud</h3>
            
            {error && (
                <div className="p-3 text-red-700 bg-red-100 rounded-lg">
                    {error.message}
                </div>
            )}

            <div>
                <label className="block mb-2 font-medium">Descripción</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    rows="4"
                    maxLength="500"
                    required
                    disabled={loading}
                />
                <span className="text-sm text-gray-500">
                    {description.length}/500 caracteres
                </span>
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                    Cancelar
                </button>
                
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>
        </form>
    )
}

export default EditRequestForm