// hooks/useAgendas.js
import { useState, useEffect } from 'react';
import axios from '@/lib/axios';

const useAgendas = (filters = {}) => {
    const [agendas, setAgendas] = useState([]); // Estado para almacenar las agendas
    const [loading, setLoading] = useState(true); // Estado para manejar el loading
    const [meta, setMeta] = useState({}); // Estado para almacenar la metadata de paginación
    const [error, setError] = useState(null); // Estado para manejar errores

    useEffect(() => {
        const fetchAgendas = async () => {
            try {
                setLoading(true);
                // Parámetros de la URL con los filtros
                // Hacer la petición a la API
                const response = await axios.get(`/api/agendas?${new URLSearchParams(filters).toString()}`);
                // Actualizar el estado con los datos recibidos
                setAgendas(response.data.data);
                setMeta(response.data.meta);
                setError(null);
            } catch (err) {
                setError(err.message || 'Error al obtener las agendas');
            } finally {
                setLoading(false);
            }
        };

        fetchAgendas();
    }, [filters]); // Ejecutar el efecto cuando los filtros cambien

    return { agendas, loading, meta, error };
};

export default useAgendas;