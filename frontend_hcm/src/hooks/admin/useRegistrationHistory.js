'use client'

import { useState, useEffect } from 'react'
import axios from '@/lib/axios'

export const useRegistrationHistory = (initialParams = {}) => {
    const [data, setData] = useState({
        programs: [],
        meta: {},
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [params, setParams] = useState({
        page: 1,
        per_page: 10,
        ...initialParams,
    })

    const fetchPrograms = async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await axios.get('/api/admin/registration-history', {
                params: {
                    ...params,
                    page: params.page,
                },
            })

            setData({
                programs: response.data.data,
                filters: response.data.filters,
                meta: response.data.meta,
            })
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching programs')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPrograms()
    }, [
        params.page,
        params.per_page,
        params.visibility_id,
        params.training_type_id,
    ])

    const updateParams = newParams => {
        setParams(prev => ({
            ...prev,
            ...newParams,
            page: 1, // Reset to first page when filters change
        }))
    }

    return {
        ...data,
        loading,
        error,
        params,
        updateParams,
        goToPage: page => setParams(prev => ({ ...prev, page })),
    }
}
