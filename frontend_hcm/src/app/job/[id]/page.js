'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DetailCard from '@/components/DetailCard'
import useVacancyDetail from '@/hooks/useVacancyDetail'
import CheckIcon from '@/components/CheckIcon'
import useCandidateForm from '@/hooks/createCandidate'
import useIdentificacitionTypes from '@/hooks/identificationsView'
import useGenders from '@/hooks/gendersView'
import useEthnicities from '@/hooks/ethnicitiesView'
import useMaritalStatuses from '@/hooks/maritalStatusesView'
import useCountries from '@/hooks/countryView'

const JobDetails = ({ params }) => {
    const router = useRouter()
    const { id } = params
    const { vacancy, loading, error } = useVacancyDetail(id)
    const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false)
    const [currentStep, setCurrentStep] = useState(1) // Paso actual del modal
    const {
        identifications,
        loading: loadingIdentifications,
        error: errorIdentifications,
    } = useIdentificacitionTypes()
    const {
        genders,
        loading: loadingGenders,
        error: errorGenders,
    } = useGenders()
    const {
        ethnicities,
        loading: loadingEthnicities,
        error: errorEthnicities,
    } = useEthnicities()
    const {
        marital,
        loading: loadingMarital,
        error: errorMarital,
    } = useMaritalStatuses()
    const {
        countries,
        loading: loadingCountries,
        error: errorCountries,
    } = useCountries()
    const {
        loading: loadingCandidate,
        error: errorCandidate,
        response: candidateResponse,
        submitForm,
    } = useCandidateForm()

    // Estado para almacenar los datos del formulario
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        identification_value: '',
        vacancy_id: id, // ID de la vacante
        ethnicity_id: '',
        identification_type_id: '',
        marital_status_id: '',
        gender_id: '',
        countries_id: '',
        birth_date: '',
        photo: null,
        summary: '',
        documents: {
            jobs: [],
            studies: [],
            courses: [],
        },
    })

    // Función para manejar cambios en los campos del formulario
    const handleChange = e => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    // Función para manejar cambios en los documentos (estudios, cursos, empleos)
    const handleDocumentChange = (type, index, field, value) => {
        setFormData(prev => {
            const updatedDocuments = [...prev.documents[type]]
            updatedDocuments[index] = {
                ...updatedDocuments[index],
                [field]: value,
            }
            return {
                ...prev,
                documents: {
                    ...prev.documents,
                    [type]: updatedDocuments,
                },
            }
        })
    }

    const removeDocument = (type, index) => {
        setFormData(prev => {
            const updatedDocuments = [...prev.documents[type]]
            updatedDocuments.splice(index, 1) // Eliminar el documento en el índice dado
            return {
                ...prev,
                documents: {
                    ...prev.documents,
                    [type]: updatedDocuments,
                },
            }
        })
    }

    // Función para agregar un nuevo documento (estudio, curso, empleo)
    const addDocument = type => {
        setFormData(prev => ({
            ...prev,
            documents: {
                ...prev.documents,
                [type]: [...prev.documents[type], { name: '', issue_date: '' }],
            },
        }))
    }

    const handleSubmit = async e => {
        e.preventDefault()

        if (currentStep < 4) {
            setCurrentStep(currentStep + 1) // Avanzar al siguiente paso
            return
        }

        // Si estamos en el último paso, enviar los datos
        await submitForm(formData, id)

        if (candidateResponse?.success) {
            setIsApplicationModalOpen(false) // Cerrar el modal
            setCurrentStep(1) // Reiniciar el paso
            setFormData({
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
                identification_value: '',
                vacancy_id: id,
                ethnicity_id: '',
                identification_type_id: '',
                marital_status_id: '',
                gender_id: '',
                countries_id: '',
                birth_date: '',
                photo: null,
                summary: '',
                documents: {
                    jobs: [],
                    studies: [],
                    courses: [],
                },
            })
        } else {
            console.error(errorCandidate)
        }
    }

    if (loading) {
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

    if (error) return <div>Error: {error}</div>

    return (
        <>
            <div className="max-w-4xl p-10 mx-auto my-8 text-justify bg-white shadow-lg rounded-xl">
                <div className="p-4 space-y-8">
                    <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center text-gray-600 hover:text-blue-800 group w-fit">
                            <span className="mr-2 text-2xl transition-transform group-hover:-translate-x-1">
                                ←
                            </span>
                            <span className="font-medium">Volver</span>
                        </button>

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <button
                                onClick={() => setIsApplicationModalOpen(true)}
                                className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
                                Postularse
                            </button>
                        </div>
                    </div>

                    {/* Encabezado y detalles de la vacante */}
                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {vacancy.title}
                        </h1>
                        <p className="text-base text-gray-600">
                            {vacancy.description}
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                        <DetailCard
                            title="Cargo"
                            value={vacancy.position?.description}
                        />
                        <DetailCard
                            title="Departamento"
                            value={vacancy.department?.name}
                        />
                        <DetailCard
                            title="Modalidad"
                            value={vacancy.mode?.name}
                        />
                        <DetailCard
                            title="Vacantes"
                            value={vacancy.num_vacancy}
                        />
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Requisitos principales
                        </h2>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {vacancy.requirements?.length > 0 ? (
                                vacancy.requirements.map((req, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start p-4 rounded-lg bg-gray-50">
                                        <CheckIcon />
                                        <span className="ml-3 text-gray-700">
                                            {req}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-gray-500 rounded-lg bg-gray-50">
                                    No se han definido requisitos específicos
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Responsabilidades principales
                        </h2>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {vacancy.responsability?.length > 0 ? (
                                vacancy.responsability.map((req, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start p-4 rounded-lg bg-gray-50">
                                        <CheckIcon />
                                        <span className="ml-3 text-gray-700">
                                            {req}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-gray-500 rounded-lg bg-gray-50">
                                    No se han definido responsabilidades
                                    específicas
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de postulación */}
            {isApplicationModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="flex flex-col w-full max-w-4xl h-[90vh] p-6 bg-white rounded-lg">
                        {/* Encabezado */}
                        <div className="pb-4 border-b">
                            <h2 className="text-2xl font-semibold">
                                Postularse a: {vacancy.title}
                                <span className="text-sm text-gray-500">
                                    (Paso {currentStep}/4)
                                </span>
                            </h2>
                        </div>

                        <div className="flex-1 py-4 space-y-6 overflow-y-auto scrollbar-none">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Paso 1: Datos personales */}
                                {currentStep === 1 && (
                                    <>
                                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                            {/* Sección Información Básica */}
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-medium text-gray-900">
                                                    Información Básica
                                                </h3>

                                                <div>
                                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                                        Nombres *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="first_name"
                                                        value={
                                                            formData.first_name
                                                        }
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                                        Apellidos *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="last_name"
                                                        value={
                                                            formData.last_name
                                                        }
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                                        Fecha de Nacimiento *
                                                    </label>
                                                    <input
                                                        type="date"
                                                        name="birth_date"
                                                        value={
                                                            formData.birth_date
                                                        }
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>

                                            {/* Sección Contacto */}
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-medium text-gray-900">
                                                    Datos de Contacto
                                                </h3>

                                                <div>
                                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                                        Correo Electrónico *
                                                    </label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                                        Teléfono/Celular *
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>

                                            {/* Sección Identificación */}
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-medium text-gray-900">
                                                    Identificación
                                                </h3>

                                                <div>
                                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                                        Tipo de Documento *
                                                    </label>
                                                    <select
                                                        name="identification_type_id"
                                                        value={
                                                            formData.identification_type_id
                                                        }
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                                                        <option value="">
                                                            Seleccionar tipo
                                                        </option>
                                                        {identifications.map(
                                                            iden => (
                                                                <option
                                                                    key={
                                                                        iden.id
                                                                    }
                                                                    value={
                                                                        iden.id
                                                                    }>
                                                                    {iden.code}{' '}
                                                                    -{' '}
                                                                    {iden.name}
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                                        Número de Documento *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="identification_value"
                                                        value={
                                                            formData.identification_value
                                                        }
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>

                                            {/* Sección Demográficos */}
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-medium text-gray-900">
                                                    Información Demográfica
                                                </h3>

                                                <div>
                                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                                        Género *
                                                    </label>
                                                    <select
                                                        name="gender_id"
                                                        value={
                                                            formData.gender_id
                                                        }
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                                                        <option value="">
                                                            Seleccionar género
                                                        </option>
                                                        {genders.map(gend => (
                                                            <option
                                                                key={gend.id}
                                                                value={gend.id}>
                                                                {
                                                                    gend.short_name
                                                                }{' '}
                                                                - {gend.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                                        Etnia
                                                    </label>
                                                    <select
                                                        name="ethnicity_id"
                                                        value={
                                                            formData.ethnicity_id
                                                        }
                                                        onChange={handleChange}
                                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                                                        <option value="">
                                                            Seleccionar etnia
                                                        </option>
                                                        {ethnicities.map(
                                                            eth => (
                                                                <option
                                                                    key={eth.id}
                                                                    value={
                                                                        eth.id
                                                                    }>
                                                                    {
                                                                        eth.short_name
                                                                    }{' '}
                                                                    - {eth.name}
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                                        Estado Civil
                                                    </label>
                                                    <select
                                                        name="marital_status_id"
                                                        value={
                                                            formData.marital_status_id
                                                        }
                                                        onChange={handleChange}
                                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                                                        <option value="">
                                                            Seleccionar estado
                                                        </option>
                                                        {marital.map(mar => (
                                                            <option
                                                                key={mar.id}
                                                                value={mar.id}>
                                                                {mar.short_name}{' '}
                                                                - {mar.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Sección Adicional */}
                                            <div className="space-y-4 col-span-full">
                                                <h3 className="text-lg font-medium text-gray-900">
                                                    Información Adicional
                                                </h3>

                                                <div>
                                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                                        País de Residencia *
                                                    </label>
                                                    <select
                                                        name="countries_id"
                                                        value={
                                                            formData.countries_id
                                                        }
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                                                        <option value="">
                                                            Seleccionar país
                                                        </option>
                                                        {countries.map(con => (
                                                            <option
                                                                key={con.id}
                                                                value={con.id}>
                                                                {con.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                                        Resumen Profesional *
                                                    </label>
                                                    <textarea
                                                        name="summary"
                                                        value={formData.summary}
                                                        onChange={handleChange}
                                                        required
                                                        rows="4"
                                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                                        Subir foto tipo carnet
                                                        (JPG, PNG) *
                                                    </label>
                                                    <input
                                                        type="file"
                                                        name="photo"
                                                        onChange={e => {
                                                            const file =
                                                                e.target
                                                                    .files[0]
                                                            setFormData(
                                                                prev => ({
                                                                    ...prev,
                                                                    photo: file, // Almacenamos el objeto File
                                                                }),
                                                            )
                                                        }}
                                                        accept=".jpg,.jpeg,.png"
                                                        required
                                                        className="w-full"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Paso 2: Empleos */}
                                {currentStep === 2 && (
                                    <>
                                        <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                            Experiencia Laboral (Máximo 2
                                            empleos)
                                        </h3>

                                        {formData.documents.jobs.map(
                                            (job, index) => (
                                                <div
                                                    key={index}
                                                    className="p-4 mb-6 space-y-4 border rounded-lg">
                                                    {/* Document Name (Nombre del empleo) */}
                                                    <div>
                                                        <label className="block mb-1 text-sm font-medium text-gray-700">
                                                            Nombre del empleo *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={
                                                                job.name || ''
                                                            }
                                                            onChange={e =>
                                                                handleDocumentChange(
                                                                    'jobs',
                                                                    index,
                                                                    'name',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            required
                                                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                                            placeholder="Ej: Experiencia como Desarrollador Frontend en Google"
                                                        />
                                                    </div>

                                                    {/* Fechas principales */}
                                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                        <div>
                                                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                                                Fecha de inicio
                                                            </label>
                                                            <input
                                                                type="date"
                                                                value={
                                                                    job.issue_date ||
                                                                    ''
                                                                }
                                                                onChange={e =>
                                                                    handleDocumentChange(
                                                                        'jobs',
                                                                        index,
                                                                        'issue_date',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                required
                                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                                                Fecha de
                                                                finalización
                                                            </label>
                                                            <input
                                                                type="date"
                                                                value={
                                                                    job.expiration_date ||
                                                                    ''
                                                                }
                                                                onChange={e =>
                                                                    handleDocumentChange(
                                                                        'jobs',
                                                                        index,
                                                                        'expiration_date',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Metadata */}
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                                                Nombre de la
                                                                empresa *
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={
                                                                    job.metadata
                                                                        ?.company_name ||
                                                                    ''
                                                                }
                                                                onChange={e =>
                                                                    handleDocumentChange(
                                                                        'jobs',
                                                                        index,
                                                                        'metadata',
                                                                        {
                                                                            ...job.metadata,
                                                                            company_name:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        },
                                                                    )
                                                                }
                                                                required
                                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                                                Posición/Cargo *
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={
                                                                    job.metadata
                                                                        ?.position ||
                                                                    ''
                                                                }
                                                                onChange={e =>
                                                                    handleDocumentChange(
                                                                        'jobs',
                                                                        index,
                                                                        'metadata',
                                                                        {
                                                                            ...job.metadata,
                                                                            position:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        },
                                                                    )
                                                                }
                                                                required
                                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Botón para eliminar empleo */}
                                                    {formData.documents.jobs
                                                        .length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeDocument(
                                                                    'jobs',
                                                                    index,
                                                                )
                                                            }
                                                            className="px-4 py-2 mt-2 text-sm text-red-600 bg-red-100 rounded-lg hover:bg-red-200">
                                                            Eliminar Empleo
                                                        </button>
                                                    )}
                                                </div>
                                            ),
                                        )}

                                        {/* Botón para agregar empleo */}
                                        {formData.documents.jobs.length < 2 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    addDocument('jobs')
                                                }
                                                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                                                Agregar Empleo
                                            </button>
                                        )}
                                    </>
                                )}

                                {/* Paso 3: Estudios */}
                                {currentStep === 3 && (
                                    <>
                                        <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                            Formación Académica (Máximo 2
                                            estudios)
                                        </h3>

                                        {formData.documents.studies.map(
                                            (study, index) => (
                                                <div
                                                    key={index}
                                                    className="p-4 mb-6 space-y-4 border rounded-lg">
                                                    {/* Nombre del estudio */}
                                                    <div>
                                                        <label className="block mb-1 text-sm font-medium text-gray-700">
                                                            Título del estudio *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={
                                                                study.name || ''
                                                            }
                                                            onChange={e =>
                                                                handleDocumentChange(
                                                                    'studies',
                                                                    index,
                                                                    'name',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            required
                                                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                                            placeholder="Ej: Ingeniería en Sistemas"
                                                        />
                                                    </div>

                                                    {/* Fechas importantes */}
                                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                        <div>
                                                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                                                Fecha de inicio
                                                                *
                                                            </label>
                                                            <input
                                                                type="date"
                                                                value={
                                                                    study.issue_date ||
                                                                    ''
                                                                }
                                                                onChange={e =>
                                                                    handleDocumentChange(
                                                                        'studies',
                                                                        index,
                                                                        'issue_date',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                required
                                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                                                Fecha de
                                                                graduación
                                                            </label>
                                                            <input
                                                                type="date"
                                                                value={
                                                                    study.expiration_date ||
                                                                    ''
                                                                }
                                                                onChange={e =>
                                                                    handleDocumentChange(
                                                                        'studies',
                                                                        index,
                                                                        'expiration_date',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Metadata */}
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                                                Institución
                                                                educativa *
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={
                                                                    study
                                                                        .metadata
                                                                        ?.institution ||
                                                                    ''
                                                                }
                                                                onChange={e =>
                                                                    handleDocumentChange(
                                                                        'studies',
                                                                        index,
                                                                        'metadata',
                                                                        {
                                                                            ...study.metadata,
                                                                            institution:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        },
                                                                    )
                                                                }
                                                                required
                                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                                                placeholder="Ej: Universidad Nacional"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                                                Grado obtenido *
                                                            </label>

                                                            <input
                                                                type="text"
                                                                value={
                                                                    study
                                                                        .metadata
                                                                        ?.grado ||
                                                                    ''
                                                                }
                                                                onChange={e =>
                                                                    handleDocumentChange(
                                                                        'studies',
                                                                        index,
                                                                        'metadata',
                                                                        {
                                                                            ...study.metadata,
                                                                            grado:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        },
                                                                    )
                                                                }
                                                                required
                                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                                                placeholder="Ej: Universidad Nacional"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Botón para eliminar estudio */}
                                                    {formData.documents.studies
                                                        .length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeDocument(
                                                                    'studies',
                                                                    index,
                                                                )
                                                            }
                                                            className="px-4 py-2 mt-2 text-sm text-red-600 bg-red-100 rounded-lg hover:bg-red-200">
                                                            Eliminar Estudio
                                                        </button>
                                                    )}
                                                </div>
                                            ),
                                        )}

                                        {/* Botón para agregar estudio */}
                                        {formData.documents.studies.length <
                                            2 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    addDocument('studies')
                                                }
                                                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                                                Agregar Estudio
                                            </button>
                                        )}
                                    </>
                                )}

                                {/* Paso 4: Cursos */}
                                {currentStep === 4 && (
                                    <>
                                        <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                            Cursos Realizados (Máximo 2 cursos)
                                        </h3>

                                        {formData.documents.courses.map(
                                            (course, index) => (
                                                <div
                                                    key={index}
                                                    className="p-4 mb-6 space-y-4 border rounded-lg">
                                                    {/* Nombre del curso */}
                                                    <div>
                                                        <label className="block mb-1 text-sm font-medium text-gray-700">
                                                            Nombre del curso *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={
                                                                course.name ||
                                                                ''
                                                            }
                                                            onChange={e =>
                                                                handleDocumentChange(
                                                                    'courses',
                                                                    index,
                                                                    'name',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            required
                                                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                                            placeholder="Ej: Curso de React Avanzado"
                                                        />
                                                    </div>

                                                    {/* Fechas importantes */}
                                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                        <div>
                                                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                                                Fecha de inicio
                                                                *
                                                            </label>
                                                            <input
                                                                type="date"
                                                                value={
                                                                    course.issue_date ||
                                                                    ''
                                                                }
                                                                onChange={e =>
                                                                    handleDocumentChange(
                                                                        'courses',
                                                                        index,
                                                                        'issue_date',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                required
                                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                                                Fecha de
                                                                finalización
                                                            </label>
                                                            <input
                                                                type="date"
                                                                value={
                                                                    course.expiration_date ||
                                                                    ''
                                                                }
                                                                onChange={e =>
                                                                    handleDocumentChange(
                                                                        'courses',
                                                                        index,
                                                                        'expiration_date',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Metadata */}
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                                                Horas del curso
                                                                *
                                                            </label>
                                                            <input
                                                                type="number"
                                                                value={
                                                                    course
                                                                        .metadata
                                                                        ?.hours ||
                                                                    ''
                                                                }
                                                                onChange={e =>
                                                                    handleDocumentChange(
                                                                        'courses',
                                                                        index,
                                                                        'metadata',
                                                                        {
                                                                            ...course.metadata,
                                                                            hours: e
                                                                                .target
                                                                                .value,
                                                                        },
                                                                    )
                                                                }
                                                                required
                                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                                                placeholder="Ej: 40"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                                                Instructor *
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={
                                                                    course
                                                                        .metadata
                                                                        ?.instructor ||
                                                                    ''
                                                                }
                                                                onChange={e =>
                                                                    handleDocumentChange(
                                                                        'courses',
                                                                        index,
                                                                        'metadata',
                                                                        {
                                                                            ...course.metadata,
                                                                            instructor:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        },
                                                                    )
                                                                }
                                                                required
                                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                                                placeholder="Ej: Juan Pérez"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Botón para eliminar curso */}
                                                    {formData.documents.courses
                                                        .length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeDocument(
                                                                    'courses',
                                                                    index,
                                                                )
                                                            }
                                                            className="px-4 py-2 mt-2 text-sm text-red-600 bg-red-100 rounded-lg hover:bg-red-200">
                                                            Eliminar Curso
                                                        </button>
                                                    )}
                                                </div>
                                            ),
                                        )}

                                        {/* Botón para agregar curso */}
                                        {formData.documents.courses.length <
                                            2 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    addDocument('courses')
                                                }
                                                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                                                Agregar Curso
                                            </button>
                                        )}
                                    </>
                                )}


                                {/* Botones fijos en la parte inferior */}
                                <div className="pt-4 border-t">
                                {errorCandidate && (
                                    <div className="p-4 mb-4 text-red-600 bg-red-100 rounded-lg">
                                        {errorCandidate.errors
                                            ? Object.values(
                                                  errorCandidate.errors,
                                              ).join(', ')
                                            : errorCandidate.message}
                                    </div>
                                )}
                                    <div className="flex justify-between">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIsApplicationModalOpen(false)
                                            }
                                            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                                            Cancelar
                                        </button>

                                        <div className="flex gap-3">
                                            {currentStep > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setCurrentStep(
                                                            currentStep - 1,
                                                        )
                                                    }
                                                    className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                                                    Anterior
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                onClick={e => handleSubmit(e)}
                                                className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                                                {currentStep === 4
                                                    ? 'Finalizar'
                                                    : 'Siguiente'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default JobDetails
