import { useState } from 'react';
import axios from '@/lib/axios';

const useCandidateValidation = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const checkCandidate = async (validationData, vacancyId) => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await axios.post(
                `/api/public/candidates/check/${vacancyId}`,
                validationData
            );

            setResult(response.data);
            return response.data;
        } catch (err) {
            const errorData = err.response?.data || { 
                message: 'Error de validación con el servidor' 
            };
            setError(errorData);
            throw errorData;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        result,
        checkCandidate,
    };
};

export default useCandidateValidation;