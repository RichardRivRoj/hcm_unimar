import { useState, useEffect } from 'react'
import axios from '@/lib/axios'

const useIdentificacitionTypes = () => {
    const [identifications, setIdentifications] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchIdentifications = async () => {
            try {
                const response = await axios.get('/api/public/identifications') // Llama al endpoint del backend
                setIdentifications(response.data)
            } catch (err) {
         
                setError(err)
            } finally {
                setLoading(false)
            }
        }

        fetchIdentifications()
    }, [])

    return { identifications, loading, error }
}

export default useIdentificacitionTypes
