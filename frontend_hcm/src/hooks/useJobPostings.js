import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { useAuth } from './auth';

const useFetchJobPostings = () => {
    const [jobPostings, setJobPostings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { logout } = useAuth(); // Para manejar errores de autenticación

    useEffect(() => {
        const fetchJobPostings = async () => {
            try {
                const response = await axios.get('/api/job-positions'); // Petición al backend
                setJobPostings(response.data);
            } catch (err) {
                if (err.response?.status === 401) {
                    logout(); // Redirigir al login si no está autenticado
                } else {
                    setError(err.response?.data?.message || 'Error al obtener las vacantes');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchJobPostings();
    }, [logout]);

    return { jobPostings, loading, error };
};

export default useFetchJobPostings;


