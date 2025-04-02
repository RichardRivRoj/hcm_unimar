import { useState, useEffect } from 'react'
import axios from '@/lib/axios'

const useVacancies = (page = 1, filters = {}) => {
    const [vacancies, setVacancies] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [paginationMeta, setPaginationMeta] = useState({})

    useEffect(() => {
        const fetchVacancies = async () => {
            try {
                setLoading(true)

                // Filtramos los parámetros vacíos
                const cleanFilters = Object.fromEntries(
                    Object.entries(filters).filter(([, value]) => value !== '')
                )

                const params = new URLSearchParams({
                    page,
                    ...cleanFilters ,
                }).toString()
                const response = await axios.get(
                    `/api/vacancies?page=${params}`,
                )
                const { data, meta } = response.data

                setVacancies(data)
                setPaginationMeta(meta)
                setError(null)
            } catch (err) {
                setError(err.message || 'Error al cargar las vacantes')
            } finally {
                setLoading(false)
            }
        }

        fetchVacancies()
    }, [page, filters])

    return {
        vacancies,
        loading,
        error,
        paginationMeta,
    }
}

export default useVacancies
