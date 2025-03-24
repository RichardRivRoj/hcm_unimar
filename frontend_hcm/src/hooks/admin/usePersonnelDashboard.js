'use client'

import useSWR from 'swr'
import axios from '@/lib/axios'
import { useState } from 'react'

const fetcher = (url, params) => axios.get(url, { params }).then(res => res.data)
const swrOptions = (params = {}) => ({
    revalidateOnFocus: false,
    shouldRetryOnError: true,
    errorRetryCount: 2,
    fallbackData: params.initialData,
})

const usePersonnelDashboard = (initialParams = {}) => {
    const [params, setParams] = useState({
        time_range: 'all_time',
        ...initialParams
    })

    const buildKey = endpoint => [
        `/api/admin/personnel-dashboard/${endpoint}`,
        { time_range: params.time_range }
    ]

    const { data: diversityData, mutate: mutateDiversity, error: diversityError } = useSWR(
        buildKey('demographic-diversity'),
        fetcher,
        swrOptions
    )

    const handleParamChange = newParams => {
        setParams(prev => ({ ...prev, ...newParams }))
    }

    const refreshAll = () => {
        mutateDiversity()
        // Añadir mutaciones para los demás endpoints...
    }

    return {
        metrics: {
            diversity: {
                gender: diversityData?.gender || [],
                ethnicity: diversityData?.ethnicity || [],
                country: diversityData?.country || [],
                marital_status: diversityData?.marital_status || [],
                age_pyramid: diversityData?.age_pyramid || [],
                level_distribution: diversityData?.level_distribution || [],
                filters: diversityData?.filters || { time_ranges: [] }
            }
        },
        params,
        setParams: handleParamChange,
        refresh: refreshAll,
        errors: { diversity: diversityError }
    }
}

export default usePersonnelDashboard