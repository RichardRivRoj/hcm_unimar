'use client'

import useSWR from 'swr'
import axios from '@/lib/axios'
import { useState } from 'react'

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
    const [params, setParams] = useState({
        page: 1,
        perPage: 5,
        departments: [],
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

    // Añadir similares para los demás endpoints...

    const handleParamChange = newParams => {
        setParams(prev => ({ ...prev, ...newParams }))
    }

    const refreshAll = () => {
        mutateHiring()
        mutateConversion()
        mutateRatio()
        // Añadir mutaciones para los demás endpoints...
    }

    return {
        metrics: {
            averageHiringTime: hiringTime?.data || [], // Asegúrate que hiringTime también esté correcto
            conversionRate: conversionRate || {
                // Quitar .data aquí
                total_candidates: 0,
                hired: 0,
                conversion_rate: 0,
            },
            interviewRatio: {
                data: interviewRatio?.data || [],
                total: interviewRatio?.total || {
                    total_vacancies: 0,
                    total_interviews: 0,
                    global_ratio: 0,
                },
            },
            meta: {
                hiring: hiringTime?.meta || { current_page: 1, total_pages: 1 },
                interview: interviewRatio?.meta || { 
                    pagination: { 
                        current_page: 1, 
                        last_page: 1 
                    } 
                }
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
