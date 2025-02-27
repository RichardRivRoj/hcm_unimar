import { useState, useEffect } from 'react';
import axios from '@/lib/axios';

const useListCurrencies = () => {
    const [currencies, setCurrencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchListCurrencies = async () => {
            try {
                const response = await axios.get('/api/list-currencies'); // Llama al endpoint del backend
                setCurrencies(response.data); // Guarda los cargos en el estado
            } catch (err) {
                console.error('Error al cargar cargos:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchListCurrencies();
    }, []);

    return { currencies, loading, error };
};

export default useListCurrencies;