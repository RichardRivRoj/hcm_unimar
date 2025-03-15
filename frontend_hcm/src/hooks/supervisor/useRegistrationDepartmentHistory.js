'use client'

import { useState, useEffect } from 'react'
import axios from '@/lib/axios'

const useRegistrationDepartmentHistory = () => {
    const [programs, setPrograms] = useState([])
    const [filters, setFilters] = useState({
        training_type_id: '',
        page: 1,
        per_page: 5
    })
    const [meta, setMeta] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [availableFilters, setAvailableFilters] = useState({
        training_types: []
    })

    const fetchData = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams({
                ...filters,
                page: filters.page
            }).toString()

            const response = await axios.get(`/api/supervisor/registration-history?${params}`)
            
            setPrograms(response.data.data)
            setMeta(response.data.meta)
            setAvailableFilters({
                training_types: response.data.filters.training_types
            })
        } catch (err) {
            setError(err.response?.data?.message || 'Error al cargar los programas')
        } finally {
            setLoading(false)
        }
    }

    const updateParams = (newParams) => {
        setFilters(prev => ({
            ...prev,
            ...newParams,
            page: 1 // Resetear a primera página al cambiar filtros
        }))
    }

    const goToPage = (page) => {
        setFilters(prev => ({ ...prev, page }))
    }

    useEffect(() => {
        fetchData()
    }, [filters])

    return {
        programs,
        filters: availableFilters,
        meta,
        loading,
        error,
        params: filters,
        updateParams,
        goToPage
    }
}

export default useRegistrationDepartmentHistory