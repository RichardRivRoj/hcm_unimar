import { useState, useEffect } from 'react';
import axios from '@/lib/axios';

const useListAccountTypes = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchListAccountTypes = async () => {
            try {
                const response = await axios.get('/api/list-accounts'); // Llama al endpoint del backend
                setAccounts(response.data); // Guarda los cargos en el estado
            } catch (err) {
                console.error('Error al cargar cargos:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchListAccountTypes();
    }, []);

    return { accounts, loading, error };
};

export default useListAccountTypes;