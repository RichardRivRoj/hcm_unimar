'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckIcon, StarIcon, Trash2 } from 'lucide-react'
import useAgenda from '@/hooks/useAgendasShow'
import useTypeAgendas from '@/hooks/typeAgendasView'
import useStatuses from '@/hooks/useStatuses'
import DetailCard from '@/components/DetailCard'
import { GeneralModal, Modal } from '@/components/Modal'
import axios from '@/lib/axios'
import StandardLoader from '@/components/StandardLoader'
import { XMarkIcon } from '@heroicons/react/24/outline'

const AgendaDetail = ({ params }) => {
    const router = useRouter()
    const { id } = params
    const { agenda, loading, error } = useAgenda(id)

    const {
        typeAgendas,
        loading: loadingTypeAgendas,
        error: errorTypeAgendas,
    } = useTypeAgendas()
    const {
        statuses,
        loading: loadingStatuses,
        error: errorStatuses,
    } = useStatuses()

    const [formState, setFormState] = useState({
        scheduled_date: '',
        time: '',
        location: '',
        type_agenda_id: '',
        status_id: '',
        changes_notification: '', // Nuevo campo para el motivo de los cambios
    })

    const [isEditing, setIsEditing] = useState(false)
    const [updateError, setUpdateError] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)
    const [isUpdating, setIsUpdating] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deleteError, setDeleteError] = useState(null)
    const [deleteSuccess, setDeleteSuccess] = useState(false)

    // Estado para el modal de calificación
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false)
    const [isRated, setIsRated] = useState(false)
    const [ratingForm, setRatingForm] = useState({
        score: 0,
        comments: '',
    })

    // Cargar datos iniciales
    useEffect(() => {
        if (agenda) {
            setFormState({
                scheduled_date: agenda.agenda.scheduled_date,
                time: agenda.agenda.time,
                location: agenda.agenda.location,
                type_agenda_id: agenda.agenda.type_agenda_id,
                status_id: agenda.agenda.status_id,
                changes_notification: '', // Inicializar vacío
            })
        }
    }, [agenda])

    // Manejar cambios en el formulario
    const handleChange = e => {
        const { name, value } = e.target
        setFormState(prev => ({ ...prev, [name]: value }))
    }

    // Función para abrir el modal de confirmación
    const openDeleteConfirmation = () => {
        setShowDeleteModal(true)
        setDeleteError(null)
        setDeleteSuccess(false)
    }

    // Función para cancelar la eliminación
    const cancelDelete = () => {
        setShowDeleteModal(false)
    }

    // Función para confirmar la eliminación
    const confirmDelete = async () => {
        try {
            const response = await axios.delete(`/api/agendas/${id}`)

            if (response.data.success) {
                setDeleteSuccess(true)
                setTimeout(() => {
                    router.back()
                }, 1500)
            }
        } catch (err) {
            setDeleteError(
                err.response?.data?.message || 'Error al eliminar la agenda',
            )
        } finally {
            setShowDeleteModal(false)
        }
    }

    // Enviar actualización
    const handleUpdate = async e => {
        e.preventDefault()
        setUpdateError(null)
        setSuccessMessage(null)
        setIsUpdating(true)

        try {
            const response = await axios.put(`/api/agendas/${id}`, formState)

            if (response.data.success) {
                setSuccessMessage('Agenda actualizada exitosamente')
                setIsEditing(false)
                setTimeout(() => setSuccessMessage(null), 3000)
            }
        } catch (err) {
            setUpdateError(
                err.response?.data?.message || 'Error al actualizar la agenda',
            )
        } finally {
            setIsUpdating(false)
        }
    }

    // Manejar el envío de la calificación
    const handleRatingSubmit = async e => {
        e.preventDefault()

        try {
            const response = await axios.post('/api/agenda-results', {
                ...ratingForm,
                agenda_id: id,
            })
            setIsRated(true) // Actualizar estado
            setIsRatingModalOpen(false)
            // Opcional: recargar datos o mostrar feedback

            if (response.data.success) {
                setSuccessMessage('Calificación guardada exitosamente')
                setIsRatingModalOpen(false)
                setRatingForm({ score: 0, comments: '' })
                setTimeout(() => setSuccessMessage(null), 3000)
            }
        } catch (err) {
            setUpdateError(
                err.response?.data?.message ||
                    'Error al guardar la calificación',
            )
        }
    }

    if (loading) {
        return <StandardLoader />
    }

    if (error) {
        return (
            <div className="max-w-4xl p-8 mx-auto text-center">
                <div className="p-4 mb-4 text-red-600 bg-red-100 rounded-lg">
                    {error}
                </div>
                <button
                    onClick={() => router.back()}
                    className="flex items-center justify-center gap-2 px-6 py-2 text-gray-600 transition-all hover:text-gray-800">
                    <span className="text-xl">←</span>
                    Volver a agendas
                </button>
            </div>
        )
    }

    return (
        <div className="max-w-4xl p-8 mx-auto text-justify bg-white shadow-sm rounded-xl">
            <div className="p-2 bg-white">
                {/* Header y controles */}
                <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
                    {/* Botón Volver a agendas (izquierda) */}
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-gray-600 hover:text-blue-800 group w-fit">
                        <span className="mr-2 text-2xl transition-transform group-hover:-translate-x-1">
                            ←
                        </span>
                        <span className="font-medium">Volver a agendas</span>
                    </button>

                    {/* Contenedor para los botones de la derecha */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        {/* Modal de confirmación */}
                        {showDeleteModal && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                                <div className="p-6 bg-white rounded-lg w-96">
                                    <h3 className="mb-4 text-xl font-semibold">
                                        Confirmar eliminación
                                    </h3>

                                    {deleteError && (
                                        <div className="p-2 mb-4 text-red-600 bg-red-100 rounded">
                                            {deleteError}
                                        </div>
                                    )}

                                    {deleteSuccess ? (
                                        <div className="p-2 text-green-600 bg-green-100 rounded">
                                            Agenda eliminada exitosamente
                                        </div>
                                    ) : (
                                        <>
                                            <p className="mb-4 text-gray-600">
                                                ¿Estás seguro de que deseas
                                                eliminar esta agenda?
                                            </p>

                                            <div className="flex justify-end gap-3">
                                                <button
                                                    type="button"
                                                    onClick={cancelDelete}
                                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                                                    Cancelar
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={confirmDelete}
                                                    className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700">
                                                    Eliminar
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Botón de eliminar modificado */}
                        <button
                            onClick={openDeleteConfirmation}
                            className="p-2 text-red-600 transition rounded-md hover:bg-red-100">
                            <Trash2 size={24} />
                        </button>

                        {/* Botón Editar Agenda */}
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
                                Editar Agenda
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Mensajes de estado */}
            {successMessage && (
                <div className="p-4 mb-6 text-green-700 bg-green-100 rounded-lg">
                    {successMessage}
                </div>
            )}
            {updateError && (
                <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-lg">
                    {updateError}
                </div>
            )}

            {/* Modal de calificación */}
            {isRatingModalOpen && (
                <GeneralModal
                    size='lg'
                    isOpen={isRatingModalOpen}
                    onClose={() => setIsRatingModalOpen(false)}
                    overlayClassName="bg-[#004b9a]/20 backdrop-blur-sm">
                    <div className="max-w-md max-h-screen p-6 overflow-auto bg-white rounded-xl">
                        {/* Encabezado */}
                        <div className="flex items-center gap-3 mb-6 border-b border-[#004b9a]/20 pb-4">
                            <div className="p-2 bg-[#004b9a]/10 rounded-lg">
                                <StarIcon className="w-6 h-6 text-[#004b9a]" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#004b9a]">
                                Evaluar Evento
                            </h2>
                        </div>

                        <form
                            onSubmit={handleRatingSubmit}
                            className="space-y-6">
                            {/* Campo de puntuación */}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-[#004b9a]">
                                    Calificación del 1 al 10
                                    <span className="ml-1 text-[#004b9a]/70">
                                        (requerido)
                                    </span>
                                </label>

                                <div className="relative">
                                    <input
                                        type="range"
                                        name="score"
                                        value={ratingForm.score}
                                        onChange={e =>
                                            setRatingForm({
                                                ...ratingForm,
                                                score: Math.min(
                                                    10,
                                                    Math.max(1, e.target.value),
                                                ),
                                            })
                                        }
                                        min="1"
                                        max="10"
                                        step="1"
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg accent-[#004b9a]"
                                    />

                                    {/* Marcadores de escala */}
                                    <div className="flex justify-between px-1 mt-2 text-sm text-[#004b9a]/80">
                                        {[...Array(10)].map((_, i) => (
                                            <span
                                                key={i + 1}
                                                className="w-4 text-center">
                                                {i + 1}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <p className="mt-2 text-sm text-[#004b9a]/70">
                                    Seleccione un valor entre 1 (Muy deficiente)
                                    y 10 (Excelente)
                                </p>
                            </div>

                            {/* Campo de comentarios */}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-[#004b9a]">
                                    Comentarios detallados
                                    <span className="ml-1 text-[#004b9a]/70">
                                        (requerido)
                                    </span>
                                </label>

                                <div className="relative">
                                    <textarea
                                        name="comments"
                                        value={ratingForm.comments}
                                        onChange={e =>
                                            setRatingForm({
                                                ...ratingForm,
                                                comments: e.target.value.slice(
                                                    0,
                                                    500,
                                                ),
                                            })
                                        }
                                        className="w-full p-3 border-2 border-[#004b9a]/20 rounded-lg focus:border-[#004b9a] focus:ring-2 focus:ring-[#004b9a]/30 transition-all"
                                        rows="4"
                                        placeholder="Ej: Detalla aspectos relevantes del evento, puntos fuertes y áreas de mejora..."
                                        required
                                    />

                                    {/* Contador de caracteres */}
                                    <div className="absolute bottom-2 right-2 text-sm text-[#004b9a]/70 bg-white px-2 rounded">
                                        {ratingForm.comments.length}/500
                                    </div>
                                </div>

                                <p className="mt-2 text-sm text-[#004b9a]/70">
                                    Por favor sea específico y objetivo en sus
                                    comentarios
                                </p>
                            </div>

                            {/* Botones */}
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsRatingModalOpen(false)}
                                    className="flex items-center gap-2 px-5 py-2.5 text-[#004b9a] bg-white border-2 border-[#004b9a]/20 rounded-lg hover:border-[#004b9a]/40 hover:bg-[#004b9a]/5 transition-all">
                                    <XMarkIcon className="w-5 h-5" />
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-5 py-2.5 text-white bg-[#004b9a] rounded-lg hover:bg-[#003a7d] transition-colors">
                                    <CheckIcon className="w-5 h-5" />
                                    Guardar Evaluación
                                </button>
                            </div>
                        </form>
                    </div>
                </GeneralModal>
            )}

            {isEditing ? (
                // Formulario de edición
                <form onSubmit={handleUpdate} className="space-y-8">
                    <div className="grid gap-6 md:grid-cols-2">
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
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        {/* Campo Hora */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Hora *
                            </label>
                            <input
                                type="time"
                                name="time"
                                value={formState.time}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

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
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        {/* Campo Tipo de Agenda */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Tipo de Agenda *
                            </label>
                            <select
                                name="type_agenda_id"
                                value={formState.type_agenda_id}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required>
                                <option value="">Seleccionar tipo</option>
                                {typeAgendas.map(type => (
                                    <option
                                        key={type.id}
                                        value={type.id}
                                        className="text-gray-600">
                                        {type.name}
                                    </option>
                                ))}
                            </select>
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
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required>
                                <option value="">Seleccionar estado</option>
                                {statuses.map(status => (
                                    <option
                                        key={status.id}
                                        value={status.id}
                                        className="text-gray-600">
                                        {status.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Campo Motivo de los Cambios */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Motivo de los Cambios (opcional)
                            </label>
                            <textarea
                                name="changes_notification"
                                value={formState.changes_notification}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Especifica el motivo de los cambios..."
                                rows="3"
                            />
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-col gap-4 mt-8 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-6 py-2 text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isUpdating}
                            className="px-6 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                            {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            ) : (
                // Vista de solo lectura
                <div className="space-y-8">
                    {/* Encabezado */}
                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Detalle de la Agenda
                        </h1>
                    </div>

                    {/* Detalles en tarjetas */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <DetailCard
                            title="Fecha"
                            value={new Date(
                                agenda.agenda.scheduled_date,
                            ).toLocaleDateString()}
                        />
                        <DetailCard title="Hora" value={agenda.agenda.time} />
                        <DetailCard
                            title="Ubicación"
                            value={agenda.agenda.location}
                        />
                        <DetailCard
                            title="Tipo de Agenda"
                            value={agenda.agenda.type_agenda}
                        />
                        <DetailCard
                            title="Estado"
                            value={agenda.agenda.status}
                        />
                    </div>

                    {/* Información del Candidato */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Información del Candidato
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <DetailCard
                                title="Nombre"
                                value={`${agenda.candidate.person.first_name} ${agenda.candidate.person.last_name}`}
                            />
                            <DetailCard
                                title="Email"
                                value={agenda.candidate.person.email}
                            />
                            <DetailCard
                                title="Teléfono"
                                value={agenda.candidate.person.phone}
                            />
                            <DetailCard
                                title="Identificación"
                                value={
                                    agenda.candidate.person.identification_value
                                }
                            />
                        </div>
                    </div>

                    {/* Información de la Vacante */}
                    <div className="p-6 bg-white border border-gray-200 shadow-lg rounded-xl">
                        <h2 className="mb-4 text-xl font-semibold text-left text-gray-900">
                            Información de la Vacante
                        </h2>

                        <div className="grid gap-6">
                            {/* Tarjeta del Título */}
                            <div className="flex items-center gap-4 p-4 border-l-4 border-blue-600 rounded-lg shadow-md bg-blue-50">
                                <div className="text-2xl text-blue-600">📌</div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        Título
                                    </h3>
                                    <p className="text-gray-700">
                                        {agenda.vacancy.title}
                                    </p>
                                </div>
                            </div>

                            {/* Tarjeta de la Descripción */}
                            <div className="flex items-center gap-4 p-4 border-l-4 border-green-600 rounded-lg shadow-md bg-green-50">
                                <div className="text-2xl text-green-600">
                                    📝
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        Descripción
                                    </h3>
                                    <p className="text-gray-700">
                                        {agenda.vacancy.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Botón de Agendar Entrevista (solo si es Aceptado) */}
                    {/* Botón de Calificar (solo si está activo y no calificado) */}
                    {agenda.agenda.status === 'Activo' && !isRated && (
                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsRatingModalOpen(true)}
                                className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700">
                                Calificar Evento
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default AgendaDetail
