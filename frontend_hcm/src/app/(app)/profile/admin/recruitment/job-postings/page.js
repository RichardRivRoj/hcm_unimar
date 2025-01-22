'use client';

import { useState } from 'react';
import useDepartments from '@/hooks/useDepartments'; // Importa el hook para listar departamentos
import useCreateJobPosition from '@/hooks/useCreateJobPosition'; // Importa el hook para crear vacantes

const JobListPage = () => {
    const { departments, loading: loadingDepartments, error: errorDepartments } = useDepartments();
    const { createJobPosition, loading: creatingJob, error: errorCreate, success } = useCreateJobPosition();

    const [formState, setFormState] = useState({
        title: '',
        description: '',
        vacancies: 1,
        department_id: '',
        location: '',
        requirements: '',
        remote: false,
    });

    const [isCreating, setIsCreating] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormState((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createJobPosition(formState);
        if (success) {
            alert('Vacante creada exitosamente');
            setFormState({
                title: '',
                description: '',
                vacancies: 1,
                department_id: '',
                location: '',
                requirements: '',
                remote: false,
            });
            setIsCreating(false); // Cierra el formulario después de crear la vacante
        }
    };

    return (
        <div className="relative min-h-screen bg-gray-50">
            {/* Tabla de vacantes */}
            <div className="max-w-6xl p-6 mx-auto mt-6 overflow-hidden bg-white rounded-lg shadow-lg">
                <h2 className="mb-4 text-2xl font-semibold text-gray-700">Resumen de Vacantes</h2>
                <table className="min-w-full border-separate table-auto border-spacing-2">
                    <thead>
                        <tr className="text-left bg-gray-100">
                            <th className="px-6 py-3 text-sm font-medium text-gray-600">Título</th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-600">Departamento</th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-600">Ubicación</th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-600">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Aquí puedes mapear los datos de las vacantes */}
                        <tr className="border-b hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm">Desarrollador Frontend</td>
                            <td className="px-6 py-4 text-sm">Tecnología</td>
                            <td className="px-6 py-4 text-sm">Remoto</td>
                            <td className="px-6 py-4 text-sm">
                                <button className="px-4 py-2 text-sm text-blue-600 rounded hover:bg-blue-100">
                                    Ver Detalles
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div className="flex justify-end mt-6">
                    <button
                        onClick={() => setIsCreating(true)}
                        className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none"
                    >
                        Crear Nueva Vacante
                    </button>
                </div>
            </div>

            {/* Formulario para crear vacante */}
            {isCreating && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-3/6 p-8 overflow-y-auto bg-white rounded-lg shadow-lg h-3/4 sm:w-3/6">
                        <h1 className="mb-6 text-2xl font-semibold text-gray-700">Crear Vacante</h1>

                        {loadingDepartments && <p className="text-sm text-gray-500">Cargando departamentos...</p>}
                        {errorDepartments && <p className="text-sm text-red-500">Error al cargar departamentos: {errorDepartments.message}</p>}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex flex-col">
                                <label htmlFor="title" className="text-sm font-medium text-gray-600">Título</label>
                                <input
                                    id="title"
                                    type="text"
                                    name="title"
                                    value={formState.title}
                                    onChange={handleChange}
                                    required
                                    className="p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="description" className="text-sm font-medium text-gray-600">Descripción</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formState.description}
                                    onChange={handleChange}
                                    className="p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="vacancies" className="text-sm font-medium text-gray-600">Vacantes</label>
                                <input
                                    id="vacancies"
                                    type="number"
                                    name="vacancies"
                                    value={formState.vacancies}
                                    onChange={handleChange}
                                    min="1"
                                    required
                                    className="p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="department_id" className="text-sm font-medium text-gray-600">Departamento</label>
                                <select
                                    id="department_id"
                                    name="department_id"
                                    value={formState.department_id}
                                    onChange={handleChange}
                                    required
                                    className="p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    <option value="" disabled>Selecciona un departamento</option>
                                    {departments.map((dept) => (
                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="location" className="text-sm font-medium text-gray-600">Ubicación</label>
                                <input
                                    id="location"
                                    type="text"
                                    name="location"
                                    value={formState.location}
                                    onChange={handleChange}
                                    className="p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="requirements" className="text-sm font-medium text-gray-600">Requisitos</label>
                                <input
                                    id="requirements"
                                    type="text"
                                    name="requirements"
                                    value={formState.requirements}
                                    onChange={handleChange}
                                    className="p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="remote"
                                    type="checkbox"
                                    name="remote"
                                    checked={formState.remote}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                <label htmlFor="remote" className="text-sm text-gray-600">Trabajo Remoto</label>
                            </div>

                            <button
                                type="submit"
                                disabled={creatingJob}
                                className="w-full px-4 py-3 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                {creatingJob ? 'Creando...' : 'Crear Vacante'}
                            </button>
                        </form>

                        {errorCreate && <p className="mt-4 text-sm text-red-500">Error al crear la vacante: {errorCreate}</p>}

                        <button
                            onClick={() => setIsCreating(false)}
                            className="absolute p-2 text-white bg-red-600 rounded-full top-4 right-4 hover:bg-red-700"
                        >
                            X
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobListPage;


