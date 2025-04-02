import { useState } from 'react'
import axios from '@/lib/axios'

const useCreateVacancies = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    const createVacancies = async (formData) => {
        setLoading(true)
        setError(null)
        setSuccess(false)

        try {
            const response = await axios.post('/api/vacancies', formData)
            setSuccess(true)
            return response.data
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message
            setError(errorMessage)
            throw new Error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return { createVacancies, loading, error, success }
}

export default useCreateVacancies
