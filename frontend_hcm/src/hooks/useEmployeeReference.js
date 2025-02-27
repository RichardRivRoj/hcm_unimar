import { useState, useCallback } from 'react';
import axios from '@/lib/axios';

const useEmployeeReferences = () => {
  const [references, setReferences] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // GET: Obtener referencias personales paginadas
  const getReferences = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/documents/references', {
        params: { page } // Eliminar el page del template string
      });
      
      setReferences(response.data.data);
      setPagination({
        currentPage: response.data.meta.current_page,
        totalPages: response.data.meta.total_pages,
        totalItems: response.data.meta.total_items
      });
      
    } catch (err) {
      setError(err.response?.data?.error || 'Error al obtener referencias');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // POST: Crear nueva referencia personal
  const createReference = useCallback(async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/documents/references', {
        document_name: formData.document_name,
        referrer_name: formData.referrer_name,
        referrer_identification: formData.referrer_identification,
        issue_date: formData.issue_date, // Formato: YYYY-MM-DD
        expiration_date: formData.expiration_date || null,
        file_path: formData.file_path || null
      });

      // Actualizar lista de referencias
      setReferences(prev => [response.data.data, ...prev]);
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear referencia');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    getReferences,
    createReference,
    references,
    pagination,
    isLoading,
    error
  };
};

export default useEmployeeReferences;