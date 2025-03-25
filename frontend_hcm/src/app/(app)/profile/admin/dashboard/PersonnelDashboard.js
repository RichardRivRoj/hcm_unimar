'use client'

import { useEffect, useState } from 'react'
import usePersonnelDashboard from '@/hooks/admin/usePersonnelDashboard'
import DemographicDiversityChart from '@/components/Charts/DemographicDiversityChart'
import Filters from '@/components/Dashboard/Filters'
import StandardLoader from '@/components/StandardLoader'
import MaritalStatusTreemap from '@/components/Charts/MaritalStatusTreemap'
import DataTableCard from '@/components/Dashboard/DataTableCard'
import ChartCard from '@/components/Dashboard/ChartCard'
import AgePyramidChart from '@/components/Charts/AgePyramidChart'
import LevelDistributionChart from '@/components/Charts/LevelDistributionChart'
import RequestTypeWaterfallChart from '@/components/Charts/RequestTypeWaterfallChart'

const PersonnelDashboard = () => {
    const { metrics, params, setParams, errors } = usePersonnelDashboard()
    const [timeRanges, setTimeRanges] = useState([])

    useEffect(() => {
        if (metrics.diversity.filters.time_ranges.length > 0) {
            setTimeRanges(metrics.diversity.filters.time_ranges)
        }
    }, [metrics.diversity.filters])

    const handleTimeRangeChange = value => {
        setParams({ time_range: value })
    }

    if (!metrics.diversity.filters.time_ranges.length) return <StandardLoader />

    return (
        <div className="min-h-screen p-4 bg-gray-50">
            <div className="mx-auto space-y-8 max-w-7xl">
                {/* Header y Filtros - Añadimos margen inferior */}
                <div className="mb-8 space-y-4">
                    <h1 className="text-2xl font-bold text-[#004b9a] md:text-3xl">
                        Gestión del Personal
                    </h1>
                    <Filters
                        filters={[
                            {
                                label: 'Rango Temporal',
                                value: params.time_range,
                                options: timeRanges,
                                onChange: e =>
                                    handleTimeRangeChange(e.target.value),
                            },
                        ]}
                    />
                </div>

                {/* Primera sección de 3 columnas - Añadimos gap responsive */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                    <DemographicDiversityChart
                        data={metrics.diversity.gender}
                        title="Distribución por Género"
                    />

                    <DemographicDiversityChart
                        data={metrics.diversity.ethnicity}
                        title="Distribución por Etnia"
                    />

                    <DemographicDiversityChart
                        data={metrics.diversity.country}
                        title="Distribución por País"
                    />
                </div>

                {/* Sección de Estado Civil - Altura fija y margen inferior */}
                <div className="grid grid-cols-1 gap-6 mb-8">
                    <ChartCard
                        title="Distribución por Estado Civil"
                        className="h-[350px] bg-white rounded-lg shadow-md">
                        <MaritalStatusTreemap
                            data={metrics.diversity.marital_status}
                            className="h-auto"
                        />
                    </ChartCard>
                </div>

                {/* Sección de 2 columnas - Añadimos igualación de altura */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
                    <div className='col-span-2'>
                    <ChartCard
                        title="Pirámide Generacional"
                        className="h-[350px] bg-white rounded-lg shadow-md">
                        <AgePyramidChart
                            data={metrics.diversity.age_pyramid}
                            className="h-full"
                        />
                    </ChartCard>
                    </div>
                    
                    <div className='col-span-1'>
                    <ChartCard
                        title="Distribución por Nivel"
                        className="h-[350px] bg-white rounded-lg shadow-md">
                        <LevelDistributionChart
                            data={metrics.diversity.level_distribution}
                            className="h-full"
                        />
                    </ChartCard>
                    </div>
                </div>

                {/* Gráfico de Cascada - Margen superior y altura controlada */}
                <ChartCard
                    title="Cantidad de Solicitudes por Tipo"
                    className=" h-[420px] bg-white rounded-lg shadow-md">
                    <RequestTypeWaterfallChart
                        data={metrics.diversity.request_types}
                        className="h-[200px]"
                    />
                </ChartCard>
            </div>
        </div>
    )
}

export default PersonnelDashboard
