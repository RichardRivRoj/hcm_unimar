'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRegistrationHistory } from '@/hooks/admin/useRegistrationHistory'
import StandardTable from '@/components/StandardTable'
import { Alert, AlertDescription } from '@/components/alert'
import { Eye } from 'lucide-react'

const TrainingProgramsPage = () => {
    const [filters, setFilters] = useState({
        visibility_id: '',
        training_type_id: '',
        completion_status: '',
    })

    const { programs, filters: filtersType, meta, loading, error, params, updateParams, goToPage } = useRegistrationHistory(filters)
    
    const router = useRouter()

    // Configuración de columnas para la tabla
    const columns = [
        {
            header: 'Nombre',
            accessor: 'name',
        },
        {
            header: 'Fechas',
            render: item =>
                `${new Date(item.start_date).toLocaleDateString()} - 
                ${new Date(item.end_date).toLocaleDateString()}`,
        },
        {
            header: 'Visibilidad',
            accessor: 'visibility',
            render: item => item.visibility?.name || '-',
        },
        {
            header: 'Tipo',
            accessor: 'training_type',
            render: item => item.training_type?.name || '-',
        },
        {
            header: 'Inscritos',
            accessor: 'total_enrollments',
        },

        ,
    ]

    const tableActions = [
        {
            icon: <Eye size={26} />,
            color: 'text-blue-600',
            handler: item =>
                router.push(`/profile/admin/training/inscriptions/program/${item.id}`),
        },
    ]

    const tableFilters = [
        {
            name: 'visibility_id',
            value: filters.visibility_id,
            placeholder: 'Filtrar por visibilidad',
            options: [
                { value: '', label: 'Todas' },
                ...(filtersType?.visibilities?.map(v => ({
                    value: String(v.id), // Convertir a string
                    label: v.name,
                })) || [])
            ],
        },
        {
            name: 'training_type_id',
            value: filters.training_type_id,
            placeholder: 'Filtrar por tipo',
            options: [
                { value: '', label: 'Todos' },
                ...(filtersType?.training_types?.map(t => ({
                    value: String(t.id), // Convertir a string
                    label: t.name,
                })) || [])
            ],
        },
    ];

    // Manejadores
    const handlePageChange = page => {
        goToPage(page)
    }

    const handleFilterChange = e => {
        const { name, value } = e.target
        setFilters(prev => ({
            ...prev,
            [name]: value,
        }))
        updateParams({ [name]: value })
    }

    return (
        <div className="p-6">
            <h1 className="mb-6 text-2xl font-bold">
                Programas de Capacitación
            </h1>

            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <StandardTable
                title="Listado de Programas"
                columns={columns}
                data={programs}
                filters={tableFilters}
                currentPage={meta.current_page}
                totalPages={meta.last_page}
                onPageChange={handlePageChange}
                onFilterChange={handleFilterChange}
                loading={loading}
                actions={tableActions}
            />
        </div>
    )
}

export default TrainingProgramsPage
