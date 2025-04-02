'use client'

import React, { useState, useEffect } from 'react'
import StandardTable from '@/components/StandardTable'
import {
    useDeleteEmployeeRequest,
    useEmployeeRequestDetails,
    useEmployeeRequests,
} from '@/hooks/employee/useEmployeeRequests'
import { EyeIcon, PencilIcon, PlusCircle, TrashIcon } from 'lucide-react'
import { Modal } from '@/components/Modal'
import CreateRequestForm from './CreateRequestForm'
import { Alert, AlertDescription } from '@/components/alert'
import EditRequestForm from './EditRequestForm'
import StandardLoader from '@/components/StandardLoader'
import BadgeRequest from '@/components/BadgeRequest'
import { toast } from 'sonner'

const EmployeeRequestsPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedRequest, setSelectedRequest] = useState(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const {
        requests,
        pagination,
        loading,
        error,
        currentPage,
        handlePageChange,
        refetch,
    } = useEmployeeRequests()
    const { deleteRequest, error: errorDelete } = useDeleteEmployeeRequest()
    const [detailModalOpen, setDetailModalOpen] = useState(false)
    const [selectedRequestId, setSelectedRequestId] = useState(null)
    const { data: requestDetails, loading: detailLoading, error: detailError } = useEmployeeRequestDetails(selectedRequestId)

    // Manejar errores temporales
    useEffect(() => {
        if (errorDelete) {
            setErrorMessage(errorDelete.message)
            const timer = setTimeout(() => setErrorMessage(null), 5000)
            return () => clearTimeout(timer)
        }
    }, [errorDelete])

    const handleDelete = async item => {
        setSelectedRequest(item)
        setShowDeleteModal(true)
    }

    const confirmDelete = async () => {
        try {
            await deleteRequest(selectedRequest.id)
            await refetch()
        } catch (error) {
            toast.error('Error al Eliminar')
        } finally {
            setShowDeleteModal(false)
            setSelectedRequest(null)
        }
    }

    // Definición de columnas de la tabla
    const columns = [
        {
            header: 'Tipo de Solicitud',
            accessor: 'tipo',
        },
        {
            header: 'Descripción',
            accessor: 'descripcion',
        },
        {
            header: 'Estado',
            accessor: 'estatus',
            render: item => <BadgeRequest>{item.estatus}</BadgeRequest>
        },
        {
            header: 'Fecha de Solicitud',
            accessor: 'fecha_solicitud',
        },
    ]

    

    const handleSuccess = () => {
        refetch() // Actualizar tabla después de crear
        setIsModalOpen(false) // Cerrar modal
    }

    // Manejo de estados de carga y error
    if (loading) return <StandardLoader />

    if (error)
        return (
            <div className="p-6 text-red-500">
                Error: {error.message || 'Error al cargar las solicitudes'}
            </div>
        )

    return (
        <div className="p-6 ml-8">
            {/* Mensaje de error flotante */}
            {errorMessage && (
                <div className="fixed z-50 top-4 right-4">
                    <Alert variant="destructive">
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                </div>
            )}

            {/* Modal de detalle */}
            <Modal isOpen={detailModalOpen} onClose={() => setDetailModalOpen(false)}>
                {detailLoading && <div>Cargando detalles...</div>}
                {detailError && (
                    <div className="text-red-500">
                        Error: {detailError.message}
                    </div>
                )}
                {requestDetails && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">Detalles de Solicitud</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="font-medium">Tipo:</label>
                                <p>{requestDetails.tipo}</p>
                            </div>
                            <div>
                                <label className="font-medium">Estado:</label>
                                <p>{requestDetails.estatus}</p>
                            </div>
                            <div className="col-span-2">
                                <label className="font-medium">Descripción:</label>
                                <p className="whitespace-pre-wrap">{requestDetails.descripcion}</p>
                            </div>
                            <div>
                                <label className="font-medium">Solicitado el:</label>
                                <p>{requestDetails.detalles.solicitado_el}</p>
                            </div>
                            <div>
                                <label className="font-medium">Última actualización:</label>
                                <p>{requestDetails.detalles.ultima_actualizacion}</p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
            
            {/* Modal de confirmación de eliminación */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}>
                <div className="p-6 space-y-4">
                    <h3 className="text-lg font-semibold">
                        Confirmar Cancelación
                    </h3>
                    <p>
                        ¿Estás seguro de cancelar la solicitud de{' '}
                        {selectedRequest?.tipo}?
                    </p>
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                            Cancelar
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700">
                            Confirmar
                        </button>
                    </div>
                </div>
            </Modal>
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-2 bg-[#004b9a] text-white rounded-lg hover:bg-[#003a7a] transition-colors flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Nueva Solicitud
                </button>
            </div>
            <StandardTable
                title="Mis Solicitudes"
                columns={columns}
                data={requests}
                loading={loading}
                currentPage={currentPage}
                totalPages={pagination.last_page}
                onPageChange={handlePageChange}
                filters={[
                    {
                        name: 'status',
                        placeholder: 'Filtrar por estado',
                        value: '',
                        options: [
                            { value: '', label: 'Todos' },
                            { value: 'Pendiente', label: 'Pendientes' },
                            { value: 'Aprobado', label: 'Aprobados' },
                            { value: 'Rechazado', label: 'Rechazados' },
                        ],
                    },
                ]}
                onFilterChange={e => {
                    // Implementar lógica de filtrado si es necesario
                    toast.info('Filtro aplicado:', e.target.value)
                }}
                actions={[
                    {
                        icon: <EyeIcon className="w-4 h-4" />,
                        color: 'text-blue-600',
                        handler: item => {
                            setSelectedRequestId(item.id)
                            setDetailModalOpen(true)
                        }
                    },
                    {
                        icon: <PencilIcon className="w-4 h-4" />,
                        color: 'text-green-600',
                        handler: item => {
                            if (item.estatus === 'Pendiente') {
                                setSelectedRequest(item)
                                setEditModalOpen(true)
                            }
                        },
                        disiable: item => item.estatus !== 'Pendiente' ? 'hidden' : ''
                    },
                    {
                        icon: <TrashIcon className="w-4 h-4" />,
                        color: 'text-red-600',
                        handler: item => handleDelete(item),
                        disabled: item => !['Pendiente', 'Rechazado'].includes(item.estatus)
                    }
                ]}
            />
            <Modal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}>
                {selectedRequest && (
                    <EditRequestForm
                        request={selectedRequest}
                        onSuccess={() => {
                            refetch()
                            setEditModalOpen(false)
                        }}
                        onCancel={() => setEditModalOpen(false)}
                    />
                )}
            </Modal>
            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <CreateRequestForm
                    onSuccess={handleSuccess}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    )
}

export default EmployeeRequestsPage
