import { useState } from 'react'
import axios from '@/lib/axios'
import { useAuth } from '../auth'

const usePerformanceEvaluations = () => {
    const { user } = useAuth()
    const [unevaluated, setUnevaluated] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [activePeriod, setActivePeriod] = useState(null)
    const [evaluationDetails, setEvaluationDetails] = useState(null) // Nuevo estado para detalles

    const getAuthHeaders = () => ({
        headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json'
        },
    })

    // Método para obtener detalles de evaluación
    const fetchEvaluationDetails = async (employeeId) => {
        setLoading(true)
        setError(null)
        
        try {
            const response = await axios.get(
                `/api/supervisor/evaluations/${employeeId}`,
                getAuthHeaders()
            )

            setEvaluationDetails(response.data)
            return response.data

        } catch (err) {
            const errorData = err.response?.data || {
                message: err.message || 'Error al cargar detalles de evaluación',
                status: err.response?.status,
            }
            
            setError(errorData)
            throw errorData
        } finally {
            setLoading(false)
        }
    }

    // Métodos existentes (sin cambios)
    const createEvaluation = async (evaluationData) => {
        setLoading(true)
        setError(null)
        try {
            const response = await axios.post(
                '/api/supervisor/evaluations',
                evaluationData,
                getAuthHeaders(),
            )

            setUnevaluated(prev =>
                prev.filter(emp => emp.id !== evaluationData.employee_id),
            )

            return response.data
        } catch (err) {
            const errorData = err.response?.data || {
                message: 'Error al crear evaluación',
            }
            setError(errorData)
            throw errorData
        } finally {
            setLoading(false)
        }
    }

    const fetchUnevaluatedEmployees = async () => {
        setLoading(true)
        setError(null)
        
        try {
            const response = await axios.get(
                '/api/supervisor/evaluations/unevaluated-employees',
                getAuthHeaders()
            )

            setUnevaluated(response.data.data)
            setActivePeriod(response.data.active_period)

        } catch (err) {
            const errorData = err.response?.data || {
                message: err.message || 'Error al cargar empleados',
                status: err.response?.status,
                ...(err.response?.status === 400 && { missingDepartment: true }),
                ...(err.response?.status === 404 && { noActivePeriod: true })
            }
            
            setError(errorData)
            throw errorData
        } finally {
            setLoading(false)
        }
    }

    const fetchEvaluationStructure = async () => {
        try {
            setLoading(true)
            const response = await axios.get('/api/supervisor/evaluations/evaluation-structure')
            return response.data.sections
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching structure')
            return []
        } finally {
            setLoading(false)
        }
    }

    return {
        unevaluated,
        activePeriod,
        loading,
        error,
        evaluationDetails, // Nuevo estado expuesto
        createEvaluation,
        fetchUnevaluatedEmployees,
        fetchEvaluationDetails, // Nuevo método expuesto
        fetchEvaluationStructure,
    }
}

export default usePerformanceEvaluations
