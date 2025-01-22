// app/job/[id]/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const JobDetails = ({ params }) => {
    const router = useRouter();
    const { id } = params; // ID de la oferta laboral desde la URL
    const [job, setJob] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        resume: '',
    });

    useEffect(() => {
        // Simulación de obtener datos de la oferta laboral según el ID
        const storedJobs = JSON.parse(localStorage.getItem('jobPostings') || '[]');
        const selectedJob = storedJobs.find((job) => job.id === parseInt(id));
        setJob(selectedJob);
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Guardar los datos de la postulación en localStorage (simulación)
        const applications = JSON.parse(localStorage.getItem('applications') || '[]');
        const newApplication = { ...formData, jobId: id, status: 'pending' }; // Estado inicial: pendiente
        localStorage.setItem('applications', JSON.stringify([...applications, newApplication]));

        // Redirigir al usuario a una página de confirmación o inicio
        router.push('/');
    };

    if (!job) return <div>Cargando...</div>;

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
                        name="name"
                        value={formData.name}
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
                        name="resume"
                        onChange={(e) => setFormData({ ...formData, resume: e.target.files[0]?.name })}
                        required
                        className="block w-full mt-1 text-gray-600"
                    />
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-600 rounded shadow hover:bg-blue-700"
                >
                    Enviar Postulación
                </button>
            </form>
        </div>
    );
};

export default JobDetails;
