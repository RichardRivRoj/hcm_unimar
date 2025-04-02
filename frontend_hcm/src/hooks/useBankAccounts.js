import { useState, useEffect } from 'react'
import axios from '@/lib/axios'

const useBankAccounts = () => {
    const [state, setState] = useState({
        personal_info: null,
        bank_accounts: [],
        meta: {},
        loading: true,
        error: null,
        currentPage: 1,
        totalPages: 1
    })

    const fetchBankAccounts = async (page = 1) => {
        setState(prev => ({...prev, loading: true}))
        try {
            const response = await axios.get(`/api/documents/banks?page=${page}`)
            
            setState({
                personal_info: response.data.personal_info || {},
                bank_accounts: response.data.bank_accounts || [],
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
        fetchBankAccounts()
    }, [])

    return {
        ...state,
        refresh: fetchBankAccounts,
        goToNextPage: () => state.currentPage < state.totalPages && fetchBankAccounts(state.currentPage + 1),
        goToPrevPage: () => state.currentPage > 1 && fetchBankAccounts(state.currentPage - 1)
    }
}

export default useBankAccounts