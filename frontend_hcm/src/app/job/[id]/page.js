'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useVacancyDetail from '@/hooks/useVacancyDetail'
import useCandidateForm from '@/hooks/createCandidate'
import useIdentificacitionTypes from '@/hooks/identificationsView'
import useGenders from '@/hooks/gendersView'
import useEthnicities from '@/hooks/ethnicitiesView'
import useMaritalStatuses from '@/hooks/maritalStatusesView'
import useCountries from '@/hooks/countryView'
import JobDetailContent from './JobDetailContent'
import PersonalDataStep from './PersonalDataStep'
import JobExperienceStep from './JobExperienceStep'
import StudyData from './StudyData'
import CourseData from './CourseData'
import CompetencyData from './CompetencyData'
import LanguageData from './LanguageData'
import { GeneralModal } from '@/components/Modal'
import useCandidateValidation from '@/hooks/general/useCandidateValidation'
import StandardLoader from '@/components/StandardLoader'
import { Alert, AlertDescription } from '@/components/alert'
import { toast } from 'sonner'

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
        loading: loadingValidation,
        error: errorValidation,
        result: validationResult,
        checkCandidate,
    } = useCandidateValidation()
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
        resume: null,
        summary: '',
        documents: {
            jobs: [],
            studies: [],
            courses: [],
            competencies: [],
            languages: [
                {
                    name: '',
                    detail: { level: '' },
                },
            ],
        },
    })
    // Nuevo estado para el modal de validación
    const [showValidationModal, setShowValidationModal] = useState(false)
    const [validationData, setValidationData] = useState({
        identification_type_id: '',
        identification_value: '',
    })
    const [currentValidation, setCurrentValidation] = useState({
        type: '',
        value: '',
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
        const { name, value, files } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value,
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
            resume: null,
            summary: '',
            documents: {
                jobs: [],
                studies: [],
                courses: [],
                competencies: [],
                languages: [
                    {
                        name: '',
                        detail: { level: '' },
                    },
                ],
            },
        })
    }

    // Manejar la validación inicial
    const handleInitialValidation = async e => {
        e.preventDefault()
        try {
            // Guardar la validación actual
            setCurrentValidation({
                type: validationData.identification_type_id,
                value: validationData.identification_value,
            })

            const result = await checkCandidate(validationData, id)

            // Si no existe persona, limpiar datos
            if (!result.person_exists) {
                setFormData(prev => ({
                    ...prev,
                    first_name: '',
                    last_name: '',
                    email: '',
                    phone: '',
                    identification_value: '',
                    ethnicity_id: '',
                    identification_type_id: '',
                    marital_status_id: '',
                    gender_id: '',
                    countries_id: '',
                    birth_date: '',
                    documents: {
                        jobs: [],
                        studies: [],
                        courses: [],
                        competencies: [],
                        languages: [
                            {
                                name: '',
                                detail: { level: '' },
                            },
                        ],
                    },
                }))
            }

            if (result.error) {
                throw new Error(result.error)
            }

            if (result.is_employee) {
                throw new Error(
                    'Los empleados activos no pueden aplicar a vacantes',
                )
            }

            if (result.has_applied) {
                throw new Error('Ya has aplicado a esta vacante anteriormente')
            }

            // Precargar datos existentes
            if (result.person_exists) {
                setFormData(prev => ({
                    ...prev,
                    ...validationData,
                    ...result.person_data,
                    documents: {
                        jobs: result.documents.jobs.map(j => ({
                            name: j.document_name,
                            issue_date: j.issue_date,
                            expiration_date: j.expiration_date,
                            metadata: j.metadata ? JSON.parse(j.metadata) : {},
                        })),
                        studies: result.documents.studies.map(s => ({
                            name: s.document_name,
                            issue_date: s.issue_date,
                            expiration_date: s.expiration_date,
                            metadata: s.metadata ? JSON.parse(s.metadata) : {},
                        })),
                        courses: result.documents.courses.map(c => ({
                            name: c.document_name,
                            issue_date: c.issue_date,
                            expiration_date: c.expiration_date,
                            metadata: c.metadata ? JSON.parse(c.metadata) : {},
                        })),
                        competencies: result.documents.competencies.map(c => ({
                            name: c.document_name,
                            detail: c.detail ? JSON.parse(c.detail) : [],
                        })),
                        languages: result.documents.languages.map(l => ({
                            name: l.document_name,
                            detail: l.detail
                                ? JSON.parse(l.detail)
                                : { level: '' },
                        })),
                    },
                }))

                toast.success('Datos personales cargados exitosamente', {
                    description:
                        'Por favor verifique la información y complete los pasos restantes',
                })
            }

            setIsApplicationModalOpen(true)
        } catch (error) {
            setFormData(prev => ({
                ...prev,
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
                identification_value: '',
                ethnicity_id: '',
                identification_type_id: '',
                marital_status_id: '',
                gender_id: '',
                countries_id: '',
                birth_date: '',
                documents: {
                    jobs: [],
                    studies: [],
                    courses: [],
                    competencies: [],
                    languages: [
                        {
                            name: '',
                            detail: { level: '' },
                        },
                    ],
                },
            }))
            toast.error('Error en validación', {
                description:
                    error.message ||
                    'Error al verificar los datos del candidato',
            })
        }
    }

    // Función de submit actualizada
    const handleSubmit = async e => {
        e.preventDefault()

        try {
            if (currentStep < 6) {
                setCurrentStep(prev => prev + 1)
                return
            }

            if (!formData.photo || !validateImage(formData.photo)) {
                toast.warning('Archivo de foto requerido', {
                    description:
                        'Debe subir una imagen válida (JPG/PNG, máximo 2MB)',
                })
                return
            }

            const result = await submitForm(formData, id)

            if (result.success) {
                toast.success('Aplicación completada', {
                    description:
                        'Su postulación ha sido registrada exitosamente',
                    action: {
                        label: 'Cerrar',
                        onClick: () => {},
                    },
                })
            }
        } catch (error) {
            const errorMessage = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat().join(', ')
                : error.message || 'Error desconocido al procesar la solicitud'

            toast.error('Error en la aplicación', {
                description: errorMessage,
                action: {
                    label: 'Reintentar',
                    onClick: () => handleSubmit(e),
                },
            })
        }
    }

    useEffect(() => {
        if (validationResult?.person_exists) {
            // Verificar que coincida con la última validación realizada
            const isCurrentValidation =
                validationData.identification_type_id ===
                    currentValidation.type &&
                validationData.identification_value === currentValidation.value

            if (isCurrentValidation) {
                setFormData(prev => ({
                    ...prev,
                    identification_type_id:
                        validationData.identification_type_id,
                    identification_value: validationData.identification_value,
                    ...validationResult.person_data,
                    documents: {
                        jobs:
                            validationResult.documents.jobs?.map(item => ({
                                name: item.document_name,
                                issue_date: item.issue_date,
                                expiration_date: item.expiration_date,
                                metadata: item.metadata
                                    ? JSON.parse(item.metadata)
                                    : {},
                            })) || [],
                        studies:
                            validationResult.documents.studies?.map(item => ({
                                name: item.document_name,
                                issue_date: item.issue_date,
                                expiration_date: item.expiration_date,
                                metadata: item.metadata
                                    ? JSON.parse(item.metadata)
                                    : {},
                            })) || [],
                        courses:
                            validationResult.documents.courses?.map(item => ({
                                name: item.document_name,
                                issue_date: item.issue_date,
                                expiration_date: item.expiration_date,
                                metadata: item.metadata
                                    ? JSON.parse(item.metadata)
                                    : {},
                            })) || [],
                        competencies:
                            validationResult.documents.competencies?.map(
                                item => ({
                                    name: item.document_name,
                                    detail: item.detail
                                        ? JSON.parse(item.detail)
                                        : [],
                                }),
                            ) || [],
                        languages:
                            validationResult.documents.languages?.map(item => ({
                                name: item.document_name,
                                detail: item.detail
                                    ? JSON.parse(item.detail)
                                    : { level: '' },
                            })) || [],
                    },
                }))
            }
        }
    }, [validationResult])

    useEffect(() => {
        if (candidateResponse?.success) {
            toast.success('¡Aplicación registrada!', {
                description: 'Hemos recibido tu postulación exitosamente',
                duration: 5000,
                action: {
                    label: 'Cerrar',
                    onClick: () => {},
                },
            })
            setIsApplicationModalOpen(false)
            setCurrentStep(1)
            resetForm()
        }
    }, [candidateResponse])

    if (loading) {
        return <StandardLoader />
    }

    if (error)
        return (
            <Alert>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )

    return (
        <>
            <JobDetailContent
                vacancy={vacancy}
                handleBack={() => router.back()}
                onClick={() => setShowValidationModal(true)}
            />

            <GeneralModal
                isOpen={showValidationModal}
                onClose={() => {
                    setShowValidationModal(false)
                    // Resetear todos los datos relacionados con validación
                    setValidationData({
                        identification_type_id: '',
                        identification_value: '',
                    })
                    setCurrentValidation({ type: '', value: '' })
                    setFormData(prev => ({
                        ...prev,
                        // Limpiar solo campos sensibles, mantener vacancy_id
                        first_name: '',
                        last_name: '',
                        email: '',
                        phone: '',
                        identification_value: '',
                        ethnicity_id: '',
                        identification_type_id: '',
                        marital_status_id: '',
                        gender_id: '',
                        countries_id: '',
                        birth_date: '',
                        documents: {
                            jobs: [],
                            studies: [],
                            courses: [],
                            competencies: [],
                            languages: [
                                {
                                    name: '',
                                    detail: { level: '' },
                                },
                            ],
                        },
                    }))
                }}
                title="Verificación de Identidad"
                size="lg"
                titleStyle="text-[#004b9a] text-2xl font-bold border-b-2 border-[#004b9a] pb-2"
                actions={
                    <div className="flex justify-end w-full gap-3">
                        <button
                            type="button"
                            onClick={() => setShowValidationModal(false)}
                            className="px-6 py-2 text-[#004b9a] border border-[#004b9a] rounded-lg hover:bg-blue-50 transition-colors duration-200">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            form="validation-form"
                            className="px-6 py-2 text-white bg-[#004b9a] rounded-lg hover:bg-[#003a7d] transition-colors duration-200 flex items-center justify-center gap-2"
                            disabled={loadingValidation}>
                            {loadingValidation && (
                                <svg
                                    className="w-5 h-5 text-white animate-spin"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24">
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {loadingValidation ? 'Validando...' : 'Continuar'}
                        </button>
                    </div>
                }>
                <form id="validation-form" onSubmit={handleInitialValidation}>
                    <div className="space-y-6">
                        {/* Mensaje de ayuda */}
                        <div className="p-4 rounded-lg bg-blue-50">
                            <p className="text-sm text-[#004b9a] flex items-start gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5 shrink-0"
                                    viewBox="0 0 24 24"
                                    fill="currentColor">
                                    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z" />
                                </svg>
                                <span>
                                    Para continuar con tu postulación,
                                    necesitamos validar tu identidad.
                                    <br />
                                    <span className="text-xs opacity-80">
                                        Este proceso es seguro y tus datos están
                                        protegidos.
                                    </span>
                                </span>
                            </p>
                        </div>

                        {errorValidation && (
                            <div className="flex items-center gap-2 p-3 mb-4 text-red-700 border border-red-200 rounded-lg bg-red-50">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5"
                                    viewBox="0 0 24 24"
                                    fill="currentColor">
                                    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z" />
                                </svg>
                                <span>{errorValidation.message}</span>
                            </div>
                        )}

                        <div className="space-y-6">
                            {/* Campo Tipo de Documento */}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    Tipo de Documento *
                                    <span className="ml-1 text-xs text-gray-500">
                                        (Requerido)
                                    </span>
                                </label>
                                <div className="relative">
                                    <select
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004b9a] focus:border-[#004b9a] outline-none transition-all appearance-none pr-10"
                                        value={
                                            validationData.identification_type_id
                                        }
                                        onChange={e =>
                                            setValidationData(prev => ({
                                                ...prev,
                                                identification_type_id:
                                                    e.target.value,
                                            }))
                                        }
                                        required>
                                        <option value="">
                                            Selecciona tu tipo de documento...
                                        </option>
                                        {identifications.map(iden => (
                                            <option
                                                key={iden.id}
                                                value={iden.id}>
                                                {iden.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 pointer-events-none"></div>
                                </div>
                            </div>

                            {/* Campo Número de Documento */}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    Número de Documento *
                                    <span className="ml-1 text-xs text-gray-500">
                                        (Requerido)
                                    </span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004b9a] focus:border-[#004b9a] outline-none transition-all"
                                        value={
                                            validationData.identification_value
                                        }
                                        onChange={e =>
                                            setValidationData(prev => ({
                                                ...prev,
                                                identification_value:
                                                    e.target.value,
                                            }))
                                        }
                                        placeholder="Ej: 12345678"
                                        required
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <svg
                                            className="w-5 h-5 text-gray-400"
                                            fill="currentColor"
                                            viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Texto de seguridad */}
                        <div className="pt-4 text-center border-t border-gray-200">
                            <p className="text-xs text-gray-500">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="inline-block w-4 h-4 mr-1"
                                    viewBox="0 0 24 24"
                                    fill="currentColor">
                                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                                </svg>
                                Tus datos están protegidos bajo nuestra política
                                de seguridad
                            </p>
                        </div>
                    </div>
                </form>
            </GeneralModal>

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
                                    <PersonalDataStep
                                        formData={formData}
                                        handleChange={handleChange}
                                        setFormData={setFormData} // Nueva prop
                                        identifications={identifications}
                                        genders={genders}
                                        ethnicities={ethnicities}
                                        marital={marital}
                                        countries={countries}
                                        errorPhoto={errorPhoto}
                                        validateImage={validateImage}
                                        dragActive={dragActive}
                                        setDragActive={setDragActive}
                                    />
                                )}

                                {/* Paso 2: Empleos */}
                                {currentStep === 2 && (
                                    <JobExperienceStep
                                        formData={formData}
                                        handleDocumentChange={
                                            handleDocumentChange
                                        }
                                        removeDocument={removeDocument}
                                        addDocument={addDocument}
                                    />
                                )}

                                {/* Paso 3: Estudios */}
                                {currentStep === 3 && (
                                    <StudyData
                                        formData={formData}
                                        handleDocumentChange={
                                            handleDocumentChange
                                        }
                                        removeDocument={removeDocument}
                                        addDocument={addDocument}
                                    />
                                )}

                                {/* Paso 4: Cursos */}
                                {currentStep === 4 && (
                                    <CourseData
                                        formData={formData}
                                        handleDocumentChange={
                                            handleDocumentChange
                                        }
                                        removeDocument={removeDocument}
                                        addDocument={addDocument}
                                    />
                                )}

                                {/* Paso 5: Competencias */}
                                {currentStep === 5 && (
                                    <CompetencyData
                                        formData={formData}
                                        handleDocumentChange={
                                            handleDocumentChange
                                        }
                                        removeDocument={removeDocument}
                                        addDocument={addDocument}
                                    />
                                )}

                                {/* Paso 6: Idiomas */}
                                {currentStep === 6 && (
                                    <LanguageData
                                        formData={formData}
                                        handleDocumentChange={
                                            handleDocumentChange
                                        }
                                        removeDocument={removeDocument}
                                        addDocument={addDocument}
                                    />
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
