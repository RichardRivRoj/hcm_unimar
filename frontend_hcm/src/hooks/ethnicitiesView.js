import { useState, useEffect } from 'react'
import axios from '@/lib/axios'

const useEthnicities = () => {
    const [ethnicities, setEthnicities] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchEthnicities = async () => {
            try {
                const response = await axios.get('/api/public/ethnicities') // Llama al endpoint del backend
                setEthnicities(response.data)
            } catch (err) {
       
                setError(err)
            } finally {
                setLoading(false)
            }
        }

        fetchEthnicities()
    }, [])

    return { ethnicities, loading, error }
}

export default useEthnicities