'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import StandardTable from '@/components/StandardTable'
import Input from '@/components/Input'
import { Eye } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/alert'
import { Skeleton } from '@/components/skeleton'
import useEmployeeFiles from '@/hooks/admin/useEmployeeFiles'
import useDebounce from '@/hooks/general/useDebounce'
import StandardLoader from '@/components/StandardLoader'

const AdminEmployeesList = () => {
    const router = useRouter()

    const {
        employees,
        meta,
        filters,
        loading,
        error,
        updateFilter,
        goToPage,
        handlePageChange,
        refetch,
    } = useEmployeeFiles()

    const [searchTerm, setSearchTerm] = useState('')
    const [identificationTerm, setIdentificationTerm] = useState('')
    const debouncedSearch = useDebounce(searchTerm, 1000)
    const debouncedIdentification = useDebounce(identificationTerm, 1000)

    useEffect(() => {
        updateFilter('search', debouncedSearch)
    }, [debouncedSearch])

    useEffect(() => {
        updateFilter('identification', debouncedIdentification)
    }, [debouncedIdentification])

    const availableDepartments = meta.filters?.available_departments || []
    const statusOptions = meta.filters?.status_options || []

    const tableConfig = {
        title: 'Listado General de Empleados',
        columns: [
            { header: 'Nombre Completo', accessor: 'full_name' },
            {
                header: 'Identificación',
                render: item =>
                    `${item.identification.type}-${item.identification.value}`,
            },
            { header: 'Email', accessor: 'email', render: item => item.email  },
            { header: 'Cargo Actual', accessor: 'current_position', render: item => item.current_position },
            { header: 'Departamento', accessor: 'current_department', render: item => item.current_department },
            { header: 'Estado', accessor: 'status' },
        ],
        filters: [
            {
                name: 'department',
                placeholder: 'Filtrar por departamento',
                value: filters.department,
                options: availableDepartments.map(d => ({
                    value: d.id,
                    label: d.name,
                })),
            },
            {
                name: 'status',
                placeholder: 'Filtrar por estado',
                value: filters.status,
                options: statusOptions.map(s => ({
                    value: s.toLowerCase(),
                    label: s.charAt(0).toUpperCase() + s.slice(1),
                })),
            },
            {
                name: 'sort',
                placeholder: 'Ordenar por',
                options: [
                    { value: 'asc', label: 'A-Z' },
                    { value: 'desc', label: 'Z-A' },
                ],
                value: filters.sort,
            },
        ],
        actions: [
            {
                icon: <Eye size={26} />,
                color: 'text-blue-600',
                handler: item =>
                    router.push(
                        `/profile/admin/staff/files/file/${item.employee_id}`,
                    ),
            },
        ],
        currentPage: meta.currentPage,
        totalPages: meta.lastPage,
        onPageChange: page => goToPage(page),
        onFilterChange: (name, value) => {
            // Normalizar nombres de filtros para el backend
            const filterMap = {
                department: 'department_id',
                status: 'status',
                sort: 'sort',
            }
            updateFilter(filterMap[name] || name, value)
        },
       
    };

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
            <div className="grid grid-cols-1 gap-4 p-6 mx-auto mt-6 ml-6 bg-white rounded-lg shadow-lg md:grid-cols-2">
                <Input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full border-b-2 focus:border-blue-500"
                />
                <Input
                    type="text"
                    placeholder="Buscar por cédula..."
                    value={identificationTerm}
                    onChange={e => setIdentificationTerm(e.target.value)}
                    className="w-full border-b-2 focus:border-blue-500"
                />
            </div>

            <StandardTable
                {...tableConfig}
                data={employees}
                onPageChange={goToPage} // Usar la función corregida
                totalPages={meta.lastPage} // Usar lastPage en lugar de total
                className="mt-6"
            />
        </div>
    )
}

export default AdminEmployeesList
