import { useState, useEffect } from 'react'
import axios from '@/lib/axios'

const useAgendaResults = (filters) => {
    const [data, setData] = useState([])
    const [meta, setMeta] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const response = await axios.get('/api/agenda-results', {
                    params: {
                        page: filters.page,
                        search: filters.search,
                        sort_by: filters.sortBy,
                        sort_order: filters.sortOrder,
                        vacancy_id: filters.vacancyId
                    }
                })
                
                // Los datos ya vienen como array desde el backend
                setData(response.data.data)
                setMeta(response.data.meta)
            } catch (err) {
                setError(err)
            } finally {
                setLoading(false)
            }
        }

        const debounceTimer = setTimeout(() => {
            fetchData()
        }, 500) // Retraso de 500ms

        return () => clearTimeout(debounceTimer) // Limpiar timer
    }, [filters])

    return { data, meta, loading, error }
}

export default useAgendaResults