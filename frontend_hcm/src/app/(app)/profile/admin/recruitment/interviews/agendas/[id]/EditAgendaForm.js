'use client'

import { useState, useEffect } from 'react'
import axios from '@/lib/axios'
import StandardLoader from '@/components/StandardLoader'
import { toast } from 'sonner'

const EditAgendaForm = ({
    initialData,
    typeAgendas,
    statuses,
    onSuccess,
    onCancel,
    agendaId,
}) => {
    const [formState, setFormState] = useState({
        scheduled_date: initialData.scheduled_date || '',
        time: initialData.time || '',
        location: initialData.location || '',
        type_agenda_id: initialData.type_agenda_id?.toString() || '', // Convertir a string
        status_id: initialData.status_id?.toString() || '', // Convertir a string
        changes_notification: initialData.changes_notification || '',
    })

    const [validTimes, setValidTimes] = useState([])
    const [loading, setLoading] = useState(false)
    const [validationErrors, setValidationErrors] = useState({})

    // Cargar datos iniciales y horarios válidos
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Cargar horarios válidos
                const timesResponse = await axios.get(
                    '/api/admin/agendas/valid-times',
                )
                setValidTimes(timesResponse.data)

                const rawTimeWithoutSeconds = initialData.time
                    .split(':')
                    .slice(0, 2)
                    .join(':')

                // Establecer datos iniciales
                setFormState({
                    scheduled_date: initialData.scheduled_date || '',
                    time: rawTimeWithoutSeconds || '',
                    location: initialData.location || '',
                    type_agenda_id:
                        initialData.type_agenda_id?.toString() || '',
                    status_id: initialData.status_id?.toString() || '',
                    changes_notification:
                        initialData.changes_notification || '',
                })
            } catch (error) {
                toast.error('Error al cargar datos iniciales')
            }
        }

        loadInitialData()
    }, [initialData])

    const handleChange = e => {
        const { name, value } = e.target
        setFormState(prev => ({
            ...prev,
            [name]: value,
        }))
        // Limpiar errores al modificar
        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: null,
            }))
        }
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setLoading(true)
        setValidationErrors({})

        try {
            const payload = {
                ...formState,
                type_agenda_id: Number(formState.type_agenda_id),
                status_id: Number(formState.status_id),
            }

            const response = await axios.put(
                `/api/agendas/${agendaId}`,
                payload,
            )

            if (response.data.success) {
                toast.success('Agenda actualizada correctamente')
                onSuccess({
                    ...response.data.data,
                    // Convertir IDs a strings para los selects
                    type_agenda_id:
                        response.data.data.type_agenda_id?.toString(),
                    status_id: response.data.data.status_id?.toString(),
                })
            }
        } catch (err) {
            const backendErrors = err.response?.data?.errors || {}
            const errorMessage =
                err.response?.data?.message || 'Error al actualizar la agenda'

            // Mostrar errores con Sonner
            if (err.response?.status === 422) {
                toast.error('Error de validación', {
                    description: Object.values(backendErrors).flat().join(', '),
                })
            } else {
                toast.error(errorMessage)
            }
            setValidationErrors(backendErrors)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-8 bg-white border border-gray-100 shadow-lg rounded-xl">
        {/* Encabezado */}
        <div className="border-b-2 border-[#004b9a] pb-4">
            <h2 className="text-2xl font-bold text-[#004b9a] flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar Agenda
            </h2>
            <p className="mt-1 text-gray-600">Actualiza los detalles de la agenda programada</p>
        </div>

        {/* Contenido del formulario */}
        <div className="grid gap-6 md:grid-cols-2">
            {/* Sección Programación */}
            <div className="p-4 space-y-4 border border-gray-200 rounded-lg md:col-span-2 bg-gray-50">
                <h3 className="text-lg font-semibold text-[#004b9a] flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Programación
                </h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Campo Fecha */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Fecha *
                        </label>
                        <input
                            type="date"
                            name="scheduled_date"
                            value={formState.scheduled_date}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#004b9a] focus:border-[#004b9a] ${
                                validationErrors.scheduled_date ? 'border-red-500' : 'border-gray-300'
                            }`}
                            min={new Date().toISOString().split('T')[0]}
                            required
                        />
                        {validationErrors.scheduled_date && (
                            <p className="mt-1 text-sm text-red-500">
                                {validationErrors.scheduled_date}
                            </p>
                        )}
                    </div>

                    {/* Campo Hora */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Hora *
                        </label>
                        <select
                            name="time"
                            value={formState.time}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#004b9a] focus:border-[#004b9a] ${
                                validationErrors.time ? 'border-red-500' : 'border-gray-300'
                            }`}
                            required
                        >
                            <option value="">Seleccionar hora</option>
                            {validTimes.map(time => (
                                <option key={time} value={time}>
                                    {new Date(`2000-01-01T${time}:00`)
                                        .toLocaleTimeString('es-VE', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true,
                                        })
                                        .replace(' a. m.', '')
                                        .replace(' p. m.', '')}
                                </option>
                            ))}
                        </select>
                        {validationErrors.time && (
                            <p className="mt-1 text-sm text-red-500">
                                {validationErrors.time}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Sección Detalles */}
            <div className="p-4 space-y-4 border border-gray-200 rounded-lg md:col-span-2 bg-gray-50">
                <h3 className="text-lg font-semibold text-[#004b9a] flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Detalles
                </h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Campo Ubicación */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Ubicación *
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={formState.location}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#004b9a] focus:border-[#004b9a] ${
                                validationErrors.location ? 'border-red-500' : 'border-gray-300'
                            }`}
                            required
                        />
                        {validationErrors.location && (
                            <p className="mt-1 text-sm text-red-500">
                                {validationErrors.location}
                            </p>
                        )}
                    </div>

                    {/* Campo Tipo de Agenda */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Tipo de Agenda *
                        </label>
                        <select
                            name="type_agenda_id"
                            value={formState.type_agenda_id.toString()}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#004b9a] focus:border-[#004b9a] ${
                                validationErrors.type_agenda_id ? 'border-red-500' : 'border-gray-300'
                            }`}
                            required
                        >
                            <option value="">Seleccionar tipo</option>
                            {typeAgendas.map(type => (
                                <option key={type.id} value={type.id.toString()}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                        {validationErrors.type_agenda_id && (
                            <p className="mt-1 text-sm text-red-500">
                                {validationErrors.type_agenda_id}
                            </p>
                        )}
                    </div>

                    {/* Campo Estado */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Estado *
                        </label>
                        <select
                            name="status_id"
                            value={formState.status_id}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#004b9a] focus:border-[#004b9a] ${
                                validationErrors.status_id ? 'border-red-500' : 'border-gray-300'
                            }`}
                            required
                        >
                            <option value="">Seleccionar estado</option>
                            {statuses.map(status => (
                                <option key={status.id} value={status.id.toString()}>
                                    {status.name}
                                </option>
                            ))}
                        </select>
                        {validationErrors.status_id && (
                            <p className="mt-1 text-sm text-red-500">
                                {validationErrors.status_id}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Campo Motivo de los Cambios */}
            <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                    Motivo de los Cambios (opcional)
                </label>
                <textarea
                    name="changes_notification"
                    value={formState.changes_notification}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004b9a] focus:border-[#004b9a] placeholder-gray-400"
                    placeholder="Describe el motivo de los cambios realizados..."
                    rows="3"
                />
            </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col gap-4 pt-6 mt-8 border-t sm:flex-row sm:justify-end">
            <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 text-[#004b9a] transition-colors bg-white border border-[#004b9a] rounded-lg hover:bg-[#004b9a]/10 font-medium"
                disabled={loading}
            >
                Cancelar
            </button>
            <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 text-white transition-colors bg-[#004b9a] rounded-lg hover:bg-[#003a7a] font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {loading ? (
                    <StandardLoader />
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Guardar Cambios
                    </>
                )}
            </button>
        </div>
    </form>
    )
}

export default EditAgendaForm
