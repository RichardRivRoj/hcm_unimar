import { useState, useEffect } from 'react';
import axios from '@/lib/axios';

const useMaritalStatuses = () => {
    const [marital, setMarital] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMarital = async () => {
            try {
                const response = await axios.get('/api/public/maritalstatuses'); // Llama al endpoint del backend
                setMarital(response.data);
            } catch (err) {
                console.error('Error al cargar las etnias:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMarital();
    }, []);

    return { marital, loading, error };
};

export default useMaritalStatuses;