'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import useAgendaResults from '@/hooks/useAgendaResult'
import { Eye } from 'lucide-react'
import StandardLoader from '@/components/StandardLoader'
import StandardTable from '@/components/StandardTable'

const SelectionPage = () => {
    const router = useRouter()
    const [filters, setFilters] = useState({
        page: 1,
        search: '',
        sortBy: 'created_at',
        sortOrder: 'desc',
        positionId: '',
    })

    const { data: candidates, meta, loading, error } = useAgendaResults(filters)

    const handleFilterChange = e => {
        const { name, value } = e.target
        setFilters(prev => ({ ...prev, [name]: value, page: 1 }))
    }

    const handlePageChange = newPage => {
        setFilters(prev => ({ ...prev, page: newPage }))
    }

    // Configuración de columnas
    const columns = [
        { header: 'Nombre', accessor: 'full_name' },
        { header: 'Identificación', accessor: 'identification' },
        {
            header: 'Evaluaciones',
            accessor: 'total_evaluations',
            align: 'center',
            render: (item) => (
                <span className="text-[#004b9a] font-semibold">
                    {item.total_evaluations}
                </span>
            )
        },
        {
            header: 'Promedio',
            accessor: 'average_score',
            align: 'center',
            render: (item) => (
                <span className="inline-block px-3 py-1 rounded-full bg-[#004b9a]/10 text-[#004b9a] font-semibold">
                    {item.average_score.toFixed(2)}
                </span>
            )
        },
        { header: 'Puesto', accessor: 'vacancy', render: (item) => `${item.vacancy.position}`},
        { header: 'Última Evaluación', accessor: 'last_evaluation' }
    ]

    // Configuración de filtros
    const tableFilters = [
        {
            type: 'search',
            name: 'search',
            placeholder: 'Buscar candidato...',
            value: filters.search
        },
        {
            name: 'positionId',
            placeholder: 'Todas las posiciones',
            options: candidates?.filters?.position?.map(p => ({
                value: p.id,
                label: p.description
            })) || [],
            value: filters.positionId
        },
        {
            name: 'sortBy',
            placeholder: 'Ordenar por',
            options: [
                { value: 'created_at', label: 'Fecha' },
                { value: 'average_score', label: 'Promedio' }
            ],
            value: filters.sortBy
        },
        {
            name: 'sortOrder',
            placeholder: 'Dirección',
            options: [
                { value: 'desc', label: 'Descendente' },
                { value: 'asc', label: 'Ascendente' }
            ],
            value: filters.sortOrder
        }
    ]

    // Configuración de acciones
    const actions = [{
        icon: <Eye size={20} className="text-[#004b9a]" />,
        color: 'text-[#004b9a]',
        handler: (item) => router.push(`/profile/admin/recruitment/selection/inspect/${item.candidate_id}`)
    }]

    if (loading) return <StandardLoader />
    if (error) return <div className="p-6 text-red-600">Error: {error.message}</div>

    return (
        <div className='ml-5'>
        <StandardTable
            title="Resultados de Evaluación de Candidatos"
            columns={columns}
            data={candidates}
            filters={tableFilters}
            currentPage={meta.current_page}
            totalPages={meta.last_page}
            totalItems={meta.total}
            onPageChange={handlePageChange}
            onFilterChange={handleFilterChange}
            actions={actions}
        />
        </div>
    )
}

export default SelectionPage