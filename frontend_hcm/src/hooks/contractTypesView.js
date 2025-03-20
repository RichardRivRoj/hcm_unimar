import { useState, useEffect } from 'react';
import axios from '@/lib/axios';

const useContractTypes = () => {
    const [contract, setContract] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContract = async () => {
            try {
                const response = await axios.get('/api/contract_types'); // Llama al endpoint del backend
                setContract(response.data);
            } catch (err) {
                console.error('Error al cargar tipos de contrato:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchContract();
    }, []);

    return { contract: contract || [], loading, error };
};

export default useContractTypes;