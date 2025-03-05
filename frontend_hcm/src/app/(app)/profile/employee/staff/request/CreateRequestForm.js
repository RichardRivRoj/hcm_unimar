'use client'

import { useState, useEffect } from 'react'
import axios from '@/lib/axios'
import { useCreateEmployeeRequest } from '@/hooks/employee/useEmployeeRequests'

const CreateRequestForm = ({ onSuccess, onCancel }) => {
    const [requestTypes, setRequestTypes] = useState([])
    const [formData, setFormData] = useState({
        request_type_id: '',
        description: '',
    })

    const { createRequest, loading, error } = useCreateEmployeeRequest()

    // Obtener tipos de solicitud al montar el componente
    useEffect(() => {
        const fetchRequestTypes = async () => {
            try {
                const response = await axios.get('/api/list-requests', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                })
                setRequestTypes(response.data)
            } catch (err) {
                console.error('Error fetching request types:', err)
            }
        }

        fetchRequestTypes()
    }, [])

    const handleSubmit = async e => {
        e.preventDefault()
        // Convertir el campo 'description' a JSON
        const preparedData = {
            ...formData,
            description: JSON.stringify({ content: formData.description }),
        }
        try {
            await createRequest(preparedData)
            onSuccess?.()
            window.location.reload()
        } catch (error) {
            console.error('Error creando solicitud:', error)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-lg font-medium">
                Nueva Solicitud de Constancia
            </h3>

            {error && (
                <div className="p-3 text-red-700 bg-red-100 rounded-lg">
                    {error.message}
                    {error.error}
                </div>
            )}

            <div>
                <label className="block mb-2 font-medium">
                    Tipo de Constancia
                </label>
                <select
                    value={formData.request_type_id}
                    onChange={e =>
                        setFormData({
                            ...formData,
                            request_type_id: e.target.value,
                        })
                    }
                    className="w-full p-2 border rounded-md"
                    required
                    disabled={loading}>
                    <option value="">Seleccione un tipo...</option>
                    {requestTypes.map(type => (
                        <option key={type.id} value={type.id}>
                            {type.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block mb-2 font-medium">Descripción</label>
                <textarea
                    value={formData.description}
                    onChange={e =>
                        setFormData({
                            ...formData,
                            description: e.target.value,
                        })
                    }
                    className="w-full p-2 border rounded-md"
                    rows="4"
                    maxLength="500"
                    required
                    disabled={loading}
                    placeholder="Detalle el propósito de la solicitud..."
                />
                <span className="text-sm text-gray-500">
                    {formData.description.length}/500 caracteres
                </span>
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                    Cancelar
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50">
                    {loading ? 'Enviando...' : 'Crear Solicitud'}
                </button>
            </div>
        </form>
    )
}

export default CreateRequestForm
