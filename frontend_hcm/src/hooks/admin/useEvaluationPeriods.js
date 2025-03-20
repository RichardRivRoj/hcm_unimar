import axios from '@/lib/axios'
import { useCallback, useEffect, useState } from 'react'

const useEvaluationPeriods = () => {
    const [periods, setPeriods] = useState([])
    const [meta, setMeta] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchEvaluationPeriods = useCallback(async (params = {}) => {
        try {
            setLoading(true)
            setError(null)

            const response = await axios.get('/api/admin/evaluation-periods', {
                params: {
                    page: 1,
                    per_page: 5,
                    ...params,
                },
            })

            setPeriods(response.data.data)
            setMeta(response.data.meta)
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching periods')
        } finally {
            setLoading(false)
        }
    }, [])

    const createEvaluationPeriod = useCallback(
        async formData => {
            try {
                setLoading(true)
                setError(null)

                const response = await axios.post(
                    '/api/admin/evaluation-periods',
                    formData,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    },
                )

                await fetchEvaluationPeriods()
                return response.data
            } catch (err) {
                const errorData = err.response?.data || {
                    message: 'Error de conexión con el servidor',
                }

                // Propagamos toda la respuesta de error
                throw {
                    message: errorData.message,
                    errors: errorData.errors || null,
                    status: err.response?.status,
                }
            } finally {
                setLoading(false)
            }
        },
        [fetchEvaluationPeriods],
    )

    const updateEvaluationPeriod = useCallback(
        async (id, formData) => {
            try {
                setLoading(true)
                setError(null)

                const response = await axios.put(
                    `/api/admin/evaluation-periods/${id}`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    },
                )

                await fetchEvaluationPeriods()
                return response.data
            } catch (err) {
                const errorData = err.response?.data || {
                    message: 'Error de conexión con el servidor',
                }

                throw {
                    message: errorData.message,
                    errors: errorData.errors || null,
                    status: err.response?.status,
                }
            } finally {
                setLoading(false)
            }
        },
        [fetchEvaluationPeriods],
    )

    const deleteEvaluationPeriod = useCallback(
        async id => {
            try {
                setLoading(true)
                setError(null)

                const response = await axios.delete(
                    `/api/admin/evaluation-periods/${id}`,
                )

                await fetchEvaluationPeriods()
                return response.data
            } catch (err) {
                const errorData = err.response?.data || {
                    message: 'Error de conexión con el servidor',
                }

                throw {
                    message: errorData.message,
                    errors: errorData.errors || null,
                    status: err.response?.status,
                }
            } finally {
                setLoading(false)
            }
        },
        [fetchEvaluationPeriods],
    )

    useEffect(() => {
        const interval = setInterval(() => {
            fetchEvaluationPeriods()
        }, 300000) // Actualizar cada 5 minutos

        return () => clearInterval(interval)
    }, [fetchEvaluationPeriods])

    return {
        periods,
        meta,
        loading,
        error,
        fetchEvaluationPeriods,
        createEvaluationPeriod,
        updateEvaluationPeriod,
        deleteEvaluationPeriod,
    }
}

export default useEvaluationPeriods
