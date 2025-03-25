'use client'

import DiversityRadarChart from '@/components/Charts/DiversityRadarChart'
import GoalComplianceChart from '@/components/Charts/GoalComplianceChart'
import LevelGapsHeatmap from '@/components/Charts/LevelGapsHeatmap'
import PerformanceScatterChart from '@/components/Charts/PerformanceScatterChart'
import DataTableCard from '@/components/Dashboard/DataTableCard'
import Filters from '@/components/Dashboard/Filters'
import MetricCard from '@/components/Dashboard/MetricCard'
import StandardLoader from '@/components/StandardLoader'
import usePerformanceDashboard from '@/hooks/admin/usePerformanceDashboard'

const PerformanceDashboard = () => {
    const { metrics, params, setParams, isLoading, errors } =
        usePerformanceDashboard()

    const filterDepartments = metrics.performanceTenure?.departments || []
    const filterPositions = metrics.goalCompliance?.filters?.positions || []

    if (isLoading) return <StandardLoader />

    return (
        <div className="min-h-screen p-2 bg-gray-50">
            <div className="mx-auto space-y-8 max-w-7xl">
                {/* Header y Filtros */}
                <div className="space-y-4">
                    <h1 className="text-2xl font-bold text-[#004b9a] md:text-3xl">
                        Evaluación de Desempeño
                    </h1>
                    <Filters
                        filters={[
                            {
                                type: 'select',
                                label: 'Departamento',
                                options: filterDepartments,
                                value: params.department_id,
                                onChange: e =>
                                    setParams({
                                        department_id: e.target.value || null,
                                    }),
                                clearable: true,
                            },
                            {
                                type: 'select',
                                label: 'Puesto',
                                options: filterPositions,
                                value: params.position_id,
                                onChange: e =>
                                    setParams({
                                        position_id: e.target.value || null,
                                    }),
                                clearable: true,
                            },
                            {
                                type: 'select',
                                label: 'Indicador Demográfico',
                                options: [
                                    { value: 'gender', label: 'Género' },
                                    { value: 'ethnicity', label: 'Etnia' },
                                ],
                                value: params.demographic,
                                onChange: e =>
                                    setParams({ demographic: e.target.value }),
                            },
                        ]}
                    />
                </div>

                {!isLoading && !errors.length && (
                    <div className="space-y-6">
                        {/* Primera Fila: Métricas y Scatter */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            {/* Columna Izquierda */}
                            <div className="space-y-6 lg:col-span-1">
                                <MetricCard
                                    title="Correlación General"
                                    value={metrics.performanceTenure.correlation.toFixed(
                                        2,
                                    )}
                                    description="(Escala -1 a 1)"
                                    color="#004b9a"
                                />

                                <MetricCard
                                    title="Cumplimiento Global"
                                    value={`${metrics.goalCompliance.overall.compliance_rate}%`}
                                    description={`${metrics.goalCompliance.overall.compliant}/${metrics.goalCompliance.overall.total} evaluaciones`}
                                    color={
                                        metrics.goalCompliance.overall
                                            .compliance_rate >= 75
                                            ? '#10B981'
                                            : '#EF4444'
                                    }
                                />

                                <DataTableCard title="Top Performers">
                                    <div className="space-y-2">
                                        {metrics.performanceTenure.data
                                            .filter(item => item.score >= 80)
                                            .map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="flex justify-between p-2 text-sm hover:bg-gray-50">
                                                    <span>{item.employee}</span>
                                                    <span className="font-medium text-[#004b9a]">
                                                        {item.score}
                                                    </span>
                                                </div>
                                            ))}
                                    </div>
                                </DataTableCard>
                            </div>

                            {/* Columna Derecha */}
                            <div className="space-y-6 lg:col-span-2">
                                <PerformanceScatterChart
                                    data={metrics.performanceTenure.data}
                                    correlation={
                                        metrics.performanceTenure.correlation
                                    }
                                />

                                <DataTableCard title="Detalle de Evaluaciones">
                                    <div className="overflow-x-auto h-[calc(100%-40px)]">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="text-xs text-gray-500 border-b">
                                                    <th className="pb-2 text-left">
                                                        Empleado
                                                    </th>
                                                    <th className="pb-2 text-right">
                                                        Antigüedad
                                                    </th>
                                                    <th className="pb-2 text-right">
                                                        Puntuación
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {metrics.performanceTenure.data.map(
                                                    (item, index) => (
                                                        <tr
                                                            key={index}
                                                            className="hover:bg-gray-50">
                                                            <td className="py-2 text-sm">
                                                                {item.employee}
                                                            </td>
                                                            <td className="py-2 text-sm text-right">
                                                                {item.tenure.toFixed(
                                                                    4,
                                                                )}{' '}
                                                                años
                                                            </td>
                                                            <td className="py-2 text-sm font-medium text-right text-[#004b9a]">
                                                                {item.score}
                                                            </td>
                                                        </tr>
                                                    ),
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </DataTableCard>
                            </div>
                        </div>

                        {/* Segunda Fila: Heatmap Full Width */}
                        <DataTableCard
                            className="col-span-5"
                            title="Mapa de Calor Jerárquico">
                            <LevelGapsHeatmap
                                data={metrics.levelGaps.heatmap}
                                levels={metrics.levelGaps.levels}
                                departments={metrics.levelGaps.departments}
                            />
                        </DataTableCard>

                        {/* Tercera Fila: 2 Gráficos en Grid 2-columnas */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-6 lg:col-span-1">
                                <DataTableCard
                                    className=""
                                    title="Cumplimiento por Puesto">
                                    <GoalComplianceChart
                                        data={
                                            metrics.goalCompliance.positions
                                                .data
                                        }
                                    />
                                </DataTableCard>
                            </div>
                            <div className="space-y-6 lg:col-span-1">
                                <DataTableCard
                                    className=""
                                    title="Diversidad en Evaluaciones">
                                    <DiversityRadarChart
                                        data={metrics.diversity.chartData}
                                    />
                                </DataTableCard>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PerformanceDashboard
