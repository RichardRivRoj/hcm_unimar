// hooks/admin/useTrainingPrograms.js
import { useState, useCallback } from 'react'
import axios from '@/lib/axios'

export const useTrainingProgram = () => {
  const [state, setState] = useState({
    loading: false,
    error: null,
    validationErrors: {},
    programs: [],
    selectedProgram: null,
    filterOptions: {
      training_types: [],
      modalities: [],
      visibilities: [],
      statuses: []
    },
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0
    }
  })

  const normalizeFilters = (filters) => {
    return {
      training_types: filters.training_types || {},
      modalities: filters.modalities || {},
      visibilities: filters.visibilities || {},
      statuses: filters.statuses || {}
    }
  }

  const fetchPrograms = useCallback(async (page = 1, filters = {}) => {
    setState(prev => ({ ...prev, loading: true }))
    
    try {
      const { data } = await axios.get('/api/admin/training-programs', {
        params: {
          page,
          ...filters,
          per_page: 10 // Forzamos 10 items por página
        }
      })

      if (data.success) {
        setState(prev => ({
          ...prev,
          programs: data.programs.data,
          filterOptions: normalizeFilters(data.filters),
          pagination: {
            currentPage: data.programs.current_page,
            totalPages: data.programs.last_page,
            totalItems: data.programs.total
          },
          error: null
        }))
      }
      return data
    } catch (error) {
      const errorData = error.response?.data || {}
      setState(prev => ({
        ...prev,
        error: errorData.message || 'Error al cargar programas'
      }))
      return { success: false, ...errorData }
    } finally {
      setState(prev => ({ ...prev, loading: false }))
    }
  }, [])

    const createProgram = useCallback(async formData => {
        setState(prev => ({
            ...prev,
            loading: true,
            error: null,
            validationErrors: {},
        }))

        try {
            const response = await axios.post(
                '/api/admin/training-programs',
                formData,
            )
            return {
                success: true,
                data: response.data,
                reset: () =>
                    setState({
                        loading: false,
                        error: null,
                        data: null,
                        validationErrors: {},
                    }),
            }
        } catch (error) {
            const errorData = error.response?.data || {}
            setState(prev => ({
                ...prev,
                error: errorData.message || 'Error desconocido',
                validationErrors: errorData.errors || {},
            }))
            return { success: false, ...errorData }
        } finally {
            setState(prev => ({ ...prev, loading: false }))
        }
    }, [])

    const fetchProgram = useCallback(async (id) => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        try {
          const { data } = await axios.get(`/api/admin/training-programs/${id}`);
          
          if (data.success) {
            setState(prev => ({
              ...prev,
              selectedProgram: data.program,
              error: null
            }));
          }
          return data;
        } catch (error) {
          const errorData = error.response?.data || {};
          setState(prev => ({
            ...prev,
            error: errorData.message || 'Error al cargar el programa',
            selectedProgram: null
          }));
          return { success: false, ...errorData };
        } finally {
          setState(prev => ({ ...prev, loading: false }));
        }
      }, []);

    return {
        ...state,
        createProgram,
        fetchPrograms,
        fetchProgram,
    }
}
