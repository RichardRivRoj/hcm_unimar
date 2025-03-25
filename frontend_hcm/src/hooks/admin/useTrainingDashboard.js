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

const useTrainingDashboard = (initialParams = {}) => {
    const [params, setParams] = useState({
        department_id: null,
        time_range: 'all_time',
        training_type_id: null,
        page: 1,
        ...initialParams,
    })

    const buildKey = endpoint => [
        `/api/admin/training-dashboard/${endpoint}`,
        {
            department_id: params.department_id,
            time_range: params.time_range,
            training_type_id: params.training_type_id,
            page: params.page,
        }
    ]

    // Definir todos los endpoints
    const participation = useSWR(buildKey('training-participation'), fetcher, swrOptions)
    const completion = useSWR(buildKey('program-completion'), fetcher, swrOptions)
    const scores = useSWR(buildKey('average-scores'), fetcher, swrOptions)
    const activePrograms = useSWR(buildKey('active-programs'), fetcher, swrOptions)
    const impact = useSWR(buildKey('evaluation-impact'), fetcher, swrOptions)

    // Agrupar endpoints para gestión centralizada
    const endpoints = {
        participation,
        completion,
        scores,
        activePrograms,
        impact
    }

    // Estados unificados
    const isLoading = Object.values(endpoints).some(e => e.isValidating)
    const errors = Object.values(endpoints)
        .map(e => e.error)
        .filter(Boolean)

    const handleParamChange = newParams => {
        setParams(prev => ({
            ...prev,
            ...newParams,
            ...(newParams.time_range && { page: 1 }) // Reset paginación
        }))
    }

    const changePage = newPage => {
        setParams(prev => ({ ...prev, page: newPage }))
    }

    const refreshAll = () => {
        Object.values(endpoints).forEach(endpoint => endpoint.mutate())
    }

    return {
        metrics: {
            participation: {
                overall: participation.data?.overall || {
                    enrolled: 0,
                    total_employees: 0,
                    participation_rate: 0,
                },
                departments: participation.data?.by_department?.data || [],
                pagination: {
                    currentPage: participation.data?.by_department?.current_page || 1,
                    totalPages: Math.ceil(
                        (participation.data?.by_department?.total || 0) / 5
                    ),
                    totalItems: participation.data?.by_department?.total || 0,
                },
                filters: participation.data?.filters || {
                    departments: [],
                    time_ranges: [],
                },
            },
            completion: {
                overall: completion.data?.overall || {
                    total_enrollments: 0,
                    completed: 0,
                    completion_rate: 0,
                },
                statuses: completion.data?.by_status || [],
                filters: completion.data?.filters || { time_ranges: [] },
            },
            scores: {
                average: scores.data?.overall || { average_score: 0, total_graded: 0 },
                distribution: scores.data?.distribution || [],
                filters: scores.data?.filters || { time_ranges: [] }
            },
            activePrograms: {
                overall: activePrograms.data?.overall || { total_active: 0 },
                types: activePrograms.data?.by_type?.data || [],
                pagination: {
                    currentPage: activePrograms.data?.by_type?.current_page || 1,
                    totalPages: activePrograms.data?.by_type?.last_page || 1,
                    totalItems: activePrograms.data?.by_type?.total || 0
                },
                filters: activePrograms.data?.filters || { training_types: [] }
            },
            impact: {
                chartData: {
                    labels: impact.data?.labels || [],
                    datasets: impact.data?.datasets || []
                },
                filters: impact.data?.filters || { time_ranges: [] }
            }
        },
        params,
        setParams: handleParamChange,
        changePage,
        refresh: refreshAll,
        isLoading,
        errors
    }
}

export default useTrainingDashboard
