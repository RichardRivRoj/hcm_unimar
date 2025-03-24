'use client'

import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect, useState } from 'react'

const fetcher = (url, params) =>
    axios.get(url, { params }).then(res => res.data)

const swrOptions = (params = {}) => ({
    revalidateOnFocus: false,
    shouldRetryOnError: true,
    errorRetryCount: 2,
    fallbackData: params.initialData,
})

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

    const { data: performanceTenure, mutate: mutatePerformance } = useSWR(
        buildKey('performance-tenure'),
        fetcher,
        swrOptions({
            initialData: {
                data: [],
                correlation: 0,
                departments: [],
            },
        }),
    )

    const { data: goalCompliance, mutate: mutateCompliance } = useSWR(
        buildKey('goal-compliance'),
        fetcher,
        swrOptions({
            initialData: {
                overall: {
                    total: 0,
                    compliant: 0,
                    compliance_rate: 0,
                    goal: 75,
                },
                positions: {
                    data: [],
                    current_page: 1,
                    total: 0,
                },
                filters: {
                    departments: [],
                    positions: [],
                },
            },
        }),
    )

    const { data: diversityData, mutate: mutateDiversity } = useSWR(
        buildKey('diversity-evaluations'),
        fetcher,
        swrOptions({
            initialData: {
                labels: [],
                datasets: [],
                filters: {
                    ethnicities: [],
                    genders: [],
                },
            },
        }),
    )

    const { data: levelGaps, mutate: mutateLevelGaps } = useSWR(
        buildKey('level-gaps'),
        fetcher,
        swrOptions({
            initialData: {
                heatmap: [],
                levels: [],
                departments: [],
                colorScale: { min: 0, max: 100 },
            },
        }),
    )

    const handleParamChange = newParams => {
        setParams(prev => ({ ...prev, ...newParams }))
    }

    const refreshAll = () => {
        mutatePerformance()
        mutateCompliance()
        mutateDiversity()
        mutateLevelGaps()

        // Añadir mutaciones para los demás endpoints...
    }

    return {
        metrics: {
            performanceTenure: {
                data: performanceTenure?.data || [],
                correlation: performanceTenure?.correlation || 0,
                departments: performanceTenure?.departments || [],
            },
            goalCompliance: {
                overall: goalCompliance?.overall || {
                    total: 0,
                    compliant: 0,
                    compliance_rate: 0,
                    goal: 75,
                },
                positions: goalCompliance?.positions || {
                    data: [],
                    current_page: 1,
                    total: 0,
                },
                filters: goalCompliance?.filters || {
                    departments: [],
                    positions: [],
                },
            },
            diversity: {
                chartData: {
                    labels: diversityData?.labels || [],
                    datasets: diversityData?.datasets || [],
                },
                filters: diversityData?.filters || {
                    ethnicities: [],
                    genders: [],
                },
            },
            levelGaps: {
                heatmap: levelGaps?.heatmap || [],
                levels: levelGaps?.levels || [],
                departments: levelGaps?.departments || [],
                colorScale: levelGaps?.colorScale || { min: 0, max: 100 }
            },
        },
        params,
        setParams: handleParamChange,
        refresh: refreshAll,
        errors: [
            ...(performanceTenure?.error ? [performanceTenure.error] : []),
            ...(goalCompliance?.error ? [goalCompliance.error] : []),
        ],
    }
}

export default usePerformanceDashboard
