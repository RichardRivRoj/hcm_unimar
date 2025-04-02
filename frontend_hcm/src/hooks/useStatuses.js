import { useState, useEffect } from 'react'
import axios from '@/lib/axios'

const useStatuses = () => {
    const [statuses, setStatuses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchStatuses = async () => {
            try {
                const response = await axios.get('/api/statuses') // Llama al endpoint del backend
                setStatuses(response.data) // Guarda los cargos en el estado
            } catch (err) {
         
                setError(err)
            } finally {
                setLoading(false)
            }
        }

        fetchStatuses()
    }, [])

    return { statuses, loading, error }
}

export default useStatuses