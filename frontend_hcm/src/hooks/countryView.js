import { useState, useEffect } from 'react';
import axios from '@/lib/axios';

const useCountries = () => {
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axios.get('/api/public/countries'); // Llama al endpoint del backend
                setCountries(response.data);
            } catch (err) {
                console.error('Error al cargar las etnias:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCountries();
    }, []);

    return { countries, loading, error };
};

export default useCountries;