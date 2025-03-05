import { useState, useEffect } from 'react';
import axios from '@/lib/axios';

export const useEmployeeRequests = (initialPage = 1) => {
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(initialPage);

    const fetchRequests = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await axios.get('/api/employee/requests', {
                params: { page },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            setData(response.data.data);
            setMeta(response.data.meta);
            setCurrentPage(page);
        } catch (err) {
            setError(err.response?.data || {
                error: 'Error de conexión',
                message: 'No se pudo obtener las solicitudes'
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= meta.last_page) {
            fetchRequests(newPage);
        }
    };

    useEffect(() => {
        fetchRequests(currentPage);
    }, []);

    return {
        requests: data,
        pagination: meta,
        loading,
        error,
        currentPage,
        handlePageChange,
        refetch: fetchRequests
    };
};

export const useCreateEmployeeRequest = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const createRequest = async (requestData) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            const response = await axios.post(
                '/api/employee/requests',
                requestData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setSuccess(true);
            return response.data;
        } catch (err) {
            const errorData = err.response?.data || {
                error: 'Error de conexión',
                message: 'No se pudo crear la solicitud'
            };
            setError(errorData);
            throw errorData;
        } finally {
            setLoading(false);
        }
    };

    return { createRequest, loading, error, success };
};

export const useUpdateEmployeeRequest = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const updateRequest = async (id, description) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            const response = await axios.put(
                `/api/employee/requests/${id}`,
                { description },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setSuccess(true);
            return response.data;
            
        } catch (err) {
            const errorData = err.response?.data || {
                error: 'Error de conexión',
                message: 'No se pudo actualizar la solicitud'
            };
            setError(errorData);
            throw errorData;
        } finally {
            setLoading(false);
        }
    };

    return { updateRequest, loading, error, success };
};

export const useDeleteEmployeeRequest = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const deleteRequest = async (id) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            await axios.delete(`/api/employee/requests/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            setSuccess(true);
            return true;
            
        } catch (err) {
            const errorData = err.response?.data || {
                error: 'Error de conexión',
                message: 'No se pudo cancelar la solicitud'
            };
            setError(errorData);
            throw errorData;
        } finally {
            setLoading(false);
        }
    };

    return { deleteRequest, loading, error, success };
};

export const useEmployeeRequestDetails = (id) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRequestDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await axios.get(`/api/employee/requests/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                setData(response.data.data);
            } catch (err) {
                setError(err.response?.data || {
                    error: 'Error de conexión',
                    message: 'No se pudo obtener los detalles de la solicitud'
                });
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchRequestDetails();

    }, [id]);

    return { data, loading, error };
};