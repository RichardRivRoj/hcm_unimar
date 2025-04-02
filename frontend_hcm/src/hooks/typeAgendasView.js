import { useState, useEffect } from 'react'
import axios from '@/lib/axios'

const useTypeAgendas = () => {
    const [typeAgendas, setTypeAgendas] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchTypeAgendas = async () => {
            try {
                const response = await axios.get('/api/type_agendas') // Llama al endpoint del backend
                setTypeAgendas(response.data)
            } catch (err) {
              
                setError(err)
            } finally {
                setLoading(false)
            }
        }

        fetchTypeAgendas()
    }, [])

    return { typeAgendas, loading, error }
}

export default useTypeAgendas