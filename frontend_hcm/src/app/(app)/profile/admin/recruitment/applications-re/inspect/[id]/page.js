'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import axios from '@/lib/axios'
import useCandidate from '@/hooks/useCandidateShow'
import DetailCard from '@/components/DetailCard'
import Modal from '@/components/Modal'
import useScheduleInterview from '@/hooks/useScheduleInterview'
import useTypeAgendas from '@/hooks/typeAgendasView'

const CandidateDetails = ({ params }) => {
    const router = useRouter()
    const { id } = params
    const {
        candidate,
        loading: loadingCandidate,
        error: errorCandidate,
    } = useCandidate(id)
    const {
        typeAgendas,
        loading: loadingType,
        error: errorType,
    } = useTypeAgendas()
    const {
        scheduleInterview,
        loading: loadingInterview,
        error: errorInterview,
        success: successInterview,
    } = useScheduleInterview()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)
    const [showConfirm, setShowConfirm] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formData, setFormData] = useState({
        candidate_id: id, // Se recibe como prop
        type_agenda_id: '',
        scheduled_date: '',
        time: '',
        location: '',
        status_id: 1, // Suponiendo que '1' es el estado por defecto
    })

    // Objeto de traducción de claves de metadatos
    const metadataTranslations = {
        // General
        hours: 'Horas',
        instructor: 'Instructor',

        // Experiencia laboral (jobs)
        company_name: 'Nombre de la empresa',
        position: 'Cargo',

        // Estudios (studies)
        institution: 'Institución',
        degree: 'Título obtenido',

        // Cursos (courses)
        course_name: 'Nombre del curso',
        certification: 'Certificación',

        // Otros posibles campos
        start_date: 'Fecha de inicio',
        end_date: 'Fecha de finalización',
        description: 'Descripción',
    }

    // Abrir modal
    const openModal = () => setIsModalOpen(true)

    // Cerrar modal
    const closeModal = () => setIsModalOpen(false)

    // Función para traducir las claves
    const translateMetadataKey = key => {
        return (
            metadataTranslations[key] ||
            key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        )
    }

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleStatusChange = async status => {
        setLoading(true)
        setError(null)

        try {
            await axios.put(`/api/candidates/${id}/status`, { status })
            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)
        } catch (err) {
            setError(
                err.response?.data?.message || 'Error al actualizar estado',
            )
        } finally {
            setLoading(false)
            setShowConfirm(null)
        }
    }

    const handleSubmit = async e => {
        e.preventDefault()
        await scheduleInterview({ ...formData, candidate_id: id, status_id: 1 })
        if (success) {
            setTimeout(() => {
                closeModal
            }, 1000)
        }
    }

    if (loadingCandidate) {
        return (
            <div className="max-w-4xl p-8 mx-auto space-y-6 animate-pulse">
                <div className="w-3/4 h-10 bg-gray-100 rounded-full"></div>
                <div className="w-2/3 h-4 bg-gray-100 rounded"></div>
                <div className="grid gap-4 mt-8 md:grid-cols-2">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="p-4 space-y-2 rounded-lg bg-gray-50">
                            <div className="w-1/4 h-4 bg-gray-100 rounded"></div>
                            <div className="w-3/4 h-6 bg-gray-100 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (errorCandidate) return <div>Error: {errorCandidate}</div>

    return (
        <div className="max-w-4xl p-8 mx-auto text-justify bg-white shadow-sm rounded-xl">
            {/* Controles superiores */}
            <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
                {/* Botón Volver */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-gray-600 hover:text-blue-800 group w-fit">
                    <span className="mr-2 text-2xl transition-transform group-hover:-translate-x-1">
                        ←
                    </span>
                    <span className="font-medium">Volver</span>
                </button>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    {/* Botones con confirmación */}
                    <button
                        onClick={() => setShowConfirm('aceptado')}
                        disabled={loading}
                        className="px-4 py-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50">
                        {loading && showConfirm === 'aceptado'
                            ? 'Procesando...'
                            : 'Aceptar'}
                    </button>

                    <button
                        onClick={() => setShowConfirm('rechazado')}
                        disabled={loading}
                        className="px-4 py-2 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50">
                        {loading && showConfirm === 'rechazado'
                            ? 'Procesando...'
                            : 'Rechazar'}
                    </button>
                </div>
            </div>

            {/* Modal de confirmación */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="p-6 bg-white rounded-lg w-96">
                        <h3 className="mb-4 text-xl font-semibold">
                            Confirmar acción
                        </h3>
                        <p className="mb-4 text-gray-600">
                            ¿Estás seguro de que deseas marcar esta aplicación
                            como{' '}
                            {showConfirm === 'aceptado'
                                ? 'aceptada'
                                : 'rechazada'}
                            ?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowConfirm(null)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                                Cancelar
                            </button>
                            <button
                                onClick={() => handleStatusChange(showConfirm)}
                                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Mensajes de estado */}
            {success && (
                <div className="p-4 mb-6 text-green-700 bg-green-100 rounded-lg">
                    Estado actualizado correctamente
                </div>
            )}
            {error && (
                <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-lg">
                    {error}
                </div>
            )}

            {/* Vista de solo lectura */}
            <div className="space-y-8">
                {/* Encabezado */}
                <div className="space-y-4">
                    {candidate.person && (
                        <div className="flex items-center gap-4">
                            {/* Foto del candidato */}
                            {candidate.person.photo_url && (
                                <img
                                    src={candidate.person.photo_url}
                                    alt={`${candidate.person.first_name} ${candidate.person.last_name}`}
                                    className="object-cover w-24 h-24 border-2 border-gray-200 rounded-full"
                                />
                            )}
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {candidate.person.first_name}{' '}
                                    {candidate.person.last_name}
                                </h1>
                                <p className="text-lg text-gray-600">
                                    {candidate.person.summary ||
                                        'No hay descripción disponible.'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Detalles en tarjetas */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {/* Información Personal */}
                    <DetailCard title="Email" value={candidate.person.email} />
                    <DetailCard
                        title="Teléfono"
                        value={candidate.person.phone}
                    />
                    <DetailCard
                        title="Fecha de Nacimiento"
                        value={new Date(
                            candidate.person.birth_date,
                        ).toLocaleDateString()}
                    />
                    <DetailCard
                        title="Tipo de Identificación"
                        value={
                            candidate.person.identificationtype?.code ||
                            'No especificado'
                        }
                    />
                    <DetailCard
                        title="Número de documento"
                        value={
                            candidate.person.identification_value ||
                            'No especificado'
                        }
                    />
                    <DetailCard
                        title="Estado Civil"
                        value={
                            candidate.person.maritalstatus?.name ||
                            'No especificado'
                        }
                    />

                    <DetailCard
                        title="Género"
                        value={
                            candidate.person.gender?.name || 'No especificado'
                        }
                    />
                    <DetailCard
                        title="País"
                        value={
                            candidate.person.country?.name || 'No especificado'
                        }
                    />
                    <DetailCard
                        title="Etnia"
                        value={
                            candidate.person.ethnicity?.name ||
                            'No especificado'
                        }
                    />
                </div>

                {/* Documentos */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Documentos
                    </h2>
                    {candidate.documents?.length > 0 ? (
                        // Agrupar documentos por tipo
                        Object.entries(
                            candidate.documents.reduce((acc, doc) => {
                                const type = doc.documenttype?.name || 'Otros'
                                if (!acc[type]) acc[type] = []
                                acc[type].push(doc)
                                return acc
                            }, {}),
                        ).map(([type, documents]) => (
                            <div key={type} className="space-y-3">
                                {/* Subtítulo del tipo de documento */}
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {type}
                                </h3>

                                {/* Lista de documentos de este tipo */}
                                {documents.map(doc => {
                                    // Parsear los metadatos como JSON
                                    const metadata =
                                        typeof doc.metadata === 'string'
                                            ? JSON.parse(doc.metadata)
                                            : doc.metadata

                                    return (
                                        <div
                                            key={doc.id}
                                            className="p-4 rounded-lg bg-gray-50">
                                            {/* Nombre del documento */}
                                            <p className="font-medium text-gray-900">
                                                {doc.document_name}
                                            </p>

                                            {/* Fechas */}
                                            <div className="mt-2 text-base text-gray-600">
                                                <p>
                                                    <span className="font-medium">
                                                        Fecha de Inicio:
                                                    </span>{' '}
                                                    {new Date(
                                                        doc.issue_date,
                                                    ).toLocaleDateString()}
                                                </p>
                                                <p>
                                                    <span className="font-medium">
                                                        Fecha de Finalización:
                                                    </span>{' '}
                                                    {doc.expiration_date
                                                        ? new Date(
                                                              doc.expiration_date,
                                                          ).toLocaleDateString()
                                                        : 'No expira'}
                                                </p>
                                            </div>

                                            {/* Metadatos */}
                                            {metadata && (
                                                <div className="mt-2 text-sm text-gray-600">
                                                    <p className="font-medium">
                                                        Detalles:
                                                    </p>
                                                    <ul className="list-disc list-inside">
                                                        {Object.entries(
                                                            metadata,
                                                        ).map(
                                                            ([key, value]) => (
                                                                <li key={key}>
                                                                    <span className="capitalize">
                                                                        {translateMetadataKey(
                                                                            key,
                                                                        )}
                                                                        :
                                                                    </span>{' '}
                                                                    {value ||
                                                                        'No especificado'}
                                                                </li>
                                                            ),
                                                        )}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-gray-500 rounded-lg bg-gray-50">
                            No se han subido documentos.
                        </div>
                    )}
                </div>

                {/* Vacante y Estado de Aplicación */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Información de la Vacante
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <DetailCard
                            title="Vacante"
                            value={
                                candidate.vacancy?.title || 'No especificado'
                            }
                        />
                        <DetailCard
                            title="Estado de la Aplicación"
                            value={
                                candidate.status_application?.name ||
                                'No especificado'
                            }
                        />
                    </div>
                </div>

                {/* Botón de Agendar Entrevista (solo si es Aceptado) */}
                {(candidate.status_application.name === 'Aceptado' || candidate.status_application.name === 'En Progreso') && (
                    <div className="flex gap-4">
                        <button
                            onClick={openModal}
                            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                            Agendar Eventos
                        </button>
                        <button
                            onClick={() =>
                                router.push(
                                    `/profile/admin/recruitment/applications-re/agendas/${id}`,
                                )
                            }
                            className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700">
                            Ver Eventos
                        </button>
                    </div>
                )}
            </div>

            {/* Modal para Agendar Entrevista */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <h2 className="mb-6 text-2xl font-bold">Agendar Evento</h2>
                {errorInterview && <p className="text-red-500">{error}</p>}
                {successInterview && (
                    <p className="text-green-500">
                        ¡Entrevista agendada con éxito!
                    </p>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Fecha */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Fecha
                        </label>
                        <input
                            type="date"
                            name="scheduled_date"
                            value={formData.scheduled_date}
                            onChange={handleChange}
                            className="w-full p-2 mt-1 border rounded-lg"
                            required
                        />
                    </div>

                    {/* Hora */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Hora
                        </label>
                        <input
                            type="time"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            className="w-full p-2 mt-1 border rounded-lg"
                            required
                        />
                    </div>

                    {/* Tipo de Entrevista */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Tipo de Entrevista
                        </label>
                        <select
                            name="type_agenda_id"
                            value={formData.type_agenda_id}
                            onChange={handleChange}
                            className="w-full p-2 mt-1 border rounded-lg"
                            required>
                            <option value="">Seleccionar tipo</option>
                            {typeAgendas.map(type => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Ubicación */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Ubicación
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full p-2 mt-1 border rounded-lg"
                            placeholder="Ej: Sala de reuniones A"
                            required
                        />
                    </div>

                    {/* Botones del Formulario */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                            Agendar
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default CandidateDetails;
