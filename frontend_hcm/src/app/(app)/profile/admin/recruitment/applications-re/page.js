'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import Link from 'next/link';
import { Eye } from 'lucide-react';

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Obtener las postulaciones desde el backend
        const fetchApplications = async () => {
            try {
                const response = await axios.get('/api/candidates'); // Ruta del backend
                const data = response.data.data; // Aquí accedemos a la propiedad 'data'

                // Verificar que data es un array
                if (Array.isArray(data)) {
                    setApplications(data);
                } else {
                    setError('Los datos recibidos no son un array');
                }
            } catch (err) {
                setError('Error al cargar las postulaciones');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    if (loading) return <p>Cargando postulaciones...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container p-8 mx-auto">
            <h1 className="mb-6 text-3xl font-bold">Postulaciones</h1>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                            Nombre
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                            Apellido
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                            Correo
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                            Teléfono
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                            Estado
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                            Puesto
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody className="text-xs bg-white divide-y divide-gray-200">
                    {applications.length > 0 ? (
                        applications.map((app) => (
                            <tr key={app.id}>
                                <td className="px-6 py-4">{app.candidate.first_name}</td>
                                <td className="px-6 py-4">{app.candidate.last_name}</td>
                                <td className="px-6 py-4">{app.candidate.email}</td>
                                <td className="px-6 py-4">{app.candidate.phone}</td>
                                <td className="px-6 py-4">{app.status}</td>
                                <td className="px-6 py-4">{app.jobposition.title}</td>
                                <td className="px-6 py-4 space-x-2">
                                    {/* Botón para inspeccionar */}
                                    <Link href={`/profile/admin/recruitment/applications-re/inspect/${app.id}`}>
                                        <button className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600">
                                            <Eye />
                                        </button>
                                    </Link>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="px-6 py-4 text-center">No hay postulaciones disponibles.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Applications;

