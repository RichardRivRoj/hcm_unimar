import { useState, useEffect } from 'react';
import axios from '@/lib/axios';

const useContractForm = () => {
    const [paymentTerms, setPaymentTerms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPaymentTerms = async () => {
            try {
                const response = await axios.get('/api/payment-terms');
                // El backend devuelve un array directo, no hay propiedad payment_terms
                setPaymentTerms(response.data); 
            } catch (error) {
                setError('Error al cargar las opciones de pago');
                console.error('Error fetching payment terms:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchPaymentTerms();
    }, []);

    return { paymentTerms, loading, error };
};

export default useContractForm;