import { useState, useEffect } from 'react';
import axios from '@/lib/axios';

const useModalities = () => {
    const [modalities, setModalities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchModalities = async () => {
            try {
                const response = await axios.get('/api/modalities'); // Llama al endpoint del backend
                setModalities(response.data); // Guarda los cargos en el estado
            } catch (err) {
                console.error('Error al cargar cargos:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchModalities();
    }, []);

    return { modalities, loading, error };
};

export default useModalities;