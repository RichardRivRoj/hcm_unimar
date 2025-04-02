import { useState, useEffect } from 'react'
import axios from '@/lib/axios'

const useAgendaResultShow = (id) => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/agenda-results/${id}`)
                setData(response.data.data)
            } catch (err) {
                setError(err.response?.data?.message ||
                    error.response?.data?.errors?.end_date ||
                    error.response?.data?.errors?.start_date || 
                    'Error al cargar los detalles')
            } finally {
                setLoading(false)
            }
        }

        if(id) fetchData()
    }, [id])

    return { data, loading, error }
}

export default useAgendaResultShow