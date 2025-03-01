import { useState } from 'react';
import axios from '@/lib/axios';

const useProfilePhoto = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const updatePhoto = async (formData, personId) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await axios.post(
                `/api/employees/profile/photo/${personId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            setSuccess(true);
            return response.data.photo_url;
        } catch (err) {
            setError(err.response?.data?.message || 'Error al actualizar la foto');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deletePhoto = async (personId) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await axios.delete(
                `/api/employees/profile/photo/${personId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            setSuccess(true);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Error al eliminar la foto');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { updatePhoto, deletePhoto, loading, error, success };
};

export default useProfilePhoto;