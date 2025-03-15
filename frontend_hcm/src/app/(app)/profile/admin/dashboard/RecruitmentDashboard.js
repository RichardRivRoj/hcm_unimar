'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import AverageHiringTimeChart from '@/components/Charts/AverageHiringTimeChart'
import useRecruitmentDashboard from '@/hooks/admin/useRecruitmentDashboard'
import { Alert, AlertDescription } from '@/components/alert'
import StandardLoader from '@/components/StandardLoader'
import StandardTable from '@/components/StandardTable'
import ChartContainer from '@/components/Dashboard/ChartContainer'
import MetricCard from '@/components/Dashboard/MetricCard'

const RecruitmentDashboard = () => {
    const { metrics, params, setParams, isLoading, errors, refresh } =
        useRecruitmentDashboard()
    const [localDepartments, setLocalDepartments] = useState([])
    const [departments, setDepartments] = useState([])

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('/api/departments')
                setDepartments(response.data)
            } catch (err) {
                console.error('Error fetching departments:', err)
            }
        }
        fetchDepartments()
    }, [])

    const handleDepartmentChange = selected => {
        setLocalDepartments(selected)
        setParams({
            departments: selected.map(d => d.value),
            page: 1, // Resetear a primera página
        })
    }

    const handlePageChange = newPage => {
        setParams(prev => ({ ...prev, page: newPage }))
    }

    // Configurar columnas de la tabla
    const columns = [
        {
            header: 'Departamento',
            accessor: 'department',
            render: item => item.department || 'Sin departamento',
        },
        {
            header: 'Entrevistas',
            accessor: 'total_interviews',
            render: item => item.total_interviews,
        },
        {
            header: 'Vacantes',
            accessor: 'total_vacancies',
            render: item => item.total_vacancies,
        },

        {
            header: 'Ratio',
            accessor: 'ratio',
            render: item => item.ratio.toFixed(2),
        },
    ]

    // Configurar filtros
    const filters = [
        {
            name: 'department',
            placeholder: 'Filtrar por departamento',
            options: [
                { value: '', label: 'Todas' },
                ...(departments?.map(v => ({
                    value: String(v.id), // Convertir a string
                    label: v.name,
                })) || []),
            ],
        },
    ]

    if (isLoading) return <StandardLoader />

    if (errors.length > 0) {
        return (
            <Alert variant="destructive">
                <div className="space-y-2">
                    {errors.map((error, index) => (
                        <AlertDescription key={index}>
                            {error.message || error.toString()}
                        </AlertDescription>
                    ))}
                </div>
            </Alert>
        )
    }
    return (
        <div className="space-y-6">
            {/* Header y Filtros */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h2 className="text-lg font-semibold text-[#004b9a]">
                    Reclutamiento y Selección
                </h2>
                <select
                    onChange={e => handleDepartmentChange(e.target.value)}
                    className="w-full md:w-64 p-2 text-sm border rounded-md focus:ring-2 focus:ring-[#004b9a]">
                    <option value="">Todos los departamentos</option>
                    {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>
                            {dept.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Grid de métricas principales */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <MetricCard
                    title="Tasa de Conversión"
                    value={`${metrics.conversionRate.conversion_rate}%`}
                    description={`${metrics.conversionRate.hired}/${metrics.conversionRate.total_candidates} candidatos`}
                />

                <MetricCard
                    title="Ratio Global Entrevistas"
                    value={metrics.interviewRatio.total.global_ratio?.toFixed(
                        2,
                    )}
                    description={`${metrics.interviewRatio.total.total_interviews}/${metrics.interviewRatio.total.total_vacancies} total`}
                />

                <ChartContainer title="Tiempo Promedio de Contratación">
                    <AverageHiringTimeChart data={metrics.averageHiringTime} />
                </ChartContainer>
            </div>

            {/* Tabla de Detalle */}
            <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-600">
                        Detalle por Departamento
                    </h3>
                    <span className="text-xs text-gray-500">
                        Página {metrics.meta.interview.current_page} de{' '}
                        {metrics.meta.interview.pagination?.last_page || 1}
                    </span>
                </div>
                <StandardTable
                    title="Ratio de Entrevistas por Vacante"
                    columns={columns}
                    data={metrics.interviewRatio.data || []}
                    filters={filters}
                    currentPage={metrics.meta.interview.current_page}
                    totalPages={
                        metrics.meta.interview.pagination?.last_page || 1
                    }
                    onPageChange={page => setParams({ ...params, page })}
                    onFilterChange={e =>
                        setParams({
                            ...params,
                            [e.target.name]: e.target.value,
                        })
                    }
                    loading={!metrics.interviewRatio.data}
                    className="text-xs"
                />
            </div>
        </div>
    )
}

export default RecruitmentDashboard
