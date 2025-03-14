'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { TrainingModal } from '@/components/Modal'
import CreateTrainingProgramForm from './CreateTrainingForm'
import { Eye } from 'lucide-react'
import StandardTable from '@/components/StandardTable'
import { useTrainingProgram } from '@/hooks/admin/useTrainingPrograms'

const TrainingProgramsPage = () => {
    const router = useRouter()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const {
        programs,
        filterOptions,
        pagination,
        loading,
        error,
        fetchPrograms,
    } = useTrainingProgram()

    const [filters, setFilters] = useState({
        training_type_id: '',
        modality_id: '',
        visibility_id: '',
        status_id: '',
    })

    const fetchData = useCallback(
        (page = 1) => {
            fetchPrograms(page, filters)
        },
        [filters, fetchPrograms],
    )

    // Initial data load and filter changes
    // Actualización automática al cambiar filtros
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchPrograms(1, filters)
        }, 300)

        return () => clearTimeout(timer)
    }, [filters])

    const handlePageChange = useCallback((page) => {
        fetchPrograms(page, filters)
    }, [filters, fetchPrograms])

    const handleFilterChange = e => {
        const { name, value } = e.target
        setFilters(prev => ({ ...prev, [name]: value }))
    }

    const columns = [
        {
            header: 'Nombre',
            accessor: 'name',
        },
        {
            header: 'Tipo',
            accessor: 'training_type',
            render: item => item.training_type?.name || '-',
        },
        {
            header: 'Modalidad',
            accessor: 'modality',
            render: item => item.modality?.name || '-',
        },
        {
            header: 'Visibilidad',
            accessor: 'visibility',
            render: item => item.visibility?.name || '-',
        },
        {
            header: 'Estado',
            accessor: 'status',
            render: item => (
                <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                        item.status?.name === 'Activo'
                            ? 'bg-green-100 text-green-800'
                            : item.status?.name === 'Inactivo'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                    }`}>
                    {item.status?.name || '-'}
                </span>
            ),
        },
    ]

    const tableFilters = [
        {
            name: 'training_type_id',
            value: filters.training_type_id,
            placeholder: 'Filtrar por tipo',
            options: Object.entries(filterOptions.training_types || {}).map(
                ([value, label]) => ({
                    value: parseInt(value),
                    label,
                }),
            ),
        },
        {
            name: 'modality_id',
            value: filters.modality_id,
            placeholder: 'Filtrar por modalidad',
            options: Object.entries(filterOptions.modalities || {}).map(
                ([value, label]) => ({
                    value: parseInt(value),
                    label,
                }),
            ),
        },
        {
            name: 'visibility_id',
            value: filters.visibility_id,
            placeholder: 'Filtrar por visibilidad',
            options: Object.entries(filterOptions.visibilities || {}).map(
                ([value, label]) => ({
                    value: parseInt(value),
                    label,
                }),
            ),
        },
        {
            name: 'status_id',
            value: filters.status_id,
            placeholder: 'Filtrar por estado',
            options: Object.entries(filterOptions.statuses || {}).map(
                ([value, label]) => ({
                    value: parseInt(value),
                    label,
                }),
            ),
        },
    ]

    const tableActions = [
        {
            icon: <Eye size={26} />,
            color: 'text-blue-600',
            handler: item =>
                router.push(`/profile/admin/training/programs/${item.id}`),
        },
    ]

    const handleProgramCreated = () => {
        setIsModalOpen(false)
        fetchData(1)
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Programas de Capacitación
                </h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 text-white bg-[#004b9a] rounded-lg hover:bg-[#003a7a]">
                    + Crear Nuevo Programa
                </button>
            </div>

            {error && (
                <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
                    Error: {error}
                </div>
            )}

            <StandardTable
                title="Listado de Programas"
                columns={columns}
                data={programs}
                filters={tableFilters}
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                onFilterChange={handleFilterChange}
                actions={tableActions}
                loading={loading}
            />

            <TrainingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}>
                <div className="w-full">
                    <CreateTrainingProgramForm
                        onClose={() => setIsModalOpen(false)}
                        onSuccess={handleProgramCreated}
                    />
                </div>
            </TrainingModal>
        </div>
    )
}

export default TrainingProgramsPage
