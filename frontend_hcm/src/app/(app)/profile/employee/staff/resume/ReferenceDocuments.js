'use client'

import { useState, useEffect } from 'react'
import useEmployeeReferences from '@/hooks/useEmployeeReference'
import { Skeleton } from '@/components/skeleton'
import { Alert, AlertDescription } from '@/components/alert'
import { Modal } from '@/components/Modal'
import writtenNumber from 'written-number'
import { PDFDownloadLink } from '@react-pdf/renderer'
import PDFReferenceDocument from '@/components/PDFReferenceDocument'
import StandardLoader from '@/components/StandardLoader'

const ReferenceDocuments = () => {
    const {
        references,
        getReferences,
        createReference,
        isLoading,
        error,
        pagination: { currentPage, totalPages },
    } = useEmployeeReferences()

    const [selectedReference, setSelectedReference] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formError, setFormError] = useState(null)
    const [validationErrors, setValidationErrors] = useState({})

    const [formData, setFormData] = useState({
        referrer_name: '',
        referrer_identification: '',
        issue_date: '',
    })

    const handleInputChange = e => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        setValidationErrors(prev => ({ ...prev, [name]: null }))
    }

    useEffect(() => {
        getReferences(1) // Forzar carga inicial con página 1
    }, []) // <- Ejecutar solo al montar

    const generateReferenceText = reference => {
        // Función para parsear fechas en formato "DD-MM-AAAA HH:mm"
        const parseCustomDate = dateString => {
            const [datePart, timePart] = dateString.split(' ')
            const [day, month, year] = datePart.split('-')
            return new Date(`${year}-${month}-${day}T${timePart}`)
        }

        // Formateador de fechas
        const formatDate = dateString => {
            const date = parseCustomDate(dateString)
            return date
                .toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                })
                .replace(/\//g, ' de ')
        }

        // Obtener componentes de fecha válidos
        const docDate = parseCustomDate(reference.document_created_at)

        return `
    <div class="font-sans text-[13px] leading-[1.6] text-justify">
        <p class="text-right font-bold uppercase mb-4">El Valle del Espíritu Santo, ${formatDate(reference.document_created_at)}</p>
    
        <p class="mb-4">
            Señores:<br>
            <span class="font-bold block">${process.env.NEXT_PUBLIC_COMPANY_NAME?.toUpperCase() || '[NOMBRE DE LA EMPRESA]'},</span>
            <span class="font-bold block">${reference.department_name?.toUpperCase() || '[NOMBRE DEL DEPARTAMENTO]'},</span>
            Presente
        </p>
    
        <h2 class="text-center font-bold uppercase mb-6">REFERENCIA PERSONAL</h2>
    
        <p class="mb-4 pl-8">
            Yo <span class="font-bold">${reference.referrer_name.toUpperCase()}</span>, titular de la cédula de identidad No. 
            <span class="font-bold">${reference.referrer_identification}</span>, venezolana, mayor de edad, por medio de la presente hago constar 
            que conozco de vista y trato al ciudadano/a <span class="font-bold">${reference.person.full_name.toUpperCase()}</span>, 
            cédula de identidad No. <span class="font-bold">${reference.person.identification_type} - ${reference.person.identification_value}</span>, 
            desde hace <span class="font-bold">${reference.years_known} (${writtenNumber(reference.years_known, { lang: 'es' })})</span> años, 
            por lo que doy fe de ser una persona responsable y cumplidora de sus obligaciones.
        </p>
    
        <p class="mb-8 pl-8">
            Constancia que expido a petición de parte interesada, en El Valle a los 
            <span class="font-bold">${docDate.getDate()}</span> días del mes de 
            <span class="font-bold">${docDate.toLocaleString('es-ES', { month: 'long' })}</span> de 
            <span class="font-bold">${docDate.getFullYear()}</span>.
        </p>
    
        <div class="text-right space-y-6">
            <p class="font-bold">Atentamente,</p>
            <br>
            <div class="border-t-2 border-black w-48 inline-block"></div>
            <p class="font-bold">${reference.referrer_name.toUpperCase()}<br>
            C.I No. ${reference.referrer_identification}</p>
            
            <p class="text-sm">Dirección: ${process.env.NEXT_PUBLIC_COMPANY_ADDRESS}</p>
        </div>
    </div>
        `
    }

    const handleCreateReference = async () => {
        try {
            await createReference({
                ...formData,
                document_name: 'Referencia Personal',
                metadata: {
                    referrer_name: formData.referrer_name,
                    referrer_identification: formData.referrer_identification,
                },
            })

            setIsModalOpen(false)
            getReferences(currentPage)
            setFormData({
                referrer_name: '',
                referrer_identification: '',
                issue_date: '',
            })
        } catch (error) {
            setFormError(error.message || 'Error al crear la referencia')
        }
    }

    if (isLoading) return <StandardLoader />

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
                                    Nueva Referencia Personal
                                </h2>

                                {formError && (
                                    <Alert variant="destructive">
                                        <AlertDescription>
                                            {formError}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <div className="grid gap-4 md:grid-cols-2">
                                    {[
                                        {
                                            label: 'Nombre del Referente',
                                            name: 'referrer_name',
                                        },
                                        {
                                            label: 'Cédula Referente',
                                            name: 'referrer_identification',
                                        },
                                        {
                                            label: 'Fecha de Emisión',
                                            name: 'issue_date',
                                            type: 'date',
                                        },
                                    ].map((field, index) => (
                                        <div key={index} className="space-y-2">
                                            <label className="block text-sm font-medium">
                                                {field.label} *
                                            </label>
                                            <input
                                                type={field.type || 'text'}
                                                name={field.name}
                                                value={formData[field.name]}
                                                className={`w-full p-2 border rounded ${
                                                    validationErrors[field.name]
                                                        ? 'border-red-500'
                                                        : ''
                                                }`}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-end gap-2 mt-4">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200">
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleCreateReference}
                                        className="px-4 py-2 text-white bg-[#004b9a] rounded hover:bg-[#003a7a]">
                                        Guardar Referencia
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>

            {/* Modal de Vista Previa */}
            <Modal
                isOpen={!!selectedReference}
                onClose={() => setSelectedReference(null)}
                maxWidth="2xl">
                {selectedReference && (
                    <div className="p-6 bg-white rounded-lg max-h-[80vh] overflow-y-auto scrollbar-none">
                        <div
                            className="space-y-4 text-justify text-gray-700"
                            style={{
                                fontFamily: 'Arial',
                                fontSize: '13px',
                                lineHeight: '1.6',
                                padding: '0.2in', // Márgenes internos para simular página
                            }}>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: generateReferenceText(
                                        selectedReference,
                                    ),
                                }}
                            />
                        </div>

                        <div className="flex justify-between gap-4 mt-6">
                            <button
                                onClick={() => setSelectedReference(null)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg">
                                Cerrar
                            </button>
                            <PDFDownloadLink
                                document={
                                    <PDFReferenceDocument
                                        reference={selectedReference}
                                    />
                                }
                                fileName="referencia_personal.pdf">
                                {({ loading }) => (
                                    <button
                                        className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                                        disabled={loading}>
                                        {loading
                                            ? 'Generando PDF...'
                                            : '⬇ Descargar PDF'}
                                    </button>
                                )}
                            </PDFDownloadLink>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Encabezado */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                    Referencias Personales
                </h2>
                <div className="flex gap-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 text-white bg-[#004b9a] rounded-lg hover:bg-[#003a7a]">
                        + Nueva Referencia
                    </button>
                    <button
                        onClick={() => getReferences(currentPage)}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                        disabled={isLoading}>
                        {isLoading ? 'Actualizando...' : '⟳ Actualizar'}
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2].map(i => (
                        <Skeleton key={i} className="w-full h-24 rounded-lg" />
                    ))}
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {references.map(reference => (
                        <div
                            key={reference.id}
                            onClick={() => setSelectedReference(reference)}
                            className="p-4 transition-shadow bg-white border border-gray-100 rounded-lg shadow-md cursor-pointer hover:shadow-lg">
                            <h3 className="mb-2 text-lg font-semibold">
                                {reference.document_name}
                            </h3>
                            <div className="space-y-1 text-sm">
                                <p className="text-gray-600">
                                    <span className="font-medium">
                                        Referente:
                                    </span>
                                    {reference.referrer_name}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">Cédula:</span>
                                    {reference.referrer_identification}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">Fecha:</span>
                                    {reference.issue_date}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Paginación */}
            <div className="flex justify-between gap-4 mt-4">
                <button
                    onClick={() => getReferences(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-white bg-blue-500 rounded-lg disabled:opacity-50">
                    Anterior
                </button>
                <span className="text-sm text-gray-600">
                    Página {currentPage} de {totalPages}
                </span>
                <button
                    onClick={() => getReferences(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-white bg-blue-500 rounded-lg disabled:opacity-50">
                    Siguiente
                </button>
            </div>
        </div>
    )
}

export default ReferenceDocuments
