'use client';

import { useState } from 'react';
import useAgendas from '@/hooks/useAgendas';
import useStatuses from '@/hooks/useStatuses';
import useTypeAgendas from '@/hooks/typeAgendasView';
import { Eye } from 'lucide-react';


const AgendarEntrevista = () => {
    
    const [filters, setFilters] = useState({
        status: '', // Filtro por estatus
        type_agenda: '', // Filtro por tipo de agenda
        page: 1,
    });

    const { agendas, loading, meta, error } = useAgendas(filters);
    const {statuses, loading: loadingStatus, error: errorStatus } = useStatuses();
    const {typeAgendas, loading: loadingAgendas, error: errorAgendas } = useTypeAgendas();

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
            page: 1,
        })); // Resetear a la primera página al cambiar filtros
    };

    if (loading)
        return (
            <div className="p-6 space-y-4">
                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
        )
    if (error) return <div className="p-6 text-red-600">Error: {error}</div>

    return (
        <>
        <div className="max-w-full p-6 mx-auto mt-6 ml-6 overflow-hidden bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-2xl font-semibold text-gray-700">
                Eventos Agendados
            </h2>

            {/* Filtros */}
            <div className="flex flex-row justify-end gap-6 mb-8">
                <select
                    name="type_agenda_id"
                    value={filters.type_agenda}
                    onChange={handleFilterChange}
                    className="w-1/4 p-3 text-sm text-gray-700 transition duration-200 ease-in-out bg-transparent border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-0">
                    <option value="" className="text-gray-600">
                        Seleccione Tipo de Evento
                    </option>
                    {(typeAgendas || []).map(type => (
                        <option
                            key={type.id}
                            value={type.id}
                            className="text-gray-600">
                            {type.name}
                        </option>
                    ))}
                </select>

                <select
                    name="status_id"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="w-1/4 p-3 text-sm text-gray-700 transition duration-200 ease-in-out bg-transparent border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-0">
                    <option value="" className="text-gray-500">
                        Seleccione estatus
                    </option>
                    {(statuses || []).map(status => (
                        <option
                            key={status.id}
                            value={status.id}
                            className="text-gray-600">
                            {status.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Tabla de candidatos */}
            <table className="min-w-full border-separate table-auto border-spacing-2">
                <thead>
                    <tr className="text-left bg-blue-200">
                        <th className="px-6 py-3 text-sm font-medium text-gray-800">
                            Nombre y Apellido
                        </th>
                        <th className="px-6 py-3 text-sm font-medium text-gray-800">
                            Identificación
                        </th>
                        <th className="px-6 py-3 text-sm font-medium text-gray-800">
                            Vacante
                        </th>
                        <th className="px-6 py-3 text-sm font-medium text-gray-800">
                            Tipo de evento
                        </th>
                        <th className="px-6 py-3 text-sm font-medium text-gray-800">
                            Estado
                        </th>
                        <th className="px-6 py-3 text-sm font-medium text-gray-800">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {agendas.map(agenda => (
                        <tr
                            key={agenda.id}
                            className="border-b hover:bg-blue-50">
                            <td className="px-6 py-2 text-sm">
                                {agenda.candidate.persons.first_name}{' '}
                                {agenda.candidate.persons.last_name}
                            </td>
                            <td className="px-6 py-2 text-sm">
                                {agenda.candidate.persons.identification_value}
                            </td>
                            <td className="px-6 py-2 text-sm">
                                {agenda.candidate.vacancy.title}
                            </td>
                            <td className="px-6 py-2 text-sm">
                                {agenda.typeagenda.name}
                            </td>
                            <td className="px-6 py-2 text-sm">
                                {agenda.status.name}
                            </td>
                            <td className="justify-center px-8 py-2 text-sm">
                                {/* Botón Ver Detalles */}
                                <button
                                    onClick={() =>
                                        router.push(
                                            `/profile/admin/recruitment/applications-re/inspect/${candidate.id}`,
                                        )
                                    }
                                    className="p-1 text-blue-600 transition rounded-md hover:bg-gray-100">
                                    <Eye size={26} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Controles de paginación */}
            <div className="flex items-center justify-center mt-6 space-x-2">
                <button
                    onClick={() =>
                        setFilters(prev => ({
                            ...prev,
                            page: meta.current_page - 1,
                        }))
                    }
                    disabled={meta.current_page === 1}
                    className={`px-2 py-1 text-xs text-white rounded ${
                        meta.current_page === 1
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-[#004b9a] hover:bg-blue-700'
                    }`}>
                    ← Anterior
                </button>
                <span className="text-xs text-gray-700">
                    Página {meta.current_page} de {meta.last_page}
                </span>
                <button
                    onClick={() =>
                        setFilters(prev => ({
                            ...prev,
                            page: meta.current_page + 1,
                        }))
                    }
                    disabled={meta.current_page === meta.last_page}
                    className={`px-2 py-1 text-xs text-white rounded ${
                        meta.current_page === meta.last_page
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-[#004b9a] hover:bg-blue-700'
                    }`}>
                    Siguiente →
                </button>
            </div>
        </div>
        </>
    );
};

export default AgendarEntrevista;
