import { useState, useEffect } from 'react';
import axios from '@/lib/axios';

const useStatusApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get('/api/applications'); // Llama al endpoint del backend
                setApplications(response.data);
            } catch (err) {
                console.error('Error al cargar las status:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    return { applications, loading, error };
};

export default useStatusApplications;