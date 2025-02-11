'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import useCandidates from '@/hooks/useCandidate'
import { Eye } from 'lucide-react' // Importar ícono de "ver detalles"
import useStatusApplications from '@/hooks/statusApplicationsView'

const CandidatesPage = () => {
    const router = useRouter()
    const [filters, setFilters] = useState({
        sort: 'asc',
        status: '',
        vacancy_id: '',
    })
    const [currentPage, setCurrentPage] = useState(1)
    const {
        applications,
        loading: loadingApplications,
        error: errorApplications,
    } = useStatusApplications()
    const { candidates, loading, error, pagination } = useCandidates(filters)

    // Función para manejar cambios en los filtros
    const handleFilterChange = e => {
        const { name, value } = e.target
        setFilters(prev => ({
            ...prev,
            [name]: value,
        }))
        setCurrentPage(1) // Resetear a la primera página al cambiar filtros
    }

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
        <div className="max-w-full p-6 mx-auto mt-6 ml-6 overflow-hidden bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-2xl font-semibold text-gray-700">
                Resumen de Candidatos
            </h2>

            {/* Filtros */}
            <div className="flex flex-row justify-end gap-6 mb-8">
                <select
                    name="sort"
                    value={filters.sort}
                    onChange={handleFilterChange}
                    className="w-1/4 p-3 text-sm text-gray-700 transition duration-200 ease-in-out bg-transparent border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-0">
                    <option value="asc" className="text-gray-600">
                        Ordenar A-Z
                    </option>
                    <option value="desc" className="text-gray-600">
                        Ordenar Z-A
                    </option>
                </select>

                <select
                    name="status_application_id"
                    value={filters.status_application_id}
                    onChange={handleFilterChange}
                    className="w-1/4 p-3 text-sm text-gray-700 transition duration-200 ease-in-out bg-transparent border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-0">
                    <option value="" className="text-gray-500">
                        Seleccione estatus
                    </option>
                    {(applications || []).map(app => (
                        <option
                            key={app.id}
                            value={app.id}
                            className="text-gray-600">
                            {app.short_name} - {app.name}
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
                            Estatus
                        </th>
                        <th className="px-6 py-3 text-sm font-medium text-gray-800">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {candidates.map(candidate => (
                        <tr
                            key={candidate.id}
                            className="border-b hover:bg-blue-50">
                            <td className="px-6 py-2 text-sm">
                                {candidate.persons.first_name}{' '}
                                {candidate.persons.last_name}
                            </td>
                            <td className="px-6 py-2 text-sm">
                                {candidate.persons.identification_value}
                            </td>
                            <td className="px-6 py-2 text-sm">
                                {candidate.vacancy.title}
                            </td>
                            <td className="px-6 py-2 text-sm">
                                {candidate.status_application.short_name}
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
                            page: pagination.currentPage - 1,
                        }))
                    }
                    disabled={pagination.currentPage === 1}
                    className={`px-2 py-1 text-xs text-white rounded ${
                        pagination.currentPage === 1
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-[#004b9a] hover:bg-blue-700'
                    }`}>
                    ← Anterior
                </button>
                <span className="text-xs text-gray-700">
                    Página {pagination.currentPage} de {pagination.totalPages}
                </span>
                <button
                    onClick={() =>
                        setFilters(prev => ({
                            ...prev,
                            page: pagination.currentPage + 1,
                        }))
                    }
                    disabled={pagination.currentPage === pagination.totalPages}
                    className={`px-2 py-1 text-xs text-white rounded ${
                        pagination.currentPage === pagination.totalPages
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-[#004b9a] hover:bg-blue-700'
                    }`}>
                    Siguiente →
                </button>
            </div>
        </div>
    )
}

export default CandidatesPage
