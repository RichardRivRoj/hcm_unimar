'use client'

import { useState, useEffect } from 'react'
import axios from '@/lib/axios'

export const useRegistrationProgramDetail = (programId) => {
    const [data, setData] = useState({
        program: null,
        participants: [],
        filters: {
            completion_statuses: []
        },
        meta: {}
    })
    
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [params, setParams] = useState({
        page: 1,
        per_page: 10,
        completion_status: '',
        name: ''
    })

    const fetchProgramDetail = async () => {
        try {
            setLoading(true)
            setError(null)
            
            const response = await axios.get(`/api/admin/registration-history/${programId}`, {
                params: {
                    ...params,
                    page: params.page
                }
            })

            setData({
                program: response.data.program,
                participants: response.data.participants.data,
                filters: response.data.filters || { completion_statuses: [] },
                meta: response.data.participants.meta
            })
        } catch (err) {
            setError(err.response?.data?.message || 'Error cargando detalles del programa')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if(programId) fetchProgramDetail()
    }, [programId, params.page, params.per_page, params.completion_status, params.name])

    const updateParams = newParams => {
        setParams(prev => ({
            ...prev,
            ...newParams,
            page: 1
        }))
    }

    return {
        ...data,
        loading,
        error,
        params,
        updateParams,
        goToPage: page => setParams(prev => ({ ...prev, page }))
    }
}
