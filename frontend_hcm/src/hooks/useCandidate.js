import { useState, useEffect } from 'react';
import axios from '@/lib/axios';

const useCandidates = (filters) => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({});

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/candidates', {
                    params: filters,
                });

                // Asegurar de que la respuesta sea exitosa
                if (response.data.success) {
                    setCandidates(response.data.data); // Accede a "data" directamente
                    setPagination({
                        currentPage: response.data.meta.current_page,
                        totalPages: response.data.meta.last_page,
                        totalItems: response.data.meta.total,
                    });
                } else {
                    throw new Error('Error en la respuesta del servidor');
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCandidates();
    }, [filters]);

    return { candidates, loading, error, pagination };
};

export default useCandidates;