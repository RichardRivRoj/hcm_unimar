import { useState, useEffect } from 'react';
import axios from '@/lib/axios';

const useCandidate = (id) => {
    const [candidate, setCandidate] = useState(null); // Datos del candidato
    const [loading, setLoading] = useState(true); // Estado de carga
    const [error, setError] = useState(null); // Manejo de errores

    useEffect(() => {
        const fetchCandidate = async () => {
            try {
                // Hacer la solicitud GET a la API
                const response = await axios.get(`/api/candidates/${id}`);
                setCandidate(response.data); // Guardar los datos del candidato
                setLoading(false); // Finalizar la carga
            } catch (err) {
                setError(err); // Guardar el error
                setLoading(false); // Finalizar la carga
            }
        };

        fetchCandidate(); // Llamar a la función
    }, [id]); // Dependencia: si el ID cambia, se vuelve a ejecutar

    return { candidate, loading, error }; // Retornar los datos, estado de carga y error
};

export default useCandidate;