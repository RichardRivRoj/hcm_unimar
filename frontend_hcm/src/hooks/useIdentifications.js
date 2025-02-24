import { useState, useEffect } from 'react';
import axios from '@/lib/axios';

const useIdentifications = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchIdentifications = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/documents/identifications?page=${page}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                withCredentials: true
            });

            setDocuments(response.data.data);
            setCurrentPage(response.data.meta.current_page);
            setTotalPages(response.data.meta.total_pages);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al cargar empleos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIdentifications();
    }, []);

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            fetchIdentifications(currentPage + 1);
        }
    };

    const goToPrevPage = () => {
        if (currentPage > 1) {
            fetchIdentifications(currentPage - 1);
        }
    };

    return {
        documents,
        loading,
        error,
        currentPage,
        totalPages,
        refresh: fetchIdentifications,
        goToNextPage,
        goToPrevPage
    };
};

export default useIdentifications;