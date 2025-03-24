import { useState } from 'react'
import axios from '@/lib/axios'

const useScheduleInterview = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    const scheduleInterview = async formData => {
        setLoading(true)
        setError(null)
        setSuccess(false)

        try {
            const response = await axios.post(`api/agendas`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            setSuccess(true)
            return response.data
        } catch (error) {
            const errorMessage =
                Object.values(error.response?.data?.errors || {})
                    .flat()
                    .join('\n ') ||
                error.response?.data?.message ||
                'Error al agendar la entrevista.'

            setError(errorMessage)
            throw new Error(errorMessage) // Importante para propagar el error
        } finally {
            setLoading(false)
        }
    }

    return { scheduleInterview, loading, error, success }
}

export default useScheduleInterview
