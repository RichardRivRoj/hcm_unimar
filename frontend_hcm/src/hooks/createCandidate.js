import { useState } from 'react'
import axios from '@/lib/axios'

const useCandidateForm = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [response, setResponse] = useState(null)

    const submitForm = async (formData, vacancyId) => {
        setLoading(true)
        setError(null)
        setResponse(null)

        try {
            // Crear un FormData para enviar archivos (foto)
            const data = new FormData()

            // Convertir el objeto documents en un array
            const documentsArray = [
                ...formData.documents.jobs.map(job => ({
                    ...job,
                    type: 'jobs',
                })),
                ...formData.documents.studies.map(study => ({
                    ...study,
                    type: 'studies',
                })),
                ...formData.documents.courses.map(course => ({
                    ...course,
                    type: 'courses',
                })),
            ]
            Object.keys(formData).forEach(key => {
                if (key === 'documents') {
                    // Convertir documentos a JSON
                    data.append(key, JSON.stringify(formData[key]))
                } else if (key === 'photo') {
                    // Agregar la foto como archivo
                    data.append(key, formData[key])
                } else {
                    // Agregar otros campos
                    data.append(key, formData[key])
                }
            })

            // Enviar la solicitud al backend
            const response = await axios.post(
                `/api/public/candidates/${vacancyId}`,
                data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            )

            setResponse(response.data)
        } catch (err) {
            setError(err.response?.data || { message: 'Error desconocido' })
        } finally {
            setLoading(false)
        }
    }

    return {
        loading,
        error,
        response,
        submitForm,
    }
}

export default useCandidateForm
