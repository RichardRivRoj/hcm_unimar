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
import Filters from '@/components/Dashboard/Filters'
import ChartCard from '@/components/Dashboard/ChartCard'
import DataTableCard from '@/components/Dashboard/DataTableCard'
import PerformanceChart from '@/components/Charts/PerformanceChart'
import ActiveVacanciesChart from '@/components/Charts/ActiveVacanciesChart'
import HorizontalBarStatusChart from '@/components/Charts/HorizontalBarStatusChart'
import PieGenderChart from '@/components/Charts/PieGenderChart'

const RecruitmentDashboard = () => {
    const [departments, setDepartments] = useState([])
    const { metrics, isLoading } = useRecruitmentDashboard({}, departments)

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
            accessor: 'department',
            render: item => item.department,
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
            render: item => Number(item.ratio).toFixed(2),
        },
    ]

    if (isLoading) return <StandardLoader />

    {
        !isLoading && metrics.interviewRatio.data.length === 0 && (
            <Alert variant="info">
                <AlertDescription>No hay datos disponibles</AlertDescription>
            </Alert>
        )
    }

    return (
        <div className="min-h-screen p-2 bg-gray-50">
            <div className="mx-auto space-y-8 max-w-7xl">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-[#004b9a] md:text-3xl">
                        Reclutamiento y Selección
                    </h1>
                    <Filters departments={departments} />
                </div>

                {/* Grid Principal */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <MetricCard
                        title="Ratio Global"
                        value={metrics.interviewRatio.globalRatio || 0}
                        description="Entrevistas por vacante"
                    />

                    <MetricCard
                        title="Vacantes Activas"
                        value={metrics.activeVacancies.globalTotal}
                        description="Total actual"
                    />

                    <MetricCard
                        title="Vacantes Totales"
                        value={metrics.vacancyStatus.total}
                        description="Distribución por estado"
                    />

                    <MetricCard
                        title="Candidatos por Género"
                        value={metrics.genderDistribution.total}
                        description="Diversidad de postulantes"
                    />
                </div>

                {/* Sección de Gráficos */}
                <div className="grid grid-cols-1 gap-6">
                    {/* Fila Superior: 2 Gráficos en columnas iguales */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <ChartCard title="Tiempo Promedio de Contratación">
                            <div className="h-64">
                                <AverageHiringTimeChart
                                    data={metrics.averageHiringTime}
                                    departments={departments}
                                />
                            </div>
                        </ChartCard>

                        <ChartCard title="Distribución de Vacantes Activas">
                            <div className="h-64">
                                {metrics.activeVacancies.data.length > 0 ? (
                                    <ActiveVacanciesChart
                                        data={metrics.activeVacancies.data}
                                        departments={departments}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        No hay vacantes activas registradas
                                    </div>
                                )}
                            </div>
                        </ChartCard>
                    </div>

                    {/* Fila Inferior: Gráfico Full Width */}
                    <ChartCard
                        title="Desempeño Inicial por Departamento"
                        className="h-96">
                        <div className="h-72">
                            {metrics.initialPerformance.length > 0 ? (
                                <PerformanceChart
                                    data={metrics.initialPerformance}
                                    departments={departments}
                                />
                            ) : (
                                <div className="p-4 text-gray-500">
                                    No hay datos de desempeño disponibles
                                </div>
                            )}
                        </div>
                    </ChartCard>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <ChartCard title="Distribución de Candidatos por Género">
                            <div className="h-64">
                                {metrics.genderDistribution.data.length > 0 ? (
                                    <PieGenderChart
                                        data={metrics.genderDistribution.data}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        No hay candidatos en proceso
                                    </div>
                                )}
                            </div>
                        </ChartCard>

                        <ChartCard title="Estados de Vacantes">
                            <div className="h-64">
                                {metrics.vacancyStatus.data.length > 0 ? (
                                    <HorizontalBarStatusChart
                                        data={metrics.vacancyStatus.data}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        No hay vacantes registradas
                                    </div>
                                )}
                            </div>
                        </ChartCard>
                    </div>
                </div>

                {/* Tablas y Detalles */}
                <DataTableCard title="Detalle de Entrevistas por Vacante">
                    <StandardTable
                        columns={columns}
                        data={metrics.interviewRatio.data}
                        className="text-xs"
                    />
                </DataTableCard>
            </div>
        </div>
    )
}

export default RecruitmentDashboard
