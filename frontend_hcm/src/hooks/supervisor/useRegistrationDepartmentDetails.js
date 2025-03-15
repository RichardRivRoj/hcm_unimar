'use client'

import { useState, useEffect } from 'react'
import axios from '@/lib/axios'

const useSupervisorProgramDetail = (programId) => {
    const [program, setProgram] = useState(null)
    const [participants, setParticipants] = useState([])
    const [filters, setFilters] = useState({
        completion_status: '',
        name: '',
        page: 1,
        per_page: 10
    })
    const [meta, setMeta] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [availableFilters, setAvailableFilters] = useState({
        completion_statuses: []
    })

    const fetchData = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams({
                ...filters,
                page: filters.page
            }).toString()

            const response = await axios.get(`/api/supervisor/registration-history/${programId}?${params}`)
            
            setProgram(response.data.program)
            setParticipants(response.data.participants.data)
            setMeta(response.data.participants.meta)
            setAvailableFilters({
                completion_statuses: response.data.filters.completion_statuses
            })
        } catch (err) {
            setError(err.response?.data?.message || 'Error al cargar el programa')
        } finally {
            setLoading(false)
        }
    }

    const updateParams = (newParams) => {
        setFilters(prev => ({
            ...prev,
            ...newParams,
            page: 1
        }))
    }

    const goToPage = (page) => {
        setFilters(prev => ({ ...prev, page }))
    }

    useEffect(() => {
        if (programId) fetchData()
    }, [programId, filters])

    return {
        program,
        participants,
        filters: availableFilters,
        meta,
        loading,
        error,
        params: filters,
        updateParams,
        goToPage
    }
}

export default useSupervisorProgramDetail