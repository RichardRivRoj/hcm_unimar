'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useAgenda from '@/hooks/useAgendasShow'
import useTypeAgendas from '@/hooks/typeAgendasView'
import useStatuses from '@/hooks/useStatuses'
import DetailCard from '@/components/DetailCard'
import axios from '@/lib/axios'
import StandardLoader from '@/components/StandardLoader'
import EditAgendaForm from './EditAgendaForm'
import HeaderControls from './HeaderControls'
import RatingModal from './RatingModal'
import DeleteConfirmationModal from './DeleteConfirmationModal'
import Card from '@/components/Card'
import { CheckIcon, StarIcon } from 'lucide-react'

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
        changes_notification: '',
    })

    const [isEditing, setIsEditing] = useState(false)
    const [updateError, setUpdateError] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deleteError, setDeleteError] = useState(null)
    const [deleteSuccess, setDeleteSuccess] = useState(false)
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false)
    const [isRated, setIsRated] = useState(false)

    // Cargar datos iniciales
    useEffect(() => {
        if (agenda) {
            setIsRated(agenda.agenda.has_rating)
            setFormState({
                scheduled_date: agenda.agenda.scheduled_date,
                time: agenda.agenda.time_raw, // Usar el valor raw
                location: agenda.agenda.location,
                type_agenda_id: agenda.agenda.type_agenda_id.toString(), // Nuevo campo del backend
                status_id: agenda.agenda.status_id.toString(), // Nuevo campo del backend
                changes_notification: '',
            })
        }
    }, [agenda])

    // Manejar eliminación
    const confirmDelete = async () => {
        try {
            const response = await axios.delete(`/api/agendas/${id}`)
            if (response.data.success) {
                setDeleteSuccess(true)
                setTimeout(() => router.back(), 1500)
            }
        } catch (err) {
            setDeleteError(
                err.response?.data?.message || 'Error al eliminar la agenda',
            )
        }
    }

    // Manejar éxito de calificación
    const handleRatingSuccess = () => {
        setIsRated(true)
        setSuccessMessage('Calificación guardada exitosamente')
        setTimeout(() => setSuccessMessage(null), 3000)
    }

    const handleUpdateSuccess = updatedData => {
        // Actualizar estado local con los nuevos datos
        setFormState(prev => ({
            ...prev,
            ...updatedData,
        }))
        setSuccessMessage('Agenda actualizada exitosamente')
        setIsEditing(false)

        // Recargar datos principales
        if (agenda?.mutate) {
            agenda.mutate()
        }
    }

    if (loading) return <StandardLoader />
    if (error) return <ErrorScreen error={error} />

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
        <div className="max-w-6xl p-4 mx-auto sm:p-6 lg:p-8">
            {/* Encabezado */}
            <div className="border-b-2 border-[#004b9a] pb-6 mb-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.back()}
                            className="text-[#004b9a] hover:bg-[#004b9a]/10 p-2 rounded-lg transition-colors">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                />
                            </svg>
                        </button>
                        <h1 className="text-2xl lg:text-3xl font-bold text-[#004b9a]">
                            Detalle de Agenda
                            <span className="block mt-1 text-sm font-normal text-gray-500">
                                | Candidato:{' '}
                                {agenda.candidate.person.first_name} {agenda.candidate.person.last_name}
                            </span>
                        </h1>
                    </div>
                    <HeaderControls
                        onDelete={() => setShowDeleteModal(true)}
                        onEdit={() => setIsEditing(true)}
                        isEditing={isEditing}
                        agenda={agenda}
                        isRated={isRated}
                    />
                </div>
            </div>

            {/* Contenido principal */}
            <div className="space-y-8">
                {successMessage && (
                    <div className="p-4 border-l-4 border-green-400 rounded-lg bg-green-50">
                        <div className="flex items-center gap-3">
                            <CheckIcon className="w-5 h-5 text-green-400" />
                            <span className="text-green-700">
                                {successMessage}
                            </span>
                        </div>
                    </div>
                )}

                {isEditing ? (
                    <EditAgendaForm
                        initialData={{
                            scheduled_date: agenda.agenda.scheduled_date,
                            time: agenda.agenda.time_raw,
                            location: agenda.agenda.location,
                            type_agenda_id:
                                agenda.agenda.type_agenda_id?.toString(),
                            status_id: agenda.agenda.status_id?.toString(),
                            changes_notification: '',
                        }}
                        typeAgendas={typeAgendas}
                        statuses={statuses}
                        onSuccess={handleUpdateSuccess}
                        onCancel={() => setIsEditing(false)}
                        agendaId={id}
                    />
                ) : (
                    <div className="space-y-8">
                        {/* Sección de Detalles Principales */}
                        <div className="bg-white border border-gray-200 shadow-sm rounded-xl">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-[#004b9a] flex items-center gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-6 h-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    Detalles del Evento
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2 lg:grid-cols-4">
                                <Card
                                    title="Fecha"
                                    value={new Date(
                                        agenda.agenda.scheduled_date,
                                    ).toLocaleDateString('es-ES', {
                                        timeZone: 'UTC'
                                    })}
                                    icon="calendar"
                                    color="#004b9a"
                                />
                                <Card
                                    title="Hora"
                                    value={agenda.agenda.time}
                                    icon="clock"
                                    color="#004b9a"
                                />
                                <Card
                                    title="Ubicación"
                                    value={agenda.agenda.location}
                                    icon="location"
                                    color="#004b9a"
                                />
                                <Card
                                    title="Estado"
                                    value={agenda.agenda.status}
                                    icon="rating"
                                    color="#004b9a"
                                />
                            </div>
                        </div>

                        {/* Sección de Información del Candidato */}
                        <div className="bg-white border border-gray-200 shadow-sm rounded-xl">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-[#004b9a] flex items-center gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-6 h-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                    Información del Candidato
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2 lg:grid-cols-4">
                                <Card
                                    title="Nombre Completo"
                                    value={`${agenda.candidate.person.first_name} ${agenda.candidate.person.last_name}`}
                                    icon="user"
                                />
                                <Card
                                    title="Email"
                                    value={agenda.candidate.person.email}
                                    icon="mail"
                                />
                                <Card
                                    title="Teléfono"
                                    value={agenda.candidate.person.phone}
                                    icon="phone"
                                />
                                <Card
                                    title="Identificación"
                                    value={
                                        agenda.candidate.person
                                            .identification_value
                                    }
                                    icon="job"
                                />
                            </div>
                        </div>

                        {/* Sección de Información de la Vacante */}
                        <div className="bg-white border border-gray-200 shadow-sm rounded-xl">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-[#004b9a] flex items-center gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-6 h-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                    Detalles de la Vacante
                                </h2>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="bg-[#004b9a]/5 p-4 rounded-lg border-l-4 border-[#004b9a]">
                                    <h3 className="font-semibold text-[#004b9a] mb-2">
                                        Título de la Posición
                                    </h3>
                                    <p className="text-gray-700">
                                        {agenda.vacancy.title}
                                    </p>
                                </div>

                                <div className="p-4 border-l-4 border-gray-300 rounded-lg bg-gray-50">
                                    <h3 className="mb-2 font-semibold text-gray-700">
                                        Descripción de la Vacante
                                    </h3>
                                    <p className="text-gray-600">
                                        {agenda.vacancy.description}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Sección de Acciones */}
                        {agenda.agenda.status === 'Activo' && !isRated && (
                            <div className="flex justify-end gap-4 mt-8">
                                <button
                                    onClick={() => setIsRatingModalOpen(true)}
                                    className="px-6 py-2 bg-[#004b9a] text-white rounded-lg hover:bg-[#003a7a] transition-colors flex items-center gap-2">
                                    <StarIcon className="w-5 h-5" />
                                    Calificar Evento
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modals */}
            <RatingModal
                isOpen={isRatingModalOpen}
                onClose={() => setIsRatingModalOpen(false)}
                agendaId={id}
                onSuccess={handleRatingSuccess}
            />

            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                error={deleteError}
                success={deleteSuccess}
            />
        </div>
    )
}

export default AgendaDetail
