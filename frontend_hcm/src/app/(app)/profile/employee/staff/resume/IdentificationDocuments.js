import { useState } from 'react'
import useIdentifications from '@/hooks/useIdentifications'
import { Skeleton } from '@/components/skeleton'
import { Alert, AlertDescription } from '@/components/alert'
import Modal from '@/components/Modal'
import axios from '@/lib/axios'

const IdentificationDocuments = () => {
    const {
        documents,
        loading,
        error,
        refresh,
        currentPage,
        totalPages,
        goToNextPage,
        goToPrevPage,
    } = useIdentifications()
    const [selectedDocument, setSelectedDocument] = useState(null)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formError, setFormError] = useState(null)
    const [validationErrors, setValidationErrors] = useState({})

    const [formData, setFormData] = useState({
        document_name: '',
        id_type: '',
        id_number: '',
        id_issuer: '',
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
            formPayload.append('id_type', formData.id_type)
            formPayload.append('id_number', formData.id_number)
            formPayload.append('id_issuer', formData.id_issuer)
            formPayload.append('issue_date', formData.issue_date)
            formPayload.append('expiration_date', formData.expiration_date)
            if (formData.file_path) {
                formPayload.append('file', formData.file_path)
            }

            const response = await axios.post(
                '/api/documents/identifications',
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
                    id_type: '',
                    id_number: '',
                    id_issuer: '',
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
                                    Nueva Identificación
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
                                            Identificación *
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
                                            placeholder="Ej. Cédula de Identidad"
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
                                            Tipo *
                                        </label>
                                        <input
                                            type="text"
                                            name="id_type"
                                            value={formData.id_type}
                                            className={`w-full p-2 border rounded ${
                                                validationErrors.id_type
                                                    ? 'border-red-500'
                                                    : ''
                                            }`}
                                            onChange={handleInputChange}
                                            placeholder="Ej. V"
                                            required
                                        />
                                        {validationErrors.id_type && (
                                            <span className="text-sm text-red-500">
                                                {
                                                    validationErrors
                                                        .id_type[0]
                                                }
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">
                                            Número de Identificación *
                                        </label>
                                        <input
                                            type="text"
                                            name="id_number"
                                            value={formData.id_number}
                                            className={`w-full p-2 border rounded ${
                                                validationErrors.id_number
                                                    ? 'border-red-500'
                                                    : ''
                                            }`}
                                            onChange={handleInputChange}
                                            placeholder="Ej. 12345678"
                                            required
                                        />
                                        {validationErrors.id_number && (
                                            <span className="text-sm text-red-500">
                                                {
                                                    validationErrors
                                                        .id_number[0]
                                                }
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">
                                            Institución
                                            *
                                        </label>
                                        <input
                                            type="text"
                                            name="id_issuer"
                                            value={formData.id_issuer}
                                            className={`w-full p-2 border rounded ${
                                                validationErrors.id_issuer
                                                    ? 'border-red-500'
                                                    : ''
                                            }`}
                                            onChange={handleInputChange}
                                            placeholder="Ej. SAIME"
                                            required
                                        />
                                        {validationErrors.id_issuer && (
                                            <span className="text-sm text-red-500">
                                                {
                                                    validationErrors
                                                        .id_issuer[0]
                                                }
                                            </span>
                                        )}
                                    </div>


                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">
                                            Fecha de Expedición *
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
                                            Fecha de Expiración *
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
                                            required
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
                                        Guardar Identificación
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
                                    <p className="font-medium">
                                        Identificación:
                                    </p>
                                    <p className="text-gray-600">
                                        {selectedDocument.id_type} - {' '}
                                        {selectedDocument.id_number}
                                    </p>
                                </div>

                                <div>
                                    <p className="font-medium">
                                        Institución:
                                    </p>
                                    <p className="text-gray-600">
                                        {selectedDocument.id_issuer ||
                                            'No especificado'}
                                    </p>
                                </div>

                                <div>
                                    <p className="font-medium">
                                        Fecha de Expedición:
                                    </p>
                                    <p className="text-gray-600">
                                        {selectedDocument.issue_date}
                                    </p>
                                </div>

                                <div>
                                    <p className="font-medium">
                                        Fecha de Expiración:
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
                <h2 className="text-xl font-semibold">Identificaciones</h2>
                <div className="flex gap-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 text-white bg-[#004b9a] rounded-lg hover:bg-[#003a7a]"
                    >
                        + Nueva Identificación
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
                                        Identificación:
                                    </span>{' '}
                                    {doc.id_type || 'No especificado'} - {' '}
                                    {doc.id_number || 'No especificado'}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">
                                        Institución:
                                    </span>{' '}
                                    {doc.id_issuer || 'No especificado'}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">
                                        Periodo:
                                    </span>{' '}
                                    {doc.issue_date} - {' '}
                                    {doc.expiration_date || 'Presente'}
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

export default IdentificationDocuments
