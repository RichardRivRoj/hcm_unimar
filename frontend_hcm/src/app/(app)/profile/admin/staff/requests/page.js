'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import StandardTable from '@/components/StandardTable'
import Input from '@/components/Input'
import { Eye } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/alert'
import { Skeleton } from '@/components/skeleton'
import useDebounce from '@/hooks/general/useDebounce'
import { useAdminRequests } from '@/hooks/admin/useAdminRequests'

const AdminRequests = () => {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearch = useDebounce(searchTerm, 1000)
    
    const {
        data: requests,
        meta,
        loading,
        error,
        filters,
        updateFilter,
        refetch: fetchRequests
    } = useAdminRequests()

    // Configuración de la tabla
    const tableConfig = {
        title: 'Listado de Solicitudes',
        columns: [
            { header: 'Nombre Completo', accessor: 'full_name' },
            { header: 'Tipo de Identificación', accessor: 'identification_type' },
            { header: 'Número de Identificación', accessor: 'identification_number' },
            { header: 'Departamento', accessor: 'department' },
            { header: 'Tipo de Solicitud', accessor: 'request_type' },
            { header: 'Estado de Solicitud', accessor: 'request_status' },
            { 
                header: 'Fecha de Creación', 
                accessor: 'created_at', 
                render: (item) => new Date(item.created_at).toLocaleDateString()
            }
        ],
        filters: [
            {
                name: 'request_type',
                placeholder: 'Filtrar por Tipo de Solicitud',
                options: meta.filters?.request_types?.map(type => ({
                    value: type.id,
                    label: type.name
                })) || [],
                value: filters.request_type,
            },
            {
                name: 'status',
                placeholder: 'Filtrar por Estado',
                options: meta.filters?.statuses?.map(status => ({
                    value: status.id,
                    label: status.name
                })) || [],
                value: filters.status,
            }
        ],
        actions: [
            {
                icon: <Eye size={26} />,
                color: 'text-blue-600',
                handler: item => router.push(`/profile/admin/staff/requests/request/${item.request_id}`),
            }
        ],
        currentPage: meta.current_page || 1,
        totalPages: meta.last_page || 1,
        onPageChange: page => fetchRequests(page),
        onFilterChange: updateFilter,
    }

    // Sincronizar búsqueda con debounce
    useEffect(() => {
        updateFilter('search', debouncedSearch)
    }, [debouncedSearch])

    // Manejo de estados
    if (error) {
        return (
            <Alert variant="destructive" className="mx-4 my-6">
                <AlertDescription>{error?.message || 'Error al cargar solicitudes'}</AlertDescription>
            </Alert>
        )
    }

    if (loading) {
        return (
            <div className="p-6 space-y-4">
                {[...Array(meta.per_page || 6)].map((_, i) => (
                    <Skeleton key={i} className="w-full h-16 rounded-lg" />
                ))}
            </div>
        )
    }

    return (
        <div className="static min-h-screen">
            <div className="grid grid-cols-1 gap-4 p-6 mx-auto mt-6 ml-6 bg-white rounded-lg shadow-lg md:grid-cols-1">
                <Input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border-b-2 focus:border-blue-500"
                />
            </div>

            <StandardTable
                {...tableConfig}
                data={requests}
                loading={loading}
                className="bg-white rounded-lg shadow-lg"
            />
        </div>
    )
}

export default AdminRequests