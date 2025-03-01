'use client'

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
  const [employee, setEmployee] = useState(null); // Nuevo estado para empleado individual
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorEmployee, setErrorEmployee] = useState(null); // Error específico para empleado

  // Función existente para listar empleados
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
      setData(prev => ({
        ...prev,
        employees: [],
        department: '',
      }));
    } finally {
      setLoading(false);
    }
  };

  // Nueva función para obtener un empleado específico
  const fetchEmployee = async (id) => {
    try {
      setLoading(true);
      setErrorEmployee(null);
      
      const response = await axios.get(`/api/supervisor/departments/employees/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setEmployee(response.data);
    } catch (err) {
      setErrorEmployee(err.response?.data?.message || 'Error al cargar empleado');
      setEmployee(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [filters.search, filters.position]);

  const goToPage = (page) => {
    if (page >= 1 && page <= data.pagination.lastPage) {
      fetchEmployees(page);
    }
  };

  return {
    // Datos existentes
    data,
    loading,
    error,
    pagination: data.pagination,
    goToPage,
    refetch: fetchEmployees,
    
    // Nuevas propiedades para el método show
    employee,
    fetchEmployee,
    errorEmployee
  };
};

export default useDepartmentEmployees;