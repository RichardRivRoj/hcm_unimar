'use client'

import React, { useState, useEffect } from 'react'
import useAgendaResults from '@/hooks/useAgendaResult'
import { useRouter } from 'next/navigation'
import { Eye } from 'lucide-react'
import axios from '@/lib/axios'
import StandardLoader from '@/components/StandardLoader'

const SelectionPage = () => {
    const router = useRouter()
    const [vacancies, setVacancies] = useState([])
    const [filters, setFilters] = useState({
        page: 1,
        search: '',
        sortBy: 'created_at',
        sortOrder: 'desc',
        vacancyId: '',
    })

    // Obtener vacantes para el filtro
    useEffect(() => {
        axios
            .get('/api/vacancies')
            .then(res => setVacancies(res.data.data))
            .catch(console.error)
    }, [])

    const { data: candidates, meta, loading, error } = useAgendaResults(filters)

    const handleFilterChange = e => {
        const { name, value } = e.target
        setFilters(prev => ({ ...prev, [name]: value, page: 1 }))
    }

    if (loading)
        return <StandardLoader />

    if (error)
        return <div className="p-6 text-red-600">Error: {error.message}</div>

    return (
        <div className="max-w-full p-6 mx-auto mt-6 ml-6 overflow-hidden bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-2xl font-semibold text-gray-700">
                Resultados de Evaluación de Candidatos
            </h2>

            {/* Filtros */}
            <div className="flex flex-row justify-end gap-6 mb-8">
                <input
                    type="text"
                    name="search"
                    value={filters.search}
                    placeholder="Buscar por nombre"
                    className="w-1/4 p-3 text-sm text-gray-700 transition duration-200 ease-in-out bg-transparent border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-0"
                    onChange={e => {
                        setFilters(prev => ({
                            ...prev,
                            search: e.target.value,
                            page: 1,
                        }))
                    }}
                />

                <select
                    name="vacancyId"
                    onChange={handleFilterChange}
                    className="w-1/4 p-3 text-sm text-gray-700 transition duration-200 ease-in-out bg-transparent border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-0">
                    <option value="" className="text-gray-500">
                        Todas las vacantes
                    </option>
                    {vacancies.map(vacancy => (
                        <option
                            key={vacancy.id}
                            value={vacancy.id}
                            className="text-gray-600">
                            {vacancy.position?.description || 'Sin posición'}
                        </option>
                    ))}
                </select>

                <select
                    name="sortBy"
                    value={filters.sortBy}
                    onChange={handleFilterChange}
                    className="w-1/4 p-3 text-sm text-gray-700 transition duration-200 ease-in-out bg-transparent border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-0">
                    <option value="created_at">Ordenar por fecha</option>
                    <option value="average_score">Ordenar por promedio</option>
                </select>

                <select
                    name="sortOrder"
                    value={filters.sortOrder}
                    onChange={handleFilterChange}
                    className="w-1/4 p-3 text-sm text-gray-700 transition duration-200 ease-in-out bg-transparent border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-0">
                    <option value="desc">Descendente</option>
                    <option value="asc">Ascendente</option>
                </select>
            </div>

            {/* Tabla de resultados */}
            <table className="min-w-full border-separate table-auto border-spacing-2">
                <thead>
                    <tr className="text-left bg-blue-200">
                        <th className="px-6 py-3 text-sm font-medium text-gray-800">
                            Nombre Completo
                        </th>
                        <th className="px-6 py-3 text-sm font-medium text-gray-800">
                            Identificación
                        </th>
                        <th className="px-6 py-3 text-sm font-medium text-gray-800">
                            Total Evaluaciones
                        </th>
                        <th className="px-6 py-3 text-sm font-medium text-gray-800">
                            Promedio General
                        </th>
                        <th className="px-6 py-3 text-sm font-medium text-gray-800">
                            Puesto
                        </th>
                        <th className="px-6 py-3 text-sm font-medium text-gray-800">
                            Última Evaluación
                        </th>
                        <th className="px-6 py-3 text-sm font-medium text-gray-800">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {candidates.map(candidate => (
                        <tr
                            key={candidate.candidate_id}
                            className="border-b hover:bg-blue-50">
                            <td className="px-6 py-2 text-sm">
                                {candidate.full_name}
                            </td>
                            <td className="px-6 py-2 text-sm">
                                {candidate.identification}
                            </td>
                            <td className="px-6 py-2 text-sm">
                                {candidate.total_evaluations}
                            </td>
                            <td className="px-6 py-2 text-sm">
                                {candidate.average_score.toFixed(2)}
                            </td>
                            <td className="px-6 py-2 text-sm">
                                {candidate.vacancy.position}
                            </td>
                            <td className="px-6 py-2 text-sm">
                                {candidate.last_evaluation}
                            </td>
                            <td className="justify-center px-8 py-2 text-sm">
                                <button
                                    onClick={() =>
                                        router.push(
                                            `/profile/admin/recruitment/selection/inspect/${candidate.candidate_id}`,
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
                        setFilters(prev => ({ ...prev, page: prev.page - 1 }))
                    }
                    disabled={filters.page === 1}
                    className={`px-2 py-1 text-xs text-white rounded ${
                        filters.page === 1
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
                        setFilters(prev => ({ ...prev, page: prev.page + 1 }))
                    }
                    disabled={filters.page === meta.last_page}
                    className={`px-2 py-1 text-xs text-white rounded ${
                        filters.page === meta.last_page
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-[#004b9a] hover:bg-blue-700'
                    }`}>
                    Siguiente →
                </button>
            </div>
        </div>
    )
}

export default SelectionPage
