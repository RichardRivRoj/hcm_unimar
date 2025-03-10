'use client'

import React, { useCallback, useEffect, useState } from 'react'
import StandardTable from '@/components/StandardTable'
import useEvaluationPeriods from '@/hooks/admin/useEvaluationPeriods'
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import Button from '@/components/Button'
import { PlusCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/alert'
import Modal from '@/components/Modal'
import PeriodForm from './PeriodForm'
import EditPeriodForm from './EditPeriodForm '
import ConfirmationModal from '@/components/ConfirmationModal'

const PlanningPage = () => {
    const {
        periods,
        meta,
        loading,
        error,
        fetchEvaluationPeriods,
        deleteEvaluationPeriod,
    } = useEvaluationPeriods()
    const [currentFilters, setCurrentFilters] = useState({
        status_id: '',
        period: '',
    })
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedPeriod, setSelectedPeriod] = useState(null)
    const [selectedPeriodId, setSelectedPeriodId] = useState(null)

    const handleDelete = useCallback(period => {
        setSelectedPeriod(period)
        setIsDeleteModalOpen(true)
    }, [])

    const handleConfirmDelete = async () => {
        try {
            await deleteEvaluationPeriod(selectedPeriod.id);
            setIsDeleteModalOpen(false);
            setSelectedPeriod(null);
            fetchEvaluationPeriods(); // Recargar la lista
        } catch (error) {
            console.error('Error eliminando:', error.message);
        }
    };

    const handleEdit = useCallback(period => {
        if (period && period.id) {
            setSelectedPeriod(period)
            setIsEditModalOpen(true)
        }
    }, [])

    const handleUpdateSuccess = useCallback(() => {
        setIsEditModalOpen(false)
        setSelectedPeriod(null)
        fetchEvaluationPeriods()
    }, [fetchEvaluationPeriods])

    // Columnas de la tabla
    const columns = [
        {
            header: 'Nombre',
            accessor: 'name',
        },
        {
            header: 'Fecha Inicio',
            accessor: 'start_date',
        },
        {
            header: 'Fecha Fin',
            accessor: 'end_date',
        },
        {
            header: 'Estatus',
            accessor: 'status',
            render: item => item.status.name,
        },
    ]

    // Filtros disponibles
    const filters = [
        {
            name: 'status_id',
            placeholder: 'Filtrar por estatus',
            options: [
                { value: 1, label: 'Activo' },
                { value: 2, label: 'Inactivo' },
                { value: 3, label: 'Programado' },
            ],
        },
        {
            name: 'period',
            placeholder: 'Filtrar por período',
            options: [
                { value: 'active', label: 'Activos' },
                { value: 'past', label: 'Pasados' },
                { value: 'future', label: 'Futuros' },
            ],
        },
    ]

    // Acciones de la tabla
    const actions = [
        {
            icon: <PencilSquareIcon className="w-5 h-5 text-blue-600" />,
            color: 'text-blue-600 hover:text-blue-800',
            handler: item => {
                    setSelectedPeriod(item)
                    setIsEditModalOpen(true)
            },
        },
        {
            icon: <TrashIcon className="w-5 h-5 text-red-600" />,
            color: 'text-red-600 hover:text-red-800',
            handler: item => {
                if (item.status.name === 'Inactivo') {
                    handleDelete(item)
                }
            },
            disabled: item => item.status.name !== 'Inactivo'
        }
    ]

    // Manejar cambio de página
    const handlePageChange = page => {
        fetchEvaluationPeriods({ ...currentFilters, page })
    }

    // Manejar cambio de filtros
    const handleFilterChange = e => {
        const newFilters = {
            ...currentFilters,
            [e.target.name]: e.target.value,
        }
        setCurrentFilters(newFilters)
        fetchEvaluationPeriods(newFilters)
    }

    // Cargar datos iniciales
    useEffect(() => {
        fetchEvaluationPeriods()
    }, [])

    return (
        <>
            <div className="relative px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-end mb-8">
                    <Button onClick={() => setIsCreateModalOpen(true)}>
                        {' '}
                        <PlusCircle className="w-5 h-5 mr-2" />
                        Nuevo Período
                    </Button>
                </div>

                {/* Modal con el formulario */}
                <Modal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}>
                    <PeriodForm
                        onClose={() => setIsCreateModalOpen(false)}
                        onSuccess={() => {
                            setIsCreateModalOpen(false)
                            fetchEvaluationPeriods() // Recargar la lista
                        }}
                    />
                </Modal>

                {/* Modal de edición */}
                {selectedPeriod && (
                    <Modal
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}>
                        <EditPeriodForm
                            period={selectedPeriod}
                            onClose={() => setIsEditModalOpen(false)}
                            onSuccess={handleUpdateSuccess}
                        />
                    </Modal>
                )}

                {/* Modal de confirmación de eliminación */}
                <ConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleConfirmDelete}
                    title="Confirmar eliminación"
                    message={`¿Estás seguro de eliminar el período "${selectedPeriod?.name}"?`}
                />

                <StandardTable
                    title="Períodos de Evaluación"
                    columns={columns}
                    data={periods}
                    filters={filters}
                    currentPage={meta?.current_page || 1}
                    totalPages={meta?.last_page || 1}
                    onPageChange={handlePageChange}
                    onFilterChange={handleFilterChange}
                    actions={actions}
                    loading={loading}
                />

                {error && (
                    <Alert>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
            </div>
        </>
    )
}

export default PlanningPage
