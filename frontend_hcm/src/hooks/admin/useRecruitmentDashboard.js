'use client'

import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect, useState } from 'react'

const fetcher = (url, params) =>
    axios.get(url, { params }).then(res => res.data)

const swrOptions = (params = {}) => ({
    revalidateOnFocus: false,
    refreshInterval: 300000,
    shouldRetryOnError: true,
    errorRetryCount: 3,
    dedupingInterval: 10000,
    fallbackData: params.initialData,
})

const useRecruitmentDashboard = (initialParams = {}) => {
    const [departments, setDepartments] = useState([]);
    const [params, setParams] = useState({
        page: 1,
        perPage: 5,
        department_id: [], // Nombre alineado con backend
        time_range: 'month',
        ...initialParams,
    })

    const buildKey = endpoint => [
        `/api/admin/recruitment-dashboard/${endpoint}`,
        {
            page: params.page,
            per_page: params.perPage,
            departments: params.departments,
        },
    ]

    const { data: hiringTime, mutate: mutateHiring } = useSWR(
        buildKey('average-hiring-time'),
        fetcher,
        swrOptions({ initialData: { data: [], meta: {} } }),
    )

    const { data: conversionRate, mutate: mutateConversion } = useSWR(
        buildKey('conversion-rate'),
        fetcher,
        swrOptions({
            initialData: { total_candidates: 0, hired: 0, conversion_rate: 0 },
        }),
    )

    const { data: interviewRatio, mutate: mutateRatio } = useSWR(
        buildKey('interview-ratio', params),
        fetcher,
        swrOptions({
            initialData: {
                data: [],
                total: {
                    total_vacancies: 0,
                    total_interviews: 0,
                    global_ratio: 0,
                },
                meta: { pagination: { current_page: 1, last_page: 1 } },
            },
        }),
    )

    const { data: activeVacancies, mutate: mutateActive } = useSWR(
        buildKey('active-vacancies'),
        fetcher,
        swrOptions({
            initialData: {
                data: [],
                metrics: { global_total: 0 },
                meta: {}
            }
        })
    );

    const { data: initialPerformance, mutate: mutatePermance } = useSWR(
        buildKey('initial-performance'),
        fetcher,
        swrOptions({
            initialData: {
                data: [],
                meta: {}
            }
        })
    );

    const { data: vacancyStatus, mutate: mutateStatus } = useSWR(
        buildKey('vacancy-status'),
        fetcher,
        swrOptions({
            initialData: {
                data: [],
                metrics: { total_vacancies: 0 },
                meta: {}
            }
        })
    );
    
    const { data: genderDistribution, mutate: mutateGender } = useSWR(
        buildKey('candidate-gender'),
        fetcher,
        swrOptions({
            initialData: {
                data: [],
                metrics: { total_candidates: 0 },
                meta: {}
            }
        })
    );

    useEffect(() => {
        axios.get('/api/departments')
            .then(res => setDepartments(res.data))
            .catch(console.error);
    }, []);
    // Añadir similares para los demás endpoints...

    const handleParamChange = newParams => {
        setParams(prev => ({ ...prev, ...newParams }))
    }

    const refreshAll = () => {
        mutateHiring()
        mutateConversion()
        mutateRatio()
        mutateActive()
        mutatePermance()
        mutateStatus()
        mutateGender()
        // Añadir mutaciones para los demás endpoints...
    }

    return {
        metrics: {
            averageHiringTime: hiringTime?.data || [], // Asegúrate que hiringTime también esté correcto
            // Tasa de conversión
            conversionRate: conversionRate?.data || {
                total_candidates: 0,
                hired: 0,
                conversion_rate: 0,
            },
            // Ratio de entrevistas
            interviewRatio: {
                data:
                    interviewRatio?.data?.map(item => ({
                        department_id: item.department_id,
                        department:
                            departments.find(d => d.id === item.department_id)
                                ?.name || 'Sin departamento',
                        total_vacancies: item.total_vacancies,
                        total_interviews: item.total_interviews,
                        ratio:
                            item.total_vacancies > 0
                                ? (
                                      item.total_interviews /
                                      item.total_vacancies
                                  ).toFixed(2)
                                : 0,
                    })) || [],
                meta: interviewRatio?.meta || {},
                globalRatio:
                    interviewRatio?.metrics?.global_ratio?.toFixed(2) || 0,
            },

            activeVacancies: {
                data: activeVacancies?.data || [],
                globalTotal: activeVacancies?.metrics?.global_total || 0
            },

            initialPerformance: initialPerformance?.data || [],

            vacancyStatus: {
                data: vacancyStatus?.data || [],
                total: vacancyStatus?.metrics?.total_vacancies || 0
            },
            genderDistribution: {
                data: genderDistribution?.data || [],
                total: genderDistribution?.metrics?.total_candidates || 0
            },

            meta: {
                hiring: hiringTime?.meta || { current_page: 1, total_pages: 1 },
                interview: interviewRatio?.meta || {
                    pagination: {
                        current_page: 1,
                        last_page: 1,
                    },
                },
            },
        },
        params,
        setParams: handleParamChange,
        refresh: refreshAll,
        isLoading: !hiringTime && !conversionRate && !interviewRatio,
        errors: [
            ...(hiringTime?.error ? [hiringTime.error] : []),
            ...(conversionRate?.error ? [conversionRate.error] : []),
            ...(interviewRatio?.error ? [interviewRatio.error] : []),
        ],
    }
}

export default useRecruitmentDashboard
