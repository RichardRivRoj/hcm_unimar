import { useState, useEffect } from 'react';
import axios from '@/lib/axios';

const useFormEvaluationDepartments = () => {
    const [data, setData] = useState([]);
    const [selectedEvaluation, setSelectedEvaluation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailLoading] = useState(false);
    const [error, setError] = useState(null);
    const [detailError, setDetailError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        perPage: 6
    });
    const [filters, setFilters] = useState({
        search: '',
        period: '',
        department: ''
    });
    const [periods, setPeriods] = useState([]);
    const [departments, setDepartments] = useState([]);

    // Método para obtener lista de evaluaciones
    const fetchEvaluationDepartments = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/admin/evaluation-forms', {
                params: {
                    page: pagination.currentPage,
                    search: filters.search,
                    period_id: filters.period,
                    department_id: filters.department,
                    per_page: pagination.perPage
                }
            });

            setData(response.data.data);
            setPagination({
                ...pagination,
                totalPages: response.data.last_page,
                totalItems: response.data.total
            });
            setPeriods(response.data.periods);
            setDepartments(response.data.departments);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al obtener evaluaciones');
        } finally {
            setLoading(false);
        }
    };

    // Método para obtener detalles de una evaluación específica
    const fetchEvaluationDepartmentsDetail = async (id) => {
        try {
            setDetailLoading(true);
            setDetailError(null);
            const response = await axios.get(`/api/admin/evaluation-forms/${id}`);
            setSelectedEvaluation(response.data.data);
        } catch (err) {
            setDetailError(err.response?.data?.message || 'Error al obtener detalle');
        } finally {
            setDetailLoading(false);
        }
    };

    useEffect(() => {
        fetchEvaluationDepartments();
    }, [pagination.currentPage, filters]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination(prev => ({ ...prev, currentPage: newPage }));
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    return {
        // Lista
        evaluationsList: data,
        loading,
        error,
        pagination,
        periods,
        departments,
        
        // Detalle
        evaluationDetail: selectedEvaluation,
        detailLoading,
        detailError,
        
        // Métodos
        handlePageChange,
        handleFilterChange,
        fetchEvaluationDepartments,
        fetchEvaluationDepartmentsDetail,
        filters
    };
};

export default useFormEvaluationDepartments;