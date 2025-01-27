'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import Button from '@/components/Button';

const InspectApplication = ({ params }) => {
    const router = useRouter();
    const { id } = params;

    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Cargar detalles del candidato
        const fetchApplication = async () => {
            try {
                const response = await axios.get(`/api/candidates/${id}`);
                setApplication(response.data);
            } catch (err) {
                setError('Error al cargar la información del candidato.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchApplication();
    }, [id]);

    const handleStatusChange = async (status) => {
        try {
            // Cambiar el estado del candidato
            await axios.put(`/api/candidates/${id}/status`, { status });
            if (status === 'interview') {
                router.push(`/schedule-interview/${id}`);
            } else {
                router.refresh();
            }
        } catch (err) {
            console.error('Error al cambiar el estado del candidato:', err);
        }
    };

    if (loading) return <p>Cargando información...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container p-8 mx-auto">
            {application ? (
                <div className="shadow-lg">
                    <div>
                        <h2 className="text-3xl font-bold">
                            {application.candidate.first_name} {application.candidate.last_name}
                        </h2>
                    </div>
                    <div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-sm text-gray-500">Correo:</p>
                                <p className="font-medium">{application.candidate.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Teléfono:</p>
                                <p className="font-medium">{application.candidate.phone}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Estado:</p>
                                <p className="font-medium capitalize">{application.status}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Puesto:</p>
                                <p className="font-medium">{application.jobPosition.title}</p>
                            </div>
                        </div>
                        <div className="mt-6">
                            <p className="text-sm text-gray-500">Currículum:</p>
                            {application.candidate.cv_path ? (
                                <img
                                    src={`/protected-files/${application.candidate.cv_path.split('/').pop()}`}
                                    alt="Currículum del candidato"
                                    className="w-full max-w-md mt-2 rounded-lg shadow-sm"
                                />
                            ) : (
                                <p className="text-gray-400">No hay currículum disponible.</p>
                            )}
                        </div>
                        <div className="flex mt-8 space-x-4">
                            <Button
                                onClick={() => handleStatusChange('interview')}
                                className="bg-blue-500 hover:bg-blue-600"
                            >
                                Aceptar y Programar Entrevista
                            </Button>
                            <Button
                                onClick={() => handleStatusChange('rejected')}
                                className="bg-red-500 hover:bg-red-600"
                            >
                                Rechazar
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <p>No se encontraron datos para esta postulación.</p>
            )}
        </div>
    );
};

export default InspectApplication;

