import { useState, useEffect } from 'react'
import axios from '@/lib/axios'

export const useAdminRequests = (initialFilters = {}) => {
    const [data, setData] = useState([])
    const [singleData, setSingleData] = useState(null)
    const [meta, setMeta] = useState({})
    const [loading, setLoading] = useState(true)
    const [singleLoading, setSingleLoading] = useState(false)
    const [error, setError] = useState(null)
    const [singleError, setSingleError] = useState(null)

    const [filters, setFilters] = useState({
        search: '',
        request_type: '',
        status: '',
        ...initialFilters,
    })

    // Obtener lista de solicitudes
    const fetchRequests = async (page = 1) => {
        try {
            setLoading(true)

            const cleanFilters = Object.fromEntries(
                Object.entries(filters).filter(([, value]) => value !== ''),
            )

            const response = await axios.get('/api/admin/requests', {
                params: { page, ...cleanFilters },
            })

            setData(response.data.data)
            setMeta(response.data.meta)
            setError(null)
        } catch (err) {
            setError(
                err.response?.data || {
                    error: 'Error',
                    message: 'Error al cargar solicitudes',
                },
            )
        } finally {
            setLoading(false)
        }
    }

    // Obtener detalle de una solicitud
    const fetchSingleRequest = async id => {
        try {
            setSingleLoading(true)
            setSingleError(null)

            const response = await axios.get(`/api/admin/requests/${id}`) // Usar id directamente

            // Mapeo correcto de la respuesta
            const mappedData = {
                personal_info: response.data.personal_info,
                solicitud: response.data.solicitud,
                contratos: response.data.contratos,
            }

            setSingleData(mappedData)
        } catch (err) {
            setSingleError({
                error: 'Error',
                message:
                    err.response?.data?.message ||
                    'Error al cargar detalle de solicitud',
            })
        } finally {
            setSingleLoading(false)
        }
    }

   

    const updateFilter = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }))
    }

    useEffect(() => {
        fetchRequests()
    }, [filters])

    return {
        // Listado
        data,
        meta,
        loading,
        error,
        filters,
        updateFilter,
        refetch: fetchRequests,

        // Detalle individual
        singleData,
        singleLoading,
        singleError,
        fetchSingleRequest,

    }
}
