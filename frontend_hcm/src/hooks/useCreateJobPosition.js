import { useState } from 'react';
import axios from '@/lib/axios'; // Asegúrate de configurar correctamente tu archivo de Axios

const useCreateJobPosition = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const createJobPosition = async (formData) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await axios.post('/api/job-positions', formData); // Llama al endpoint del backend
            setSuccess(true); // Marca como exitoso
            return response.data; // Devuelve los datos creados si es necesario
        } catch (err) {
            console.error('Error al crear la vacante:', err);
            setError(err.response?.data || err.message); // Guarda el error
        } finally {
            setLoading(false);
        }
    };

    return { createJobPosition, loading, error, success };
};

export default useCreateJobPosition;
