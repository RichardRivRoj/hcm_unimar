import { useState, useEffect } from 'react'
import axios from '@/lib/axios'

const useGenders = () => {
    const [genders, setGenders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchGenders = async () => {
            try {
                const response = await axios.get('/api/public/genders') // Llama al endpoint del backend
                setGenders(response.data)
            } catch (err) {
              
                setError(err)
            } finally {
                setLoading(false)
            }
        }

        fetchGenders()
    }, [])

    return { genders, loading, error }
}

export default useGenders