import { useState, useEffect } from 'react'
import axios from '@/lib/axios'

const useListResquests = () => {
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchListRequests = async () => {
            try {
                const response = await axios.get('/api/list-requests') // Llama al endpoint del backend
                setRequests(response.data) // Guarda los cargos en el estado
            } catch (err) {
               
                setError(err)
            } finally {
                setLoading(false)
            }
        }

        fetchListRequests()
    }, [])

    return { requests, loading, error }
}

export default useListResquests