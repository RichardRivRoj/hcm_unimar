import { useState, useEffect } from 'react';
import axios from '@/lib/axios'; // Asegúrate de configurar correctamente tu archivo de Axios

const useDepartments = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('/api/departments'); // Llama al endpoint del backend
                setDepartments(response.data); // Guarda los departamentos en el estado
            } catch (err) {
                console.error('Error al cargar departamentos:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDepartments();
    }, []);

    return { departments, loading, error };
};

export default useDepartments;
