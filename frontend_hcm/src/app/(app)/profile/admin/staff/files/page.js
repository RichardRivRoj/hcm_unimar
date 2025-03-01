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

const AdminEmployeesList = () => {
    const router = useRouter()
    const [filters, setFilters] = useState({
        search: '',
        department: '',
        status: '',
        sort: 'asc',
        identification: '',
    })

    const { employees, meta, loading, error, updateFilter, goToPage, refetch } = useEmployeeFiles(filters)

    const [searchTerm, setSearchTerm] = useState('')
    const [identificationTerm, setIdentificationTerm] = useState('')
    const debouncedSearch = useDebounce(searchTerm, 1000)
    const debouncedIdentification = useDebounce(identificationTerm, 1000)
    
    const tableConfig = {
        title: 'Listado General de Empleados',
        columns: [
            { header: 'Nombre Completo', accessor: 'full_name' },
            {
                header: 'Identificación',
                render: item =>
                    `${item.identification.type}-${item.identification.value}`,
            },
            { header: 'Email', accessor: 'email' },
            { header: 'Cargo Actual', accessor: 'current_position' },
            { header: 'Departamento', accessor: 'current_department' },
            { header: 'Estado', accessor: 'status' },
        ],
        filters: [
            {
                name: 'department',
                placeholder: 'Filtrar por departamento',
                options: meta.filters.available_departments.map(d => ({
                    value: d.id,
                    label: d.name,
                })),
                value: filters.department,
            },
            {
                name: 'status',
                placeholder: 'Filtrar por estado',
                options: meta.filters.status_options.map(s => ({
                    value: s,
                    label: s.charAt(0).toUpperCase() + s.slice(1),
                })),
                value: filters.status,
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
                    router.push(`/admin/employees/${item.employee_id}`),
            },
        ],
        currentPage: meta.currentPage,
        totalPages: meta.lastPage,
        onPageChange: page => goToPage(page),
        onFilterChange: (name, value) => updateFilter(name, value), // Corregir manejo de eventos
    }

    useEffect(() => {
        updateFilter('search', debouncedSearch)
    }, [debouncedSearch])

    useEffect(() => {
        updateFilter('identification', debouncedIdentification)
    }, [debouncedIdentification])

    if (loading)
        return (
            <div className="space-y-4">
                {[...Array(meta.perPage)].map((_, i) => (
                    <Skeleton key={i} className="w-full h-16 rounded-lg" />
                ))}
            </div>
        )

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
                    onChange={e => setIdentificationTerm(e.target.value)
                    }
                    className="w-full border-b-2 focus:border-blue-500"
                />
            </div>

            <StandardTable
                {...tableConfig}
                data={employees}
                loading={loading}
                error={error}
                className="mt-6"
            />
        </div>
    )
}

export default AdminEmployeesList
