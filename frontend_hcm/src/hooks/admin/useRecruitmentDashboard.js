'use client'
import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect, useState } from 'react'

const fetcher = (url, params) => axios.get(url, { params }).then(res => res.data)
const swrOptions = { 
    revalidateOnFocus: false,
    shouldRetryOnError: true,
    errorRetryCount: 3,
    dedupingInterval: 10000
}

const useRecruitmentDashboard = (initialParams = {}) => {
    const [departments, setDepartments] = useState([])
    const [params, setParams] = useState({
        page: 1,
        perPage: 5,
        department_id: [],
        time_range: 'month',
        ...initialParams
    })

    const buildKey = endpoint => [
        `/api/admin/recruitment-dashboard/${endpoint}`,
        params
    ]

    // Definir cada endpoint individualmente
    const hiringTime = useSWR(buildKey('average-hiring-time'), fetcher, swrOptions)
    const conversionRate = useSWR(buildKey('conversion-rate'), fetcher, swrOptions)
    const interviewRatio = useSWR(buildKey('interview-ratio'), fetcher, swrOptions)
    const activeVacancies = useSWR(buildKey('active-vacancies'), fetcher, swrOptions)
    const initialPerformance = useSWR(buildKey('initial-performance'), fetcher, swrOptions)
    const vacancyStatus = useSWR(buildKey('vacancy-status'), fetcher, swrOptions)
    const genderDistribution = useSWR(buildKey('candidate-gender'), fetcher, swrOptions)

    // Agrupar endpoints para validación
    const endpoints = {
        hiringTime,
        conversionRate,
        interviewRatio,
        activeVacancies,
        initialPerformance,
        vacancyStatus,
        genderDistribution
    }

    // Estados de carga y errores
    const isLoading = Object.values(endpoints).some(e => e.isValidating)
    const errors = Object.values(endpoints)
        .map(e => e.error)
        .filter(Boolean)

    useEffect(() => {
        const loadDepartments = async () => {
            try {
                const response = await axios.get('/api/departments')
                setDepartments(response.data || [])
            } catch (error) {
                console.error('Error fetching departments:', error)
            }
        }
        loadDepartments()
    }, [])

    const handleParamChange = newParams => {
        setParams(prev => ({ ...prev, ...newParams }))
    }

    const refreshAll = () => {
        Object.values(endpoints).forEach(endpoint => endpoint.mutate())
    }

    return {
        metrics: {
            averageHiringTime: hiringTime.data?.data || [],
            conversionRate: {
                ...conversionRate.data?.data,
                conversion_rate: conversionRate.data?.data?.conversion_rate || 0
            },
            interviewRatio: {
                data: interviewRatio.data?.data?.map(item => ({
                    department_id: item.department_id,
                    department: departments.find(d => d.id === item.department_id)?.name || 'Sin departamento',
                    total_vacancies: item.total_vacancies || 0,
                    total_interviews: item.total_interviews || 0,
                    ratio: item.total_vacancies > 0 
                        ? (item.total_interviews / item.total_vacancies).toFixed(2)
                        : 0
                })) || [],
                meta: interviewRatio.data?.meta || {},
                globalRatio: interviewRatio.data?.metrics?.global_ratio?.toFixed(2) || 0
            },
            activeVacancies: {
                data: activeVacancies.data?.data || [],
                globalTotal: activeVacancies.data?.metrics?.global_total || 0
            },
            initialPerformance: initialPerformance.data?.data || [],
            vacancyStatus: {
                data: vacancyStatus.data?.data || [],
                total: vacancyStatus.data?.metrics?.total_vacancies || 0
            },
            genderDistribution: {
                data: genderDistribution.data?.data || [],
                total: genderDistribution.data?.metrics?.total_candidates || 0
            }
        },
        params,
        setParams: handleParamChange,
        refresh: refreshAll,
        isLoading,
        errors
    }
}

export default useRecruitmentDashboard
