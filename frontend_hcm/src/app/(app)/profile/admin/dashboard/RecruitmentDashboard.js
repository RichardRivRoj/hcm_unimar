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

const RecruitmentDashboard = () => {
    const [departments, setDepartments] = useState([])
    const { metrics, isLoading } = useRecruitmentDashboard()

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

    if (isLoading) return <StandardLoader />

    return (
          <div className="min-h-screen p-2 bg-gray-50">
            <div className="mx-auto space-y-8 max-w-7xl">
              {/* Header */}
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-[#004b9a]">Dashboard de Reclutamiento</h1>
                <Filters departments={departments} />
              </div>
      
              {/* Grid Principal */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                  title="Tasa de Conversión"
                  value={`${metrics.conversionRate.conversion_rate}%`}
                  description={`${metrics.conversionRate.hired}/${metrics.conversionRate.total_candidates}`}
                />
      
                <MetricCard
                  title="Vacantes Activas"
                  value={metrics.interviewRatio.total.total_vacancies}
                  description="Total abiertas"
                />
      
                <MetricCard
                  title="Entrevistas Totales"
                  value={metrics.interviewRatio.total.total_interviews}
                  description="Últimos 30 días"
                />
      
                <MetricCard
                  title="Ratio Global"
                  value={metrics.interviewRatio.total.global_ratio?.toFixed(2)}
                  description="Entrevistas por vacante"
                />
              </div>
      
              {/* Sección de Gráficos */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <ChartCard title="Tiempo Promedio de Contratación">
                  <AverageHiringTimeChart data={metrics.averageHiringTime} />
                </ChartCard>
      
                <ChartCard title="Distribución por Departamento">
                  
                </ChartCard>
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
