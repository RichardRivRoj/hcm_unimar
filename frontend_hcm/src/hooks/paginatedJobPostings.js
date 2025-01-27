import { useState, useEffect } from 'react';
import axios from '@/lib/axios';

const usePaginatedJobPostings = (initialPage = 1, perPage = 3) => {
    const [jobPostings, setJobPostings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(1);

    const fetchJobPostings = async (page) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/public/job-positions', {
                params: { page, per_page: perPage },
            });
            setJobPostings(response.data.data); // Datos de la página actual
            setTotalPages(response.data.last_page); // Total de páginas
        } catch (err) {
            setError(err.response?.data?.message || 'Error al obtener las vacantes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobPostings(currentPage);
    }, [currentPage]);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return {
        jobPostings,
        loading,
        error,
        currentPage,
        totalPages,
        goToPage,
    };
};

export default usePaginatedJobPostings;
