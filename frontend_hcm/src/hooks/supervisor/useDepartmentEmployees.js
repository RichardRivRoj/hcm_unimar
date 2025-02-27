import { useState, useEffect } from 'react';
import axios from '@/lib/axios';

const useDepartmentEmployees = (filters = {}) => {
  const [data, setData] = useState({
    employees: [],
    department: '',
    pagination: {
      total: 0,
      currentPage: 1,
      lastPage: 1,
      perPage: 4
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEmployees = async (page = 1) => {
    try {
      setLoading(true);
      
      const params = {
        page,
        ...filters
      };

      const response = await axios.get('/api/supervisor/departments/employees', {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setData({
        employees: response.data.employees,
        department: response.data.department,
        pagination: {
          total: response.data.total_employees,
          currentPage: response.data.current_page,
          lastPage: response.data.last_page,
          perPage: response.data.per_page
        }
      });

      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar empleados');
      setData({
        employees: [],
        department: '',
        pagination: {
          total: 0,
          currentPage: 1,
          lastPage: 1,
          perPage: 4
        }
      });
    } finally {
      setLoading(false);
    }
  };

  // Carga inicial
  useEffect(() => {
    fetchEmployees();
  }, [filters.search, filters.position]);

  // Cambiar de página
  const goToPage = (page) => {
    if (page >= 1 && page <= data.pagination.lastPage) {
      fetchEmployees(page);
    }
  };

  return {
    data,
    loading,
    error,
    pagination: data.pagination,
    goToPage,
    refetch: fetchEmployees
  };
};

export default useDepartmentEmployees;