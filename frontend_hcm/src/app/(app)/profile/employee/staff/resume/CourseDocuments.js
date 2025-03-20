'use client'

import { useState } from 'react'
import useCourses from '@/hooks/useCourses'
import { Skeleton } from '@/components/skeleton'
import { Alert, AlertDescription } from '@/components/alert'
import { Modal } from '@/components/Modal'
import axios from '@/lib/axios'
import StandardLoader from '@/components/StandardLoader'

const CourseDocuments = () => {
    const {
        documents,
        loading,
        error,
        refresh,
        currentPage,
        totalPages,
        goToNextPage,
        goToPrevPage,
    } = useCourses()
    const [selectedDocument, setSelectedDocument] = useState(null)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formError, setFormError] = useState(null)
    const [validationErrors, setValidationErrors] = useState({})

    const [formData, setFormData] = useState({
        document_name: '',
        hours: '',
        instructor: '',
        issue_date: '',
        expiration_date: '',
        file_path: null, // Para manejar subida de archivos
    })

    const handleInputChange = e => {
        const { name, value, files } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value,
        }))
        // Limpiar errores al modificar
        setValidationErrors(prev => ({ ...prev, [name]: null }))
    }

    const handleCreateEmployment = async () => {
        try {
            const formPayload = new FormData()

            // Mapear campos según estructura del backend
            formPayload.append('document_name', formData.document_name)
            formPayload.append('hours', formData.hours)
            formPayload.append('instructor', formData.instructor)
            formPayload.append('issue_date', formData.issue_date)
            formPayload.append('expiration_date', formData.expiration_date)
            if (formData.file_path) {
                formPayload.append('file', formData.file_path)
            }

            const response = await axios.post(
                '/api/documents/courses',
                formPayload,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            )

            if (response.status === 201) {
                setIsModalOpen(false)
                refresh(currentPage)
                setFormData({
                    document_name: '',
                    hours: '',
                    instructor: '',
                    issue_date: '',
                    expiration_date: '',
                    file_path: null,
                })
            }
        } catch (error) {
            if (error.response?.data?.errors) {
                setValidationErrors(error.response.data.errors)
            } else {
                setFormError(
                    error.response?.data?.message || 'Error al crear el empleo',
                )
            }
        }
    }

    if (loading) return <StandardLoader />

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )
    }

    return (
        <div className="space-y-4">
            <div className="space-y-4">
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false)
                        setFormError(null)
                        setValidationErrors({})
                    }}>
                    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="flex flex-col w-full max-w-2xl h-[70vh] p-6 bg-white rounded-lg overflow-auto scrollbar-none">
                            <div className="p-6 space-y-4">
                                <h2 className="text-2xl font-bold">
                                    Nuevo Registro de Curso
                                </h2>

                                {formError && (
                                    <Alert variant="destructive">
                                        <AlertDescription>
                                            {formError}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">
                                            Nombre del curso *
                                        </label>
                                        <input
                                            type="text"
                                            name="document_name"
                                            value={formData.document_name}
                                            className={`w-full p-2 border rounded ${
                                                validationErrors.document_name
                                                    ? 'border-red-500'
                                                    : ''
                                            }`}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        {validationErrors.document_name && (
                                            <span className="text-sm text-red-500">
                                                {
                                                    validationErrors
                                                        .document_name[0]
                                                }
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">
                                            Horas del curso *
                                        </label>
                                        <input
                                            type="number"
                                            name="hours"
                                            value={formData.hours}
                                            className={`w-full p-2 border rounded ${
                                                validationErrors.hours
                                                    ? 'border-red-500'
                                                    : ''
                                            }`}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        {validationErrors.hours && (
                                            <span className="text-sm text-red-500">
                                                {
                                                    validationErrors
                                                        .hours[0]
                                                }
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">
                                            Instructor *
                                        </label>
                                        <input
                                            type="text"
                                            name="instructor"
                                            value={formData.instructor}
                                            className={`w-full p-2 border rounded ${
                                                validationErrors.instructor
                                                    ? 'border-red-500'
                                                    : ''
                                            }`}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        {validationErrors.instructor && (
                                            <span className="text-sm text-red-500">
                                                {validationErrors.instructor[0]}
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">
                                            Fecha de Inicio *
                                        </label>
                                        <input
                                            type="date"
                                            name="issue_date"
                                            value={formData.issue_date}
                                            max={formData.expiration_date || ''}
                                            className={`w-full p-2 border rounded ${
                                                validationErrors.issue_date
                                                    ? 'border-red-500'
                                                    : ''
                                            }`}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        {validationErrors.issue_date && (
                                            <span className="text-sm text-red-500">
                                                {validationErrors.issue_date[0]}
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">
                                            Fecha de Finalización
                                        </label>
                                        <input
                                            type="date"
                                            name="expiration_date"
                                            value={formData.expiration_date}
                                            min={formData.issue_date || ''}
                                            className={`w-full p-2 border rounded ${
                                                validationErrors.expiration_date
                                                    ? 'border-red-500'
                                                    : ''
                                            }`}
                                            onChange={handleInputChange}
                                        />
                                        {validationErrors.expiration_date && (
                                            <span className="text-sm text-red-500">
                                                {
                                                    validationErrors
                                                        .expiration_date[0]
                                                }
                                            </span>
                                        )}
                                    </div>
                                </div>

                            
                                <div className="flex justify-end gap-2 mt-4">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200">
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleCreateEmployment}
                                        className="px-4 py-2 text-white bg-[#004b9a] rounded hover:bg-[#003a7a]">
                                        Guardar Curso
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>

            </div>
            {/* Modal para detalles del empleo */}
            <Modal
                isOpen={!!selectedDocument}
                onClose={() => setSelectedDocument(null)}>
                {selectedDocument && (
                    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="flex flex-col w-full max-w-2xl h-[70vh] p-6 bg-white rounded-lg overflow-auto scrollbar-none">
                            {/* Título */}
                            <h2 className="mb-4 text-2xl font-bold">
                                {selectedDocument.document_name}
                            </h2>

                            {/* Información general */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <p className="font-medium">Horas:</p>
                                    <p className="text-gray-600">
                                        {selectedDocument.hours}
                                    </p>
                                </div>

                                <div>
                                    <p className="font-medium">Instructor:</p>
                                    <p className="text-gray-600">
                                        {selectedDocument.instructor || 'No especificado'}
                                    </p>
                                </div>

                                <div>
                                    <p className="font-medium">
                                        Fecha de Inicio:
                                    </p>
                                    <p className="text-gray-600">
                                        {selectedDocument.issue_date}
                                    </p>
                                </div>

                                <div>
                                    <p className="font-medium">
                                        Fecha de Finalización:
                                    </p>
                                    <p className="text-gray-600">
                                        {selectedDocument.expiration_date ||
                                            'Presente'}
                                    </p>
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div className="flex justify-between mt-6">
                                <button
                                    onClick={() => setSelectedDocument(null)}
                                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">
                                    Cerrar
                                </button>
                                <button
                                    className="px-4 py-2 text-white bg-[#004b9a] rounded-lg hover:bg-[#003a7a]"
                                    onClick={() =>
                                        console.log('Descargar documento')
                                    }>
                                    Descargar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Encabezado */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Listado de Cursos</h2>
                <div className="flex gap-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 text-white bg-[#004b9a] rounded-lg hover:bg-[#003a7a]"
                    >
                        + Nuevo Curso
                    </button>
                    <button
                        onClick={() => refresh(currentPage)}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                        disabled={loading}
                    >
                        {loading ? 'Actualizando...' : '⟳ Actualizar'}
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2].map(i => (
                        <Skeleton key={i} className="w-full h-24 rounded-lg" />
                    ))}
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {documents.map(doc => (
                        <div
                            key={doc.id}
                            onClick={() => setSelectedDocument(doc)}
                            className="p-4 transition-shadow bg-white border border-gray-100 rounded-lg shadow-md cursor-pointer hover:shadow-lg">
                            <h3 className="mb-2 text-lg font-semibold">
                                {doc.document_name}
                            </h3>
                            <div className="space-y-1 text-sm">
                                <p className="text-gray-600">
                                    <span className="font-medium">
                                        Horas
                                    </span>{' '}
                                    {doc.hours}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">
                                        Periodo:
                                    </span>{' '}
                                    {doc.issue_date} - {' '}
                                    {doc.expiration_date || 'Presente'}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">
                                        Instructor:
                                    </span>{' '}
                                    {doc.instructor || 'No especificado'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Controles de paginación */}
            <div className="flex items-center justify-between mt-4">
                <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-white bg-blue-500 rounded-lg disabled:opacity-50">
                    Anterior
                </button>
                <span className="text-sm text-gray-600">
                    Página {currentPage} de {totalPages}
                </span>
                <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-white bg-blue-500 rounded-lg disabled:opacity-50">
                    Siguiente
                </button>
            </div>
        </div>
    )
}

export default CourseDocuments