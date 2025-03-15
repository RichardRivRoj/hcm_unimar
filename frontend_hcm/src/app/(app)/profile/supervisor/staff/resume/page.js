'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useDepartmentEmployees from '@/hooks/supervisor/useDepartmentEmployees'
import StandardTable from '@/components/StandardTable'
import Input from '@/components/Input'
import { Eye } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/alert'
import { Skeleton } from '@/components/skeleton'
import StandardLoader from '@/components/StandardLoader'

const DepartmentEmployeesList = () => {
    const router = useRouter()
    const [filters, setFilters] = useState({
        search: '',
        position: '',
    })

    const {
        data: { employees, department },
        loading,
        error,
        pagination,
        goToPage,
        refetch,
    } = useDepartmentEmployees(filters)

    // Generar opciones únicas para los filtros
    const uniquePositions = [...new Set(employees.map(emp => emp.position))]
        .filter(Boolean)
        .map(position => ({
            value: position,
            label: position,
        }))

    const tableConfig = {
        title: `Empleados de ${department || 'Cargando...'}`,
        columns: [
            { header: 'Nombre Completo', accessor: 'full_name' },
            {
                header: 'Identificación',
                render: item =>
                    `${item.identification_type}-${item.identification_value}`,
            },
            { header: 'Email', accessor: 'email' },
            { header: 'Cargo', accessor: 'position' },
        ],
        filters: [
            {
                name: 'position',
                placeholder: 'Filtrar por cargo',
                options: uniquePositions,
                value: filters.position,
            },
        ],
        actions: [
            {
                icon: <Eye size={26} />,
                color: 'text-blue-600',
                handler: item =>
                    router.push(
                        `/profile/supervisor/staff/resume/inspect/${item.employe_id || 'unknown'}`,
                    ),
            },
        ],
        currentPage: pagination.currentPage,
        totalPages: pagination.lastPage,
        onPageChange: page => goToPage(page),
        onFilterChange: e =>
            setFilters(prev => ({
                ...prev,
                [e.target.name]: e.target.value,
            })),
    }

    // Manejar estados de carga y error
    if (loading) return <StandardLoader />
    
    if (error) {
        return (
            <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )
    }

    return (
        <div className="static min-h-screen">
            {/* Filtro de búsqueda */}
            <div className="max-w-full p-6 mx-auto mt-6 ml-6 overflow-hidden bg-white rounded-lg shadow-lg">
                <Input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={filters.search}
                    onChange={e =>
                        setFilters(prev => ({
                            ...prev,
                            search: e.target.value,
                        }))
                    }
                    className="w-full border-b-2 focus:border-blue-500"
                />
            </div>

            {/* Tabla de empleados */}
            <StandardTable
                {...tableConfig}
                data={employees}
                loading={loading}
                error={error}
            />
        </div>
    )
}

export default DepartmentEmployeesList
