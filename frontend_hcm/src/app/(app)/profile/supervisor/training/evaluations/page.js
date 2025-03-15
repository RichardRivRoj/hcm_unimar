'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import useRegistrationDepartmentHistory from '@/hooks/supervisor/useRegistrationDepartmentHistory'
import StandardTable from '@/components/StandardTable'
import { Alert, AlertDescription } from '@/components/alert'
import { Eye } from 'lucide-react'
import StandardLoader from '@/components/StandardLoader'

const SupervisorProgramsPage = () => {
    const [localFilters, setLocalFilters] = useState({
        training_type_id: '',
    })

    const { programs, filters, meta, loading, error, updateParams, goToPage } = useRegistrationDepartmentHistory()
    
    const router = useRouter()

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
            header: 'Tipo',
            accessor: 'training_type',
            render: item => item.training_type?.name || '-',
        },
        {
            header: 'Inscritos',
            accessor: 'total_enrollments',
        },
    ]

    const tableActions = [
        {
            icon: <Eye size={26} />,
            color: 'text-blue-600',
            handler: item =>
                router.push(`/profile/supervisor/training/evaluations/program/${item.id}`),
        },
    ]

    const tableFilters = [
        {
            name: 'training_type_id',
            value: localFilters.training_type_id,
            placeholder: 'Filtrar por tipo',
            options: [
                { value: '', label: 'Todos' },
                ...(filters.training_types?.map(t => ({
                    value: String(t.id),
                    label: t.name,
                }))) || []
            ],
        },
    ]

    const handlePageChange = page => goToPage(page)

    const handleFilterChange = e => {
        const { name, value } = e.target
        setLocalFilters(prev => ({ ...prev, [name]: value }))
        updateParams({ [name]: value })
    }

    if (loading) return <StandardLoader />

    return (
        <div className="p-6">
            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <StandardTable
                title="Programas de Mi Departamento"
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

export default SupervisorProgramsPage