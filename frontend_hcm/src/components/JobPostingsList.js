'use client';

import useFetchJobPostings from '@/hooks/useJobPostings';

const JobPostingsList = () => {
    const { jobPostings, loading, error } = useFetchJobPostings();

    if (loading) return <p>Cargando vacantes...</p>;
    if (error) return <p>Error al cargar las vacantes: {error}</p>;

    return (
        <div className="container p-8 mx-auto">
            <h1 className="mb-6 text-2xl font-bold">Listado de Vacantes</h1>

            {/* Tabla de Vacantes */}
            <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                Título
                            </th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                Descripción
                            </th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                Ubicación
                            </th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                Vacantes
                            </th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                Remoto
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {jobPostings.map((job) => (
                            <tr key={job.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{job.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{job.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{job.location || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{job.vacancies}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {job.remote ? 'Sí' : 'No'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default JobPostingsList;
