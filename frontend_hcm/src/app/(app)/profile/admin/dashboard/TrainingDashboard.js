'use client'

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import useTrainingDashboard from '@/hooks/admin/useTrainingDashboard'
import { Alert, AlertDescription } from '@/components/alert'
import StandardLoader from '@/components/StandardLoader'
import StandardTable from '@/components/StandardTable'
import MetricCard from '@/components/Dashboard/MetricCard'
import Filters from '@/components/Dashboard/Filters'
import ChartCard from '@/components/Dashboard/ChartCard'
import DataTableCard from '@/components/Dashboard/DataTableCard'
import TrainingParticipationChart from '@/components/Charts/TrainingParticipationChart'
import StackedBarChart from '@/components/Charts/StackedBarChart'
import HorizontalBarChart from '@/components/Charts/HorizontalBarChart'
import LineImpactChart from '@/components/Charts/LineImpactChart '

const TrainingDashboard = () => {
    const [departments, setDepartments] = useState([])
    const { metrics, params, setParams, changePage, isLoading, errors } =
        useTrainingDashboard()

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

    const columns = [
        {
            header: 'Departamento',
            accessor: 'department_name',
        },
        {
            header: 'Inscritos',
            accessor: 'enrolled',
        },
        {
            header: 'Total Empleados',
            accessor: 'total_employees',
        },
        {
            header: 'Participación',
            accessor: 'participation_rate',
            render: item => `${item.participation_rate}%`,
        },
    ]

    const filterOptions = [
        {
            label: 'Departamento',
            value: params.department_id || 'all',
            onChange: e => handleFilterChange('department_id', e.target.value),
            options: [
                { value: 'all', label: 'Todos' },
                ...departments.map(dept => ({
                    value: dept.id,
                    label: dept.name,
                })),
            ],
            clearable: true,
        },
        {
            label: 'Rango Temporal',
            value: params.time_range,
            onChange: e => handleFilterChange('time_range', e.target.value),
            options: metrics.participation.filters.time_ranges,
            clearable: false,
        },
        {
            label: 'Tipo de Programa',
            value: params.training_type_id || 'all',
            onChange: e =>
                handleFilterChange('training_type_id', e.target.value),
            options: [
                { value: 'all', label: 'Todos' },
                ...metrics.activePrograms.filters.training_types,
            ],
            clearable: true,
        },
    ]

    const handleFilterChange = (filterType, value) => {
        setParams({
            [filterType]: value === 'all' ? null : value,
        })
    }

    if (isLoading) return <StandardLoader />

    return (
        <div className="min-h-screen p-2 bg-gray-50">
            <div className="mx-auto space-y-8 max-w-7xl">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-[#004b9a] md:text-3xl">
                        Desarrollo y Capacitación
                    </h1>
                    <Filters filters={filterOptions} />
                </div>

                {/* Grid de Métricas - Ajuste de Columnas */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <MetricCard
                        title="Participación Global"
                        value={`${metrics.participation.overall.participation_rate}%`}
                        description={`${metrics.participation.overall.enrolled}/${metrics.participation.overall.total_employees} empleados`}
                        className="h-full p-4"
                    />

                    <MetricCard
                        title="Programas Activos"
                        value={metrics.activePrograms.overall.total_active}
                        description="En ejecución actualmente"
                        className="h-full p-4"
                    />

                    <MetricCard
                        title="Promedio General"
                        value={metrics.scores.average.average_score.toFixed(1)}
                        description={`${metrics.scores.average.total_graded} evaluaciones`}
                        className="h-full p-4"
                    />

                    <MetricCard
                        title="Tasa de Finalización"
                        value={`${metrics.completion.overall.completion_rate}%`}
                        description={`${metrics.completion.overall.completed}/${metrics.completion.overall.total_enrollments} completados`}
                        className="h-full p-4"
                    />
                </div>

                {/* Sección de Gráficos - Ajuste de Alturas */}
                <div className="grid grid-cols-1 gap-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <ChartCard
                            title="Participación en Capacitaciones"
                            className="h-[400px]">
                            <div className="h-64">
                                {errors.participation ? (
                                    <Alert variant="destructive">
                                        <AlertDescription>
                                            Error cargando datos
                                        </AlertDescription>
                                    </Alert>
                                ) : metrics.participation.overall
                                      .total_employees > 0 ? (
                                    <TrainingParticipationChart
                                        data={metrics.participation.overall}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        No hay empleados registrados
                                    </div>
                                )}
                            </div>
                        </ChartCard>

                        <ChartCard
                            title="Finalización de Programas"
                            className="h-[400px]">
                            <div className="h-64">
                                {errors.completion ? (
                                    <Alert variant="destructive">
                                        <AlertDescription>
                                            Error cargando datos
                                        </AlertDescription>
                                    </Alert>
                                ) : metrics.completion.overall
                                      .total_enrollments > 0 ? (
                                    <StackedBarChart
                                        data={metrics.completion.statuses}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        No hay inscripciones registradas
                                    </div>
                                )}
                            </div>
                        </ChartCard>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <ChartCard
                            title="Distribución de Calificaciones"
                            className="h-[400px]">
                            <div className="h-64">
                                {metrics.scores.distribution.length > 0 ? (
                                    <ScoreDistributionChart
                                        data={metrics.scores.distribution}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        No hay datos de calificaciones
                                    </div>
                                )}
                            </div>
                        </ChartCard>

                        <ChartCard
                            title="Programas Activos por Tipo"
                            className="h-[400px]">
                            <div className="h-64">
                                {metrics.activePrograms.types.length > 0 ? (
                                    <HorizontalBarChart
                                        data={metrics.activePrograms.types}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        No hay programas activos
                                    </div>
                                )}
                            </div>
                        </ChartCard>
                    </div>

                    <ChartCard
                        title="Impacto en Evaluaciones"
                        className="h-[500px]">
                        <div className="h-[400px]">
                            {metrics.impact.chartData.labels.length > 0 ? (
                                <LineImpactChart
                                    data={metrics.impact.chartData}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    No hay datos de evaluaciones
                                </div>
                            )}
                        </div>
                    </ChartCard>
                </div>

                {/* Tablas con Paginación Estilizada */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-1">
                    <DataTableCard
                        title="Detalle de Programas"
                        className="min-h-[400px]">
                        <StandardTable
                            columns={columns}
                            data={metrics.participation.departments}
                            currentPage={
                                metrics.participation.pagination.currentPage
                            }
                            totalPages={
                                metrics.participation.pagination.totalPages
                            }
                            totalItems={
                                metrics.participation.pagination.totalItems
                            }
                            onPageChange={changePage}
                            className="text-xs"
                            onFilterChange={e =>
                                handleFilterChange('search', e.target.value)
                            }
                        />
                    </DataTableCard>
                </div>
            </div>
        </div>
    )
}

export default TrainingDashboard
