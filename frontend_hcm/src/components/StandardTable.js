'use client'

import React from 'react'

const StandardTable = ({
    title,
    columns,
    data,
    filters,
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    onFilterChange,
    actions,
}) => {
    return (
        <div className="max-w-full p-6 mx-auto mt-6 ml-6 overflow-hidden bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-2xl font-semibold text-gray-700">
                {title}
            </h2>

            {/* Filtros */}
            {filters && (
                <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-3">
                    {filters.map((filter, index) => (
                        <select
                            key={index}
                            name={filter.name}
                            value={filter.value}
                            onChange={onFilterChange}
                            className="w-full p-3 text-sm text-gray-700 transition duration-200 ease-in-out bg-transparent border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-0">
                            <option value="" className="text-gray-500">
                                {filter.placeholder}
                            </option>
                            {filter.options.map(option => (
                                <option
                                    key={option.value}
                                    value={option.value}
                                    className="text-gray-600">
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    ))}
                </div>
            )}

            {/* Tabla */}
            <table className="min-w-full border-separate table-auto border-spacing-2">
                <thead>
                    <tr className="text-left bg-blue-200">
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className="px-4 py-3 text-sm font-medium text-gray-800">
                                {column.header}
                            </th>
                        ))}
                        {actions && (
                            <th className="px-4 py-3 text-sm font-medium text-gray-800">
                                Acciones
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className="border-b hover:bg-blue-50">
                            {columns.map((column, colIndex) => (
                                <td
                                    key={colIndex}
                                    className="px-4 py-2 text-sm">
                                    {column.render
                                        ? column.render(item)
                                        : item[column.accessor]}
                                </td>
                            ))}
                            {actions && (
                                <td className="justify-center px-8 py-2 text-sm">
                                    {actions.map((action, actionIndex) => (
                                        <button
                                            key={actionIndex}
                                            onClick={() => action.handler(item)}
                                            className={`p-1 ${action.color} transition rounded-md hover:bg-gray-100`}>
                                            {action.icon}
                                        </button>
                                    ))}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Paginación */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center mt-6 space-x-2">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1 || loading}
                        className={`px-2 py-1 text-xs text-white rounded ${
                            currentPage === 1 || loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-[#004b9a] hover:bg-blue-700'
                        }`}>
                        ← Anterior
                    </button>

                    <span className="text-xs text-gray-700">
                        Página {currentPage} de {totalPages}
                    </span>

                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || loading}
                        className={`px-2 py-1 text-xs text-white rounded ${
                            currentPage === totalPages || loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-[#004b9a] hover:bg-blue-700'
                        }`}>
                        Siguiente →
                    </button>
                </div>
            )}
        </div>
    )
}

export default StandardTable
