import { useState, useEffect } from 'react';
import axios from '@/lib/axios';

const useEmploymentTypes = () => {
    const [employment, setEmployment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmployment = async () => {
            try {
                const response = await axios.get('/api/employment_types'); // Llama al endpoint del backend
                setEmployment(response.data);
            } catch (err) {
                console.error('Error al cargar generos:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployment();
    }, []);

    return { employment, loading, error };
};

export default useEmploymentTypes;