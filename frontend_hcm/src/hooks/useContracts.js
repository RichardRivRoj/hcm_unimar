import { useState, useEffect } from 'react'
import axios from '@/lib/axios'

const useContracts = () => {
    const [state, setState] = useState({
        contracts: [],
        personal_info: null,
        salary_info: null,
        meta: {},
        loading: true,
        error: null,
        currentPage: 1,
        totalPages: 1
    })

    const fetchContracts = async (page = 1) => {
        setState(prev => ({...prev, loading: true}))
        try {
            const response = await axios.get(`/api/documents/contracts?page=${page}`)
            
            setState({
                contracts: response.data.contracts || [],
                personal_info: response.data.personal_info || {},
                salary_info: response.data.salary_info || null,
                meta: response.data.meta || {},
                loading: false,
                error: null,
                currentPage: response.data.meta?.current_page || 1,
                totalPages: response.data.meta?.total_pages || 1
            })

        } catch (err) {
            setState(prev => ({
                ...prev,
                error: err.response?.data?.error || 'Error al cargar contratos',
                loading: false
            }))
        }
    }

    useEffect(() => {
        fetchContracts()
    }, [])

    return {
        ...state,
        refresh: fetchContracts,
        goToNextPage: () => state.currentPage < state.totalPages && fetchContracts(state.currentPage + 1),
        goToPrevPage: () => state.currentPage > 1 && fetchContracts(state.currentPage - 1)
    }
}

export default useContracts