import { useState, useEffect } from 'react'
import axios from '@/lib/axios'

const usePaginatedJobPostings = (initialPage = 1, perPage = 3) => {
    const [jobPostings, setJobPostings] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [currentPage, setCurrentPage] = useState(initialPage)
    const [totalPages, setTotalPages] = useState(1)
    const [paginationMeta, setPaginationMeta] = useState({})

    const fetchJobPostings = async (page) => {
        setLoading(true)
        setError(null)
        try {
            const response = await axios.get('/api/public/vacancies', {
                params: { page, per_page: perPage },
            })

            // Asegurar que los datos vienen en el formato esperado
            if (response.data && response.data.data) {
                setJobPostings(response.data.data.vacancies || [])
                setTotalPages(response.data.data.pagination?.last_page || 1)
                setPaginationMeta(response.data.data.pagination || {})
            } else {
                throw new Error('Estructura de respuesta inválida')
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Error al obtener las vacantes')
            setJobPostings([]) // Asegurar array vacío en caso de error
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchJobPostings(currentPage)
    }, [currentPage])

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    return {
        jobPostings,
        loading,
        error,
        currentPage,
        totalPages,
        paginationMeta,
        goToPage,
    }
}

export default usePaginatedJobPostings
