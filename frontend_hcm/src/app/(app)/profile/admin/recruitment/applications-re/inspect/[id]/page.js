'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import useCandidate from '@/hooks/useCandidateShow'
import DetailCard from '@/components/DetailCard'
import { Modal } from '@/components/Modal'
import useScheduleInterview from '@/hooks/useScheduleInterview'
import useTypeAgendas from '@/hooks/typeAgendasView'
import DownloadCVButton from '@/components/DownloadCVButton'
import { Alert, AlertDescription } from '@/components/alert'
import StandardLoader from '@/components/StandardLoader'
import { DocumentIcon } from '@heroicons/react/24/outline'
import { GlobeIcon, Sun } from 'lucide-react'
import { toast } from 'sonner'
import { isValidUrl } from '@/utils/isValidUrl'

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
    const [validTimes, setValidTimes] = useState([]) // Añadir este estado
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
        responsibilities: 'Responsabilidades',

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

        level: 'Nivel de dominio',
        detail: 'Habilides',
        language: 'Idioma',
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

    useEffect(() => {
        const fetchValidTimes = async () => {
            try {
                const response = await axios.get(
                    '/api/admin/agendas/valid-times',
                )
                setValidTimes(response.data)
            } catch (error) {
                toast.error('Error al cargar horarios disponibles')
            }
        }

        if (isModalOpen) fetchValidTimes()
    }, [isModalOpen])

    const handleChange = e => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async e => {
        e.preventDefault()

        // Validación de hora mínima
        const selectedDateTime = new Date(
            `${formData.scheduled_date}T${formData.time}`,
        )
        if (selectedDateTime < new Date(Date.now() + 3600000)) {
            toast.error('La hora debe tener al menos 1 hora de anticipación')
            return
        }

        try {
            await scheduleInterview(formData)
            toast.success('Entrevista agendada exitosamente')
            closeModal()
        } catch (error) {
            // Mostrar todos los errores del backend
            toast.error(error.message || 'Error al agendar la entrevista')
        }
    }

    if (loadingCandidate) {
        return <StandardLoader />
    }

    if (errorCandidate) return <div>Error: {errorCandidate}</div>

    return (
        <div className="max-w-6xl px-4 py-8 mx-auto lg:px-8">
            {/* Header superior */}
            <div className="flex flex-col justify-between gap-6 mb-8 md:flex-row md:items-center">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-[#004b9a] hover:text-[#003a7d] transition-colors duration-200 w-fit">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 mr-2"
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
                    <span className="font-semibold">Volver a aplicaciones</span>
                </button>

                {candidate.status_application.name !== 'Contratado' && (
                    <div className="flex gap-4">
                        {candidate.status_application.name !== 'Aceptado' &&
                            candidate.status_application.name !==
                                'En Progreso' && (
                                <button
                                    onClick={() => setShowConfirm('aceptado')}
                                    disabled={loading}
                                    className="px-6 py-2 text-white transition-colors duration-200 bg-green-600 rounded-lg shadow-sm hover:bg-green-700">
                                    {loading && showConfirm === 'aceptado'
                                        ? 'Procesando...'
                                        : 'Aceptar'}
                                </button>
                            )}

                        {candidate.status_application.name !== 'Rechazado' && (
                            <button
                                onClick={() => setShowConfirm('rechazado')}
                                disabled={loading}
                                className="px-6 py-2 text-white transition-colors duration-200 bg-red-600 rounded-lg shadow-sm hover:bg-red-700">
                                {loading && showConfirm === 'rechazado'
                                    ? 'Procesando...'
                                    : 'Rechazar'}
                            </button>
                        )}
                    </div>
                )}
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

            {/* Tarjeta principal del candidato */}
            <div className="p-6 mb-8 bg-white border border-gray-100 shadow-sm rounded-xl">
                <div className="flex flex-col items-start gap-6 md:flex-row">
                    {candidate.person.photo_url && (
                        <div className="overflow-hidden rounded-lg w-36 h-36">
                            <img
                                src={candidate.person.photo_url}
                                alt={`${candidate.person.first_name} ${candidate.person.last_name}`}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    )}

                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-[#004b9a] mb-2">
                            {candidate.person.first_name}{' '}
                            {candidate.person.last_name}
                        </h1>
                        <p className="mb-4 text-lg text-gray-600">
                            {candidate.person.summary ||
                                'Sin descripción adicional'}
                        </p>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <DetailCard
                                title="Estado de la aplicación"
                                value={candidate.status_application?.name}
                                highlight={true}
                                color="#004b9a"
                            />
                            <DetailCard
                                title="Postulado a"
                                value={candidate.vacancy?.position?.description}
                            />
                            <DetailCard
                                title="Ubicación"
                                value={candidate.vacancy?.department?.name}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Sección de información personal */}
            <section className="p-6 mb-8 bg-white border border-gray-100 shadow-sm rounded-xl">
                <h2 className="text-2xl font-semibold text-[#004b9a] mb-6">
                    Información Personal
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <DetailCard
                        title="Contacto"
                        items={[
                            { label: 'Email', value: candidate.person.email },
                            {
                                label: 'Teléfono',
                                value: candidate.person.phone,
                            },
                        ]}
                    />

                    <DetailCard
                        title="Documentación"
                        items={[
                            {
                                label: 'Tipo de documento',
                                value: candidate.person.identificationtype
                                    ?.code,
                            },
                            {
                                label: 'Número de documento',
                                value: candidate.person.identification_value,
                            },
                        ]}
                    />

                    <DetailCard
                        title="Detalles personales"
                        items={[
                            {
                                label: 'Fecha de nacimiento',
                                value: new Date(
                                    candidate.person.birth_date,
                                ).toLocaleDateString(),
                            },
                            {
                                label: 'Género',
                                value: candidate.person.gender?.name,
                            },
                            {
                                label: 'Estado civil',
                                value: candidate.person.maritalstatus?.name,
                            },
                        ]}
                    />
                </div>
            </section>

            {/* Sección de documentos */}
            <section className="p-6 mb-8 bg-white border border-gray-100 shadow-sm rounded-xl">
                <div className="flex flex-col justify-between mb-6 md:flex-row md:items-center">
                    <h2 className="text-2xl font-semibold text-[#004b9a] mb-4 md:mb-0">
                        Documentos Adjuntos
                    </h2>
                    <DownloadCVButton resumeUrl={candidate.person.resume_url} />
                </div>

                <div className="space-y-8">
                    {candidate.documents?.length > 0 ? (
                        Object.entries(
                            candidate.documents.reduce((acc, doc) => {
                                const type = doc.documenttype?.name || 'Otros'
                                if (!acc[type]) acc[type] = []
                                acc[type].push(doc)
                                return acc
                            }, {}),
                        ).map(([type, documents]) => (
                            <div key={type} className="space-y-4">
                                {/* Encabezado del tipo de documento */}
                                <div className="px-4 py-3 bg-[#004b9a] rounded-lg">
                                    <h3 className="text-lg font-semibold text-white">
                                        {type}
                                    </h3>
                                </div>

                                {/* Listado de documentos */}
                                <div className="grid gap-4 md:grid-cols-2">
                                    {documents.map(doc => {
                                        const metadata =
                                            typeof doc.metadata === 'string'
                                                ? JSON.parse(doc.metadata)
                                                : doc.metadata
                                        const detail =
                                            typeof doc.detail === 'string'
                                                ? JSON.parse(doc.detail)
                                                : doc.detail

                                        return (
                                            <div
                                                key={doc.id}
                                                className="p-4 transition-shadow bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md">
                                                {/* Encabezado del documento */}
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="p-2 bg-[#004b9a]/10 rounded-lg">
                                                        {doc.document_type_id ===
                                                        9 ? (
                                                            <GlobeIcon className="w-5 h-5 text-[#004b9a]" />
                                                        ) : doc.document_type_id ===
                                                          10 ? (
                                                            <Sun className="w-5 h-5 text-[#004b9a]" />
                                                        ) : (
                                                            <DocumentIcon className="w-5 h-5 text-[#004b9a]" />
                                                        )}
                                                    </div>
                                                    <h4 className="text-base font-semibold text-[#004b9a]">
                                                        {doc.document_name}
                                                    </h4>
                                                </div>

                                                {/* Contenido específico */}
                                                {[9, 10].includes(
                                                    doc.document_type_id,
                                                ) ? (
                                                    <div className="space-y-2">
                                                        {doc.document_type_id ===
                                                            10 && (
                                                            <>
                                                                <p className="text-sm font-medium text-gray-600">
                                                                    Habilidades
                                                                    requeridas:
                                                                </p>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {detail?.map(
                                                                        (
                                                                            skill,
                                                                            index,
                                                                        ) => (
                                                                            <span
                                                                                key={
                                                                                    index
                                                                                }
                                                                                className="px-2 py-1 text-sm bg-[#004b9a]/10 text-[#004b9a] rounded-full">
                                                                                {
                                                                                    skill
                                                                                }
                                                                            </span>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            </>
                                                        )}
                                                        {doc.document_type_id ===
                                                            9 && (
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-sm font-medium text-gray-600">
                                                                    Nivel:
                                                                </p>
                                                                <span className="px-2 py-1 text-sm bg-[#004b9a]/10 text-[#004b9a] rounded-full">
                                                                    {
                                                                        detail?.level
                                                                    }
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        {/* Fechas */}
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div>
                                                                <p className="text-sm font-medium text-[#004b9a]">
                                                                    Fecha inicio
                                                                </p>
                                                                <p className="text-sm text-gray-600">
                                                                    {new Date(
                                                                        doc.issue_date,
                                                                    ).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-[#004b9a]">
                                                                    Fecha final
                                                                </p>
                                                                <p
                                                                    className={`text-sm ${doc.expiration_date ? 'text-gray-600' : 'text-[#004b9a]'}`}>
                                                                    {doc.expiration_date
                                                                        ? new Date(
                                                                              doc.expiration_date,
                                                                          ).toLocaleDateString()
                                                                        : 'No expira'}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Metadatos */}
                                                        {metadata && (
                                                            <div className="pt-3 border-t border-gray-100">
                                                                <div className="grid grid-cols-2 gap-3">
                                                                    {Object.entries(
                                                                        metadata,
                                                                    ).map(
                                                                        ([
                                                                            key,
                                                                            value,
                                                                        ]) => (
                                                                            <div
                                                                                key={
                                                                                    key
                                                                                }>
                                                                                <p className="text-sm font-medium text-[#004b9a]">
                                                                                    {translateMetadataKey(
                                                                                        key,
                                                                                    )}
                                                                                </p>
                                                                                {key ===
                                                                                'responsibilities' ? (
                                                                                    <ul className="pl-4 list-disc">
                                                                                        {value
                                                                                            .split(
                                                                                                '\n',
                                                                                            )
                                                                                            .map(
                                                                                                (
                                                                                                    responsibility,
                                                                                                    index,
                                                                                                ) => (
                                                                                                    <li
                                                                                                        key={
                                                                                                            index
                                                                                                        }
                                                                                                        className="text-sm text-gray-600">
                                                                                                        {
                                                                                                            responsibility
                                                                                                        }
                                                                                                    </li>
                                                                                                ),
                                                                                            )}
                                                                                    </ul>
                                                                                ) : (
                                                                                    <p className="text-sm text-gray-600">
                                                                                        {value ||
                                                                                            '-'}
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-xl">
                            <DocumentMissingIcon className="w-12 h-12 text-[#004b9a]/50" />
                            <p className="mt-4 text-gray-500">
                                No se encontraron documentos adjuntos
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Sección de acciones */}
            <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:justify-end">
                {(candidate.status_application.name === 'Aceptado' ||
                    candidate.status_application.name === 'En Progreso') && (
                    <div className="flex gap-4">
                        <button
                            onClick={openModal}
                            className="flex items-center gap-2 px-6 py-2 text-white bg-[#004b9a] rounded-lg shadow-sm hover:bg-[#003a7d] transition-colors duration-200">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5"
                                viewBox="0 0 20 20"
                                fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>Agendar nuevo evento</span>
                        </button>

                        <button
                            onClick={() =>
                                router.push(
                                    `/profile/admin/recruitment/applications-re/agendas/${id}`,
                                )
                            }
                            className="flex items-center gap-2 px-6 py-2 text-[#004b9a] bg-white border-2 border-[#004b9a] rounded-lg hover:bg-[#f5f8ff] transition-colors duration-200">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5"
                                viewBox="0 0 20 20"
                                fill="currentColor">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path
                                    fillRule="evenodd"
                                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>Ver eventos programados</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Modal de agendar entrevista (mejorado) */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <div className="p-6 bg-white rounded-xl">
                    <h2 className="text-2xl font-bold text-[#004b9a] mb-6">
                        Programar nuevo evento
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Fecha del evento
                                </label>
                                <input
                                    type="date"
                                    name="scheduled_date"
                                    value={formData.scheduled_date}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004b9a] focus:border-[#004b9a]"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Hora del evento
                                </label>
                                <select
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004b9a] focus:border-[#004b9a]"
                                    required
                                    disabled={!formData.scheduled_date}>
                                    <option value="">
                                        Seleccione un horario
                                    </option>
                                    {validTimes.map(time => (
                                        <option key={time} value={time}>
                                            {new Date(
                                                `2000-01-01T${time}`,
                                            ).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Tipo de evento
                            </label>
                            <select
                                name="type_agenda_id"
                                value={formData.type_agenda_id}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004b9a] focus:border-[#004b9a]"
                                required>
                                <option value="">
                                    Seleccione un tipo de evento
                                </option>
                                {typeAgendas.map(type => (
                                    <option
                                        key={type.id}
                                        value={type.id}
                                        className="py-2">
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Ubicación o enlace
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="Ej: Sala de conferencias A o https://meet.google.com/abc-xyz"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004b9a] focus:border-[#004b9a] pr-10"
                                    required
                                />
                                {/* Ícono de enlace cuando se detecta URL */}
                                {isValidUrl(formData.location) && (
                                    <div className="absolute inset-y-0 flex items-center right-3">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-[#004b9a]"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Preview del enlace */}
                            {isValidUrl(formData.location) && (
                                <div className="mt-2 text-sm">
                                    <span className="text-gray-500">
                                        Enlace detectado:{' '}
                                    </span>
                                    <a
                                        href={formData.location}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#004b9a] hover:underline break-all">
                                        {formData.location}
                                    </a>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-4 mt-8">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-6 py-2 text-gray-700 transition-colors duration-200 bg-gray-100 rounded-lg hover:bg-gray-200">
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loadingInterview}
                                className="px-6 py-2 text-white bg-[#004b9a] rounded-lg hover:bg-[#003a7d] transition-colors duration-200">
                                {loadingInterview
                                    ? 'Agendando...'
                                    : 'Programar Evento'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    )
}

export default CandidateDetails
