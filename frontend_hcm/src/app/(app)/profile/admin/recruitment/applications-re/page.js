'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import useCandidates from '@/hooks/useCandidate'
import { Eye } from 'lucide-react'
import useStatusApplications from '@/hooks/statusApplicationsView'
import StandardLoader from '@/components/StandardLoader'
import StandardTable from '@/components/StandardTable' // Asegúrate de tener la ruta correcta

const CandidatesPage = () => {
    const router = useRouter()
    const [filters, setFilters] = useState({
        sort: 'asc',
        status_application_id: '',
        page: 1
    })
    
    const {
        applications,
        loading: loadingApplications,
        error: errorApplications,
    } = useStatusApplications()
    
    const { candidates, loading, error, pagination } = useCandidates(filters)

    const handleFilterChange = e => {
        const { name, value } = e.target
        setFilters(prev => ({
            ...prev,
            [name]: value,
            page: 1
        }))
    }

    const handlePageChange = newPage => {
        setFilters(prev => ({ ...prev, page: newPage }))
    }

    if (loading) return <StandardLoader />
    if (error) return <div className="p-6 text-red-600">Error: {error}</div>

    // Configuración de columnas para la tabla
    const columns = [
        {
            header: 'Vacante',
            accessor: 'vacancy',
            render: (item) => `${item.vacancy.position.description} - ${item.vacancy.department.name}`
        },
        {
            header: 'Nombre y Apellido',
            accessor: 'persons',
            render: (item) => `${item.persons.first_name} ${item.persons.last_name}`
        },
        {
            header: 'Identificación',
            accessor: 'identification',
            render: (item) => `${item.persons.identificationtype.code} - ${item.persons.identification_value}`
        },
        {
            header: 'Estatus',
            accessor: 'status_application',
            render: (item) => `${item.status_application.name}`,
            align: 'center'
        }
    ]

    // Configuración de filtros
    const tableFilters = [
        {
            name: 'sort',
            placeholder: 'Ordenar por',
            options: [
                { value: 'asc', label: 'A-Z' },
                { value: 'desc', label: 'Z-A' }
            ],
            value: filters.sort
        },
        {
            name: 'status_application_id',
            placeholder: 'Filtrar por estatus',
            options: applications?.map(app => ({
                value: app.id,
                label: `${app.short_name} - ${app.name}`
            })) || [],
            value: filters.status_application_id
        }
    ]

    // Configuración de acciones
    const actions = [{
        icon: <Eye size={20} className="text-[#004b9a]" />,
        color: 'text-[#004b9a]',
        handler: (item) => router.push(`/profile/admin/recruitment/applications-re/inspect/${item.id}`)
    }]

    return (
        <div className='ml-5'>
        <StandardTable
            title="Resumen de Candidatos"
            columns={columns}
            data={candidates}
            filters={tableFilters}
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            onPageChange={handlePageChange}
            onFilterChange={handleFilterChange}
            actions={actions}
            loading={loading}
        />
        </div>
    )
}

export default CandidatesPage