'use client'
import useSWR from 'swr'
import axios from '@/lib/axios'
import { useState } from 'react'

const fetcher = (url, params) => axios.get(url, { params }).then(res => res.data)
const swrOptions = {
    revalidateOnFocus: false,
    shouldRetryOnError: true,
    errorRetryCount: 2,
    dedupingInterval: 10000
}

const usePerformanceDashboard = (initialParams = {}) => {
    const [params, setParams] = useState({
        department_id: null,
        position_id: null,
        demographic: 'gender',
        ...initialParams,
    })

    const buildKey = endpoint => [
        `/api/admin/performance-dashboard/${endpoint}`,
        {
            department_id: params.department_id,
            position_id: params.position_id,
            demographic: params.demographic,
        },
    ]

    // Definir todos los endpoints individualmente
    const performanceTenure = useSWR(buildKey('performance-tenure'), fetcher, swrOptions)
    const goalCompliance = useSWR(buildKey('goal-compliance'), fetcher, swrOptions)
    const diversityData = useSWR(buildKey('diversity-evaluations'), fetcher, swrOptions)
    const levelGaps = useSWR(buildKey('level-gaps'), fetcher, swrOptions)

    // Agrupar endpoints para validación
    const endpoints = {
        performanceTenure,
        goalCompliance,
        diversityData,
        levelGaps
    }

    // Estados unificados
    const isLoading = Object.values(endpoints).some(e => e.isValidating)
    const errors = Object.values(endpoints)
        .map(e => e.error)
        .filter(Boolean)

    const handleParamChange = newParams => {
        setParams(prev => ({ ...prev, ...newParams }))
    }

    const refreshAll = () => {
        Object.values(endpoints).forEach(endpoint => endpoint.mutate())
    }

    return {
        metrics: {
            performanceTenure: {
                data: performanceTenure.data?.data || [],
                correlation: performanceTenure.data?.correlation || 0,
                departments: performanceTenure.data?.departments || [],
            },
            goalCompliance: {
                overall: goalCompliance.data?.overall || {
                    total: 0,
                    compliant: 0,
                    compliance_rate: 0,
                    goal: 75,
                },
                positions: goalCompliance.data?.positions || {
                    data: [],
                    current_page: 1,
                    total: 0,
                },
                filters: goalCompliance.data?.filters || {
                    departments: [],
                    positions: [],
                },
            },
            diversity: {
                chartData: {
                    labels: diversityData.data?.labels || [],
                    datasets: diversityData.data?.datasets || [],
                },
                filters: diversityData.data?.filters || {
                    ethnicities: [],
                    genders: [],
                },
            },
            levelGaps: {
                heatmap: levelGaps.data?.heatmap || [],
                levels: levelGaps.data?.levels || [],
                departments: levelGaps.data?.departments || [],
                colorScale: levelGaps.data?.colorScale || { min: 0, max: 100 }
            },
        },
        params,
        setParams: handleParamChange,
        refresh: refreshAll,
        isLoading,
        errors
    }
}

export default usePerformanceDashboard
