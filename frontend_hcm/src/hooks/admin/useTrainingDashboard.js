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
        },
    ]

    const {
        data: participationData,
        error: participationError,
        mutate: mutateParticipation,
    } = useSWR(
        buildKey('training-participation'),
        fetcher,
        swrOptions({
            initialData: {
                overall: {
                    enrolled: 0,
                    total_employees: 0,
                    participation_rate: 0,
                },
                by_department: { data: [], current_page: 1, total: 0 },
                filters: { departments: [], time_ranges: [] },
            },
        }),
    )


    const {
        data: completionData,
        error: completionError,
        mutate: mutateCompletion,
    } = useSWR(
        buildKey('program-completion'),
        fetcher,
        swrOptions({
            initialData: {
                overall: {
                    total_enrollments: 0,
                    completed: 0,
                    completion_rate: 0,
                },
                by_status: [],
                filters: { time_ranges: [] },
            },
        }),
    )

    const { 
        data: scoresData, 
        error: scoresError,
        mutate: mutateScores 
    } = useSWR(
        buildKey('average-scores'),
        fetcher,
        swrOptions({
            initialData: {
                overall: { average_score: 0, total_graded: 0 },
                distribution: [],
                filters: { time_ranges: [] }
            }
        })
    );

    const { 
        data: activeProgramsData, 
        error: activeProgramsError,
        mutate: mutateActivePrograms 
    } = useSWR(
        buildKey('active-programs'),
        fetcher,
        swrOptions({
            initialData: {
                overall: { total_active: 0 },
                by_type: { data: [], current_page: 1, total: 0 },
                filters: { training_types: [], time_ranges: [] }
            }
        })
    );

    const { 
        data: impactData, 
        error: impactError,
        mutate: mutateImpact 
    } = useSWR(
        buildKey('evaluation-impact'),
        fetcher,
        swrOptions({
            initialData: {
                labels: [],
                datasets: [],
                filters: { time_ranges: [] }
            }
        })
    );

    const handleParamChange = newParams => {
        setParams(prev => ({
            ...prev,
            ...newParams,
            ...(newParams.time_range ? { page: 1 } : {}), // Reset paginación al cambiar filtros
        }))
    }

    const changePage = newPage => {
        setParams(prev => ({ ...prev, page: newPage }))
    }

    const refreshAll = () => {
        mutateParticipation()
        mutateCompletion()
        mutateScores()
        mutateActivePrograms()
        mutateImpact()
        // Añadir mutaciones para los demás endpoints...
    }

    return {
        metrics: {
            participation: {
                overall: participationData?.overall || {
                    enrolled: 0,
                    total_employees: 0,
                    participation_rate: 0,
                },
                departments: participationData?.by_department?.data || [], // Acceso directo a data
                pagination: {
                    currentPage:
                        participationData?.by_department?.current_page || 1,
                    totalPages: Math.ceil(
                        (participationData?.by_department?.total || 0) / 5,
                    ),
                    totalItems: participationData?.by_department?.total || 0,
                },
                filters: participationData?.filters || {
                    departments: [],
                    time_ranges: [],
                },
            },
            completion: {
                overall: completionData?.overall || {
                    total_enrollments: 0,
                    completed: 0,
                    completion_rate: 0,
                },
                statuses: completionData?.by_status || [],
                filters: completionData?.filters || { time_ranges: [] },
            },
            scores: {
                average: scoresData?.overall || { average_score: 0, total_graded: 0 },
                distribution: scoresData?.distribution || [],
                filters: scoresData?.filters || { time_ranges: [] }
            },
            activePrograms: {
                overall: activeProgramsData?.overall || { total_active: 0 },
                types: activeProgramsData?.by_type?.data || [],
                pagination: {
                    currentPage: activeProgramsData?.by_type?.current_page || 1,
                    totalPages: activeProgramsData?.by_type?.last_page || 1,
                    totalItems: activeProgramsData?.by_type?.total || 0
                },
                filters: activeProgramsData?.filters || { training_types: [] }
            },
            impact: {
                chartData: {
                    labels: impactData?.labels || [],
                    datasets: impactData?.datasets || []
                },
                filters: impactData?.filters || { time_ranges: [] }
            }
        },
        params,
        setParams: handleParamChange,
        changePage,
        refresh: refreshAll,
        errors: { participation: participationError, completion: completionError, score: scoresError, active: activeProgramsError, impact: impactError },
    }
}

export default useTrainingDashboard
