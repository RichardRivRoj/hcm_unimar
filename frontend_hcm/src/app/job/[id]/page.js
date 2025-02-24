'use client'

import { useState, useEffect } from 'react'
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
import { PencilIcon } from 'lucide-react'

const JobDetails = ({ params }) => {
    const router = useRouter()
    const { id } = params
    const { vacancy, loading, error } = useVacancyDetail(id)
    const [dragActive, setDragActive] = useState(false)
    const [errorPhoto, setErrorPhoto] = useState('')
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

    // Efecto para manejar respuesta exitosa
    useEffect(() => {
        if (candidateResponse?.success) {
            setIsApplicationModalOpen(false)
            setCurrentStep(1)
            resetForm()
        }
    }, [candidateResponse])


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
            competencies: [],
            languages: [{
                name: '',
                detail: { level: '' }
            }]
        },
    })

    const validateImage = file => {
        if (!file) return false

        const validTypes = ['image/jpeg', 'image/png']
        const maxSize = 2 * 1024 * 1024 // 2MB

        if (!validTypes.includes(file.type)) {
            setErrorPhoto('Formato no válido. Solo se permiten JPG/PNG')
            return false
        }

        if (file.size > maxSize) {
            setErrorPhoto('El archivo es demasiado grande (Máx. 2MB)')
            return false
        }

        setErrorPhoto('')
        return true
    }

    // Función para manejar cambios en los campos del formulario
    const handleChange = e => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    // Función mejorada para manejar cambios en documentos
    const handleDocumentChange = (type, index, field, value) => {
        setFormData(prev => {
            const updatedDocuments = [...prev.documents[type]]

            // Convertir cadenas vacías en fechas a null
            if (['issue_date', 'expiration_date'].includes(field)) {
                value = value === '' ? null : value
            }

            // Manejar estructura específica para idiomas
            if (type === 'languages' && field === 'level') {
                updatedDocuments[index] = {
                    ...updatedDocuments[index],
                    detail: {
                        ...(updatedDocuments[index].detail || {}),
                        level: value,
                    },
                }
            } else {
                updatedDocuments[index] = {
                    ...updatedDocuments[index],
                    [field]: value,
                }
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

    // Función mejorada para agregar documentos
    const addDocument = type => {
        const baseDocument = {
            name: '',
            ...(type === 'competencies' && { detail: [] }),
            ...(type === 'languages' && {
                detail: { level: '' },
            }),
        }

        // Agregar fechas solo para documentos que las requieren
        if (['jobs', 'studies', 'courses'].includes(type)) {
            baseDocument.issue_date = null
            baseDocument.expiration_date = null
        }

        setFormData(prev => ({
            ...prev,
            documents: {
                ...prev.documents,
                [type]: [...prev.documents[type], baseDocument],
            },
        }))
    }

    // Función para resetear formulario
    const resetForm = () => {
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
                competencies: [],
                languages: [{
                    name: '',
                    detail: { level: '' }
                }]
            },
        })
    }

    // Función de submit actualizada
    const handleSubmit = async e => {
        e.preventDefault()

        if (currentStep < 6) {
            setCurrentStep(prev => prev + 1)
            return
        }

        try {
            // Validar foto antes de enviar
            if (!formData.photo || !validateImage(formData.photo)) {
                throw new Error('Foto requerida o inválida')
            }

            await submitForm(formData, id)
        } catch (error) {
            console.error('Error submitting form:', error)
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
                                    (Paso {currentStep}/6)
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

                                                <div className="space-y-4">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Foto tipo carnet (JPG,
                                                        PNG - Máx. 2MB) *
                                                    </label>

                                                    <div
                                                        className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg 
      ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'} 
      transition-colors duration-200 cursor-pointer`}
                                                        onDragOver={e => {
                                                            e.preventDefault()
                                                            setDragActive(true)
                                                        }}
                                                        onDragLeave={() =>
                                                            setDragActive(false)
                                                        }
                                                        onDrop={e => {
                                                            e.preventDefault()
                                                            setDragActive(false)
                                                            const file =
                                                                e.dataTransfer
                                                                    .files[0]
                                                            if (
                                                                validateImage(
                                                                    file,
                                                                )
                                                            ) {
                                                                setFormData(
                                                                    prev => ({
                                                                        ...prev,
                                                                        photo: file,
                                                                    }),
                                                                )
                                                            }
                                                        }}
                                                        onClick={() =>
                                                            document
                                                                .getElementById(
                                                                    'photoInput',
                                                                )
                                                                .click()
                                                        }>
                                                        {formData.photo ? (
                                                            <>
                                                                <div className="relative group">
                                                                    <img
                                                                        src={URL.createObjectURL(
                                                                            formData.photo,
                                                                        )}
                                                                        alt="Previsualización de foto"
                                                                        className="object-cover w-32 h-32 rounded-full shadow-lg"
                                                                    />
                                                                    <div className="absolute inset-0 flex items-center justify-center transition-opacity bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100">
                                                                        <PencilIcon className="w-8 h-8 text-white" />
                                                                    </div>
                                                                </div>
                                                                <p className="mt-2 text-sm text-gray-600">
                                                                    Haz clic
                                                                    para cambiar
                                                                    la foto
                                                                </p>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <svg
                                                                    className="w-12 h-12 mb-2 text-gray-400"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24">
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="2"
                                                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                    />
                                                                </svg>
                                                                <div className="text-center">
                                                                    <p className="text-sm text-gray-600">
                                                                        <span className="font-semibold text-blue-600">
                                                                            Haz
                                                                            clic
                                                                            para
                                                                            subir
                                                                        </span>{' '}
                                                                        o
                                                                        arrastra
                                                                        aquí
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">
                                                                        Tamaño
                                                                        recomendado:
                                                                        300x300
                                                                        px
                                                                    </p>
                                                                </div>
                                                            </>
                                                        )}

                                                        <input
                                                            id="photoInput"
                                                            type="file"
                                                            name="photo"
                                                            onChange={e => {
                                                                const file =
                                                                    e.target
                                                                        .files[0]
                                                                if (
                                                                    validateImage(
                                                                        file,
                                                                    )
                                                                ) {
                                                                    setFormData(
                                                                        prev => ({
                                                                            ...prev,
                                                                            photo: file,
                                                                        }),
                                                                    )
                                                                }
                                                            }}
                                                            accept=".jpg,.jpeg,.png"
                                                            className="hidden"
                                                            required
                                                        />
                                                    </div>

                                                    {errorPhoto && (
                                                        <p className="mt-2 text-sm text-red-600">
                                                            {errorPhoto}
                                                        </p>
                                                    )}
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
                                                    {/* Nuevo campo de responsabilidades */}
                                                    <div>
                                                        <label className="block mb-1 text-sm font-medium text-gray-700">
                                                            Responsabilidades
                                                            (Una por línea) *
                                                        </label>
                                                        <textarea
                                                            value={
                                                                job.metadata
                                                                    ?.responsibilities ||
                                                                ''
                                                            }
                                                            onChange={e =>
                                                                handleDocumentChange(
                                                                    'jobs',
                                                                    index,
                                                                    'metadata',
                                                                    {
                                                                        ...job.metadata,
                                                                        responsibilities:
                                                                            e
                                                                                .target
                                                                                .value,
                                                                    },
                                                                )
                                                            }
                                                            required
                                                            className="w-full h-24 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                                            placeholder="Ej: - Desarrollo de componentes React
                                                                            - Coordinación de equipo frontend
                                                                            - Implementación de pruebas unitarias"
                                                        />
                                                        <p className="mt-1 text-xs text-gray-500">
                                                            Escribe cada
                                                            responsabilidad en
                                                            una línea separada
                                                        </p>
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
                                                                        ?.degree ||
                                                                    ''
                                                                }
                                                                onChange={e =>
                                                                    handleDocumentChange(
                                                                        'studies',
                                                                        index,
                                                                        'metadata',
                                                                        {
                                                                            ...study.metadata,
                                                                            degree: e
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

                                {/* Paso 5: Competencias */}
                                {currentStep === 5 && (
                                    <>
                                        <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                            Competencias Técnicas
                                        </h3>

                                        {formData.documents.competencies.map(
                                            (competency, index) => (
                                                <div
                                                    key={index}
                                                    className="p-4 mb-6 space-y-4 border rounded-lg">
                                                    {/* Nombre del documento de competencias */}
                                                    <div>
                                                        <label className="block mb-1 text-sm font-medium text-gray-700">
                                                            Nombre la
                                                            competencias *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={
                                                                competency.name ||
                                                                ''
                                                            }
                                                            onChange={e =>
                                                                handleDocumentChange(
                                                                    'competencies',
                                                                    index,
                                                                    'name',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            required
                                                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                                            placeholder="Ej: Competencias en Habilidades Blandas"
                                                        />
                                                    </div>

                                                    {/* Lista de competencias */}
                                                    <div>
                                                        <label className="block mb-1 text-sm font-medium text-gray-700">
                                                            Competencias (Una
                                                            por línea) *
                                                        </label>
                                                        <textarea
                                                            value={
                                                                competency.detail?.join(
                                                                    '\n',
                                                                ) || ''
                                                            }
                                                            onChange={e =>
                                                                handleDocumentChange(
                                                                    'competencies',
                                                                    index,
                                                                    'detail',
                                                                    e.target.value.split(
                                                                        '\n',
                                                                    ),
                                                                )
                                                            }
                                                            required
                                                            className="w-full h-32 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                                            placeholder="Ej: Laravel
                                    React
                                    Gestión de proyectos
                                    SQL"
                                                        />
                                                        <p className="mt-1 text-xs text-gray-500">
                                                            Lista cada
                                                            competencia en una
                                                            línea separada
                                                        </p>
                                                    </div>

                                                    {/* Botón para eliminar competencia */}
                                                    {formData.documents
                                                        .competencies.length >
                                                        1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeDocument(
                                                                    'competencies',
                                                                    index,
                                                                )
                                                            }
                                                            className="px-4 py-2 mt-2 text-sm text-red-600 bg-red-100 rounded-lg hover:bg-red-200">
                                                            Eliminar Competencia
                                                        </button>
                                                    )}
                                                </div>
                                            ),
                                        )}

                                        {/* Botón para agregar competencia */}
                                        {formData.documents.competencies
                                            .length < 3 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    addDocument('competencies')
                                                }
                                                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                                                Agregar Competencia
                                            </button>
                                        )}
                                    </>
                                )}

                                {/* Paso 6: Idiomas */}
                                {currentStep === 6 && (
                                    <>
                                        <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                            Idiomas
                                        </h3>

                                        {formData.documents.languages.map(
                                            (language, index) => (
                                                <div
                                                    key={index}
                                                    className="p-4 mb-6 space-y-4 border rounded-lg">
                                                    {/* Campo para el idioma */}
                                                    <div>
                                                        <label className="block mb-1 text-sm font-medium text-gray-700">
                                                            Idioma *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={
                                                                language.name ||
                                                                ''
                                                            }
                                                            onChange={e =>
                                                                handleDocumentChange(
                                                                    'languages',
                                                                    index,
                                                                    'name',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            required
                                                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                                            placeholder="Ej: Inglés"
                                                        />
                                                    </div>

                                                    {/* Campo para el nivel de dominio (texto) */}
                                                    <div>
                                                        <label className="block mb-1 text-sm font-medium text-gray-700">
                                                            Nivel de dominio *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={
                                                                language.detail
                                                                    ?.level ||
                                                                ''
                                                            }
                                                            onChange={e =>
                                                                handleDocumentChange(
                                                                    'languages',
                                                                    index,
                                                                    'detail',
                                                                    {
                                                                        level: e
                                                                            .target
                                                                            .value,
                                                                    },
                                                                )
                                                            }
                                                            required
                                                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                                            placeholder="Ej: Avanzado, Intermedio, Nativo, etc."
                                                        />
                                                    </div>

                                                    {/* Botón para eliminar idioma */}
                                                    {formData.documents
                                                        .languages.length >
                                                        1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeDocument(
                                                                    'languages',
                                                                    index,
                                                                )
                                                            }
                                                            className="px-4 py-2 mt-2 text-sm text-red-600 bg-red-100 rounded-lg hover:bg-red-200">
                                                            Eliminar Idioma
                                                        </button>
                                                    )}
                                                </div>
                                            ),
                                        )}

                                        {/* Botón para agregar idioma */}
                                        {formData.documents.languages.length <
                                            3 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    addDocument('languages')
                                                }
                                                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                                                Agregar Idioma
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
                                                {currentStep === 6
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
