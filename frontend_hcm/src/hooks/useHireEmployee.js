import { useState } from 'react';
import axios from '@/lib/axios'; // Asegúrate de que axios esté configurado correctamente

const useHireEmployee = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const hireEmployee = async (candidateId, formData) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await axios.post(`/api/employees/${candidateId}`, formData);
            setSuccess(true);
            return response.data; // Devuelve la respuesta del servidor
        } catch (err) {
            setError(err.response?.data?.message || 'Error al contratar al candidato');
            throw err; // Lanza el error para manejarlo en el componente
        } finally {
            setLoading(false);
        }
    };

    return { hireEmployee, loading, error, success };
};

export default useHireEmployee;