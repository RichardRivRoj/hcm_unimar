'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';

const JobDetails = ({ params }) => {
    const router = useRouter();
    const { id } = params; // ID de la oferta laboral desde la URL
    const [job, setJob] = useState(null);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        cv_path: null, // Archivo del CV
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Cargar los detalles del trabajo
        const fetchJob = async () => {
            try {
                const response = await axios.get(`/api/job-positions/${id}`);
                setJob(response.data);
            } catch (err) {
                console.error('Error al cargar la vacante:', err);
            }
        };

        fetchJob();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, cv_path: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formDataToSend = new FormData();
        formDataToSend.append('first_name', formData.first_name);
        formDataToSend.append('last_name', formData.last_name);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('phone', formData.phone);
        formDataToSend.append('cv_path', formData.cv_path); // Archivo del CV
        formDataToSend.append('job_position_id', id); // ID de la vacante

        try {
            const response = await axios.post('/api/public/candidates', formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            alert('Postulación realizada con éxito');
            router.push('/'); // Redirige tras la postulación
        } catch (err) {
            setError(err.response?.data?.message || 'Error al enviar la postulación');
        } finally {
            setLoading(false);
        }
    };

    if (!job) return <div>Cargando vacante...</div>;

    return (
        <div className="container p-8 mx-auto">
            <h1 className="mb-4 text-3xl font-bold">{job.title}</h1>
            <p className="mb-2 text-gray-700">{job.description}</p>
            <p className="text-gray-500">Ubicación: {job.location}</p>
            <p className="mb-6 text-gray-500">Modalidad: {job.isRemote ? 'Remoto' : 'Presencial'}</p>

            <h2 className="mb-4 text-2xl font-bold">Formulario de Postulación</h2>
            <form onSubmit={handleSubmit} className="p-4 space-y-4 rounded shadow bg-gray-50">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Apellido</label>
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Adjuntar Currículum</label>
                    <input
                        type="file"
                        name="cv_path"
                        onChange={handleFileChange}
                        required
                        accept=".pdf,.jpg,.png"
                        className="block w-full mt-1 text-gray-600"
                    />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 text-white bg-blue-600 rounded shadow hover:bg-blue-700 ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {loading ? 'Enviando...' : 'Enviar Postulación'}
                </button>
            </form>
        </div>
    );
};

export default JobDetails;


