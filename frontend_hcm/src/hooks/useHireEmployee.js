import { useState } from 'react';
import axios from '@/lib/axios'; // Asegúrate de que axios esté configurado correctamente

const useHireEmployee = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({}); // Estado para errores de validación
    const [success, setSuccess] = useState(false);

    const hireEmployee = async (candidateId, formData) => {
        setLoading(true);
        setError(null);
        setValidationErrors({}); // Limpiar errores de validación anteriores
        setSuccess(false);

        try {
            const response = await axios.post(`/api/employees/${candidateId}`, formData);
            setSuccess(true);
            return response.data; // Devuelve la respuesta del servidor
        } catch (err) {
            if (err.response?.status === 422) {
                // Si es un error de validación, guardar los errores
                setValidationErrors(err.response.data.errors || {});
            } else {
                // Otros errores
                setError(err.response?.data?.message || 'Error al contratar al empleado');
            }
            throw err; // Lanza el error para manejarlo en el componente
        } finally {
            setLoading(false);
        }
    };

    return { hireEmployee, loading, error, validationErrors, success };
};

export default useHireEmployee;