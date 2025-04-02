import { useState, useEffect } from 'react'
import axios from '@/lib/axios'

const usePositions = () => {
    const [positions, setPositions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchPositions = async () => {
            try {
                const response = await axios.get('/api/positions') // Llama al endpoint del backend
                setPositions(response.data) // Guarda los cargos en el estado
            } catch (err) {
              
                setError(err)
            } finally {
                setLoading(false)
            }
        }

        fetchPositions()
    }, [])

    return { positions, loading, error }
}

export default usePositions