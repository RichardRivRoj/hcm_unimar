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
import StandardLoader from '@/components/StandardLoader'
import BadgeRequest from '@/components/BadgeRequest'

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

    useEffect(() => {
        setSearchTerm(filters.search || '')
    }, [filters.search])

    // Configuración de la tabla
    const tableConfig = {
        title: 'Listado de Solicitudes',
        columns: [
            { header: 'Tipo de Solicitud', accessor: 'request_type' },
            { header: 'Nombre Completo', accessor: 'full_name' },
            { header: 'Documento', accessor: 'identification_type', render: (item) => `${item.identification_type} - ${item.identification_number}` },
            { header: 'Departamento', accessor: 'department' },
            { header: 'Estado', accessor: 'request_status', render: (item) => <BadgeRequest>{item.request_status}</BadgeRequest> },
            { 
                header: 'Fecha de Creación', 
                accessor: 'created_at', 
                render: (item) => new Date(item.created_at).toLocaleDateString('es-ES', { timeZone: 'UTC' })
            }
        ],
        filters: [
            {
                type: 'search',
                name: 'search',
                placeholder: 'Buscar por nombre...',
                value: searchTerm // Usamos el estado local aquí
            },
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
        onFilterChange: (name, value) => {
            if (name === 'search') {
                setSearchTerm(value) // Actualizamos el estado local para búsqueda
            } else {
                updateFilter(name, value) // Filtros normales sin debounce
            }
        },
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
        return <StandardLoader />
    }

    return (
        <div className="static min-h-screen ml-10">
       

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