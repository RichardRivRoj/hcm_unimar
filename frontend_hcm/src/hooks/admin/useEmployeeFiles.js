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

  // Estados para el detalle del empleado
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
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

  // Función para obtener detalles del empleado con paginación
  const fetchEmployeeDetails = async (id, category = 'Contratos', page = 1) => {
    try {
      setDetailLoading(true);
      setDetailError(null);
      
      const response = await axios.get(
        `/api/admin/departments/employees/${id}?category=${encodeURIComponent(category)}&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setSelectedEmployee({
        employee: response.data.employee,
        documents: {
          data: response.data.documents,
          meta: response.data.meta
        }
      });
      setPagination(
        response.data.meta
      );
      
    } catch (err) {
      setDetailError(err.response?.data?.message || 'Error al cargar detalles del empleado');
      setSelectedEmployee(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const fetchEmployees = async (page = 1) => {
    try {
      setLoading(true);
      
      const params = {
        page,
        ...filters
      };
  
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
        ...prev,
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
      setData(prev => prev);
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambio de página para documentos
  const handlePageChange = (newPage, category) => {
    if (selectedEmployee) {
      fetchEmployeeDetails(
        selectedEmployee.employee.id, 
        category || 'Contratos', 
        newPage
      );
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= data.meta.lastPage) {
      setFilters(prev => ({
        ...prev,
        page
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

  useEffect(() => {
    fetchEmployees();
  }, [filters]);

  return {
    employees: data.employees,
    meta: data.meta,
    loading,
    error,
    filters,
    updateFilter,
    goToPage,
    refetch: fetchEmployees,
    
    selectedEmployee,
    detailLoading,
    detailError,
    fetchEmployeeDetails,
    clearSelectedEmployee: () => setSelectedEmployee(null),

    pagination,
    handlePageChange
  };
};

export default useEmployeeFiles;