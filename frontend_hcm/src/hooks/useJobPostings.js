import { useState, useEffect } from 'react'
import axios from '@/lib/axios'

const useFetchJobPostings = () => {
    const [jobPostings, setJobPostings] = useState([]) // Datos de las vacantes
    const [loading, setLoading] = useState(true) // Estado de carga
    const [error, setError] = useState(null) // Mensajes de error

    useEffect(() => {
        const fetchJobPostings = async () => {
            try {
                const response = await axios.get('/api/public/job-positions') // Petición al backend
                setJobPostings(response.data) // Guardar los datos de las vacantes
            } catch (err) {
                // Manejar errores, pero no redirigir si no está autenticado
                setError(err.response?.data?.message || 'Error al obtener las vacantes')
            } finally {
                setLoading(false) // Finalizar la carga
            }
        }

        fetchJobPostings()
    }, [])

    return { jobPostings, loading, error }
}

export default useFetchJobPostings
