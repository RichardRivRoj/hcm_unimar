import { useState, useEffect } from 'react';
import axios from '@/lib/axios';

const useEmployeeFiles = (initialFilters = {}) => {
  const [data, setData] = useState({
    employees: [],
    meta: {
      total: 0,
      currentPage: 1,
      lastPage: 1,
      perPage: 10,
      filters: {
        available_departments: [],
        status_options: []
      }
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    status: '',
    sort: 'asc',
    identification: '',
    ...initialFilters
  });

  const fetchEmployees = async (page = 1) => {
    try {
      setLoading(true);
      
      const params = {
        page,
        ...filters
      };
  
      // Eliminar parámetros vacíos
      Object.keys(params).forEach(key => {
        if (params[key] === '') delete params[key];
      });
  
      const response = await axios.get('/api/admin/departments/employees', {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      setData(prev => ({
        ...prev,  // Mantener datos anteriores durante la carga
        employees: response.data.data,
        meta: {
          total: response.data.meta.total,
          currentPage: response.data.meta.current_page,
          lastPage: response.data.meta.last_page,
          perPage: response.data.meta.per_page,
          filters: {
            available_departments: 
              response.data.meta.filters?.available_departments || [],
            status_options: 
              response.data.meta.filters?.status_options || []
          }
        }
      }));
  
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar empleados');
      // Mantener datos anteriores en caso de error
      setData(prev => prev);
    } finally {
      setLoading(false);
    }
  };
  
  // Y actualiza la función goToPage:
  const goToPage = (page) => {
    if (page >= 1 && page <= data.meta.lastPage) {
      setFilters(prev => ({
        ...prev,
        page  // Agregar página a los filtros
      }));
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [filters]);

  const updateFilter = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };


  return {
    employees: data.employees,
    meta: data.meta,
    loading,
    error,
    filters,
    updateFilter,
    goToPage,
    refetch: fetchEmployees
  };
};

export default useEmployeeFiles;