import { useState } from 'react';
import axios from '@/lib/axios';

const useCandidateForm = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

    const sanitizeDocuments = (documents) => {
        return {
            jobs: documents.jobs.map(job => ({
                ...job,
                issue_date: job.issue_date || null,
                expiration_date: job.expiration_date || null
            })),
            studies: documents.studies.map(study => ({
                ...study,
                issue_date: study.issue_date || null,
                expiration_date: study.expiration_date || null
            })),
            courses: documents.courses.map(course => ({
                ...course,
                issue_date: course.issue_date || null,
                expiration_date: course.expiration_date || null
            })),
            competencies: documents.competencies.map(c => ({
                name: c.name,
                detail: c.detail.filter(item => item.trim())
            })),
            languages: documents.languages.map(l => ({
                name: l.name,
                detail: { 
                    level: l.detail?.level?.trim() || '' 
                }
            }))
        };
    };

    const submitForm = async (formData, vacancyId) => {
        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const data = new FormData();
            const sanitizedDocs = sanitizeDocuments(formData.documents);

            // Agregar campos principales
            Object.keys(formData).forEach(key => {
                if (key === 'documents') {
                    data.append(key, JSON.stringify(sanitizedDocs));
                } else if (key === 'photo') {
                    formData[key] && data.append(key, formData[key]);
                } else {
                    data.append(key, formData[key]);
                }
            });

            const response = await axios.post(
                `/api/public/candidates/${vacancyId}`,
                data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            setResponse(response.data);
            return response.data;
        } catch (err) {
            const errorData = err.response?.data || { 
                message: 'Error de conexión con el servidor' 
            };
            setError({
                ...errorData,
                status: err.response?.status || 500
            });
            throw errorData;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        response,
        submitForm,
    };
};

export default useCandidateForm;