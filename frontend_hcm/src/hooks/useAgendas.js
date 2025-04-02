import { useState, useEffect } from 'react'
import axios from '@/lib/axios'

const useAgendas = (candidateId, filters) => {
    const [agendas, setAgendas] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [meta, setMeta] = useState({})

    useEffect(() => {
        if (!candidateId) return // No hacer la solicitud si candidateId no está disponible

        const fetchAgendas = async () => {
            try {
                const response = await axios.get(`/api/candidates/${candidateId}/agendas`, {
                    params: filters, // Enviar los filtros como parámetros
                })

                if (response.data.success) {
                    setAgendas(response.data.data) // Guardar las agendas
                    setMeta(response.data.meta) // Guardar la metadata (paginación)
                }
            } catch (err) {
                setError(err.message || 'Error al obtener las agendas')
            } finally {
                setLoading(false)
            }
        }

        fetchAgendas()
    }, [candidateId, filters]) // Ejecutar el efecto cuando cambien candidateId o los filtros

    return { agendas, loading, meta, error }
}

export default useAgendas