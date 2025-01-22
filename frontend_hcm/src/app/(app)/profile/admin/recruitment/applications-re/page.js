// app/profile/admin/recruitment/applications/page.jsx
'use client';

import { useState, useEffect } from 'react';

const Applications = () => {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        // Obtener las postulaciones desde localStorage
        const storedApplications = JSON.parse(localStorage.getItem('applications') || '[]');
        setApplications(storedApplications);
    }, []);

    const handleStatusChange = (index, status) => {
        const updatedApplications = [...applications];
        updatedApplications[index].status = status;
        setApplications(updatedApplications);
        localStorage.setItem('applications', JSON.stringify(updatedApplications));
    };

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
                            Correo
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                            Teléfono
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                            Estado
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {applications.map((app, index) => (
                        <tr key={index}>
                            <td className="px-6 py-4">{app.name}</td>
                            <td className="px-6 py-4">{app.email}</td>
                            <td className="px-6 py-4">{app.phone}</td>
                            <td className="px-6 py-4">{app.status}</td>
                            <td className="px-6 py-4 space-x-2">
                                <button
                                    onClick={() => handleStatusChange(index, 'accepted')}
                                    className="px-3 py-1 text-white bg-green-500 rounded hover:bg-green-600"
                                >
                                    Aceptar
                                </button>
                                <button
                                    onClick={() => handleStatusChange(index, 'rejected')}
                                    className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                                >
                                    Rechazar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Applications;
