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
                {/* Header y Filtros */}
                <div className="space-y-4">
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

                {/* Grillas de Gráficos */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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

                <div className="grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-1">
                <div className='h-[400px] w-full'>
                    <ChartCard
                    title={'Distribución por Estado Civil'}
                    className='h-40px'
                    >
                    
                        <MaritalStatusTreemap
                            data={metrics.diversity.marital_status}
                        />
                        
                    </ChartCard>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-2">
                    <ChartCard
                    title={'Pirámide Generacional'}
                    >
                        <AgePyramidChart
                            data={metrics.diversity.age_pyramid}
                        />
                    </ChartCard>
                    
                    <ChartCard
                    title={'Distribución po Nivel'}
                    >
                        <LevelDistributionChart
                            data={metrics.diversity.level_distribution}
                        />
                    </ChartCard>
                </div>
            </div>
        </div>
    )
}

export default PersonnelDashboard
