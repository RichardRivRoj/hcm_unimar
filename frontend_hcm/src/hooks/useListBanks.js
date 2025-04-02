import { useState, useEffect } from 'react'
import axios from '@/lib/axios'

const useListBanks = () => {
    const [banks, setBanks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchListBanks = async () => {
            try {
                const response = await axios.get('/api/list-banks') // Llama al endpoint del backend
                setBanks(response.data) // Guarda los cargos en el estado
            } catch (err) {
                
                setError(err)
            } finally {
                setLoading(false)
            }
        }

        fetchListBanks()
    }, [])

    return { banks, loading, error }
}

export default useListBanks