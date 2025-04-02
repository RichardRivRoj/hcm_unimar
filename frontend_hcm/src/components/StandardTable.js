'use client'

import React from 'react'
import { Search, ArrowLeft, ArrowRight } from 'lucide-react'

const StandardTable = ({
    title,
    columns,
    data,
    filters,
    currentPage = 1,
    totalPages = 1,
    totalItems,
    onPageChange,
    onFilterChange,
    actions,
    loading,
}) => {
    return (
        <div className="max-w-full p-8 mx-auto bg-white shadow-lg rounded-xl">
            {/* Header */}
            <div className="mb-8 border-b-2 border-[#004b9a] pb-4">
                <h2 className="text-2xl font-bold text-[#004b9a] flex items-center gap-3">
                    <span className="bg-[#004b9a] text-white p-2 rounded-lg">
                        <img src="/logo-8.png" className="w-16 h-auto" />
                    </span>
                    {title}
                </h2>
            </div>

            {/* Filtros */}
            {filters && (
                <div className="flex flex-col gap-4 mb-8 md:flex-row">
                    {filters.map((filter, index) => {
                        if (filter.type === 'search') {
                            return (
                                <div key={index} className="relative flex-none">
                                    <input
                                        type="text"
                                        name={filter.name}
                                        value={filter.value}
                                        placeholder={filter.placeholder}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-[#004b9a]/20 focus:border-[#004b9a] focus:ring-2 focus:ring-[#004b9a]/30 transition-all"
                                        onChange={onFilterChange}
                                    />
                                    <Search className="absolute left-3 top-3.5 text-[#004b9a]/50" />
                                </div>
                            )
                        }
                        return (
                            <select
                                key={index}
                                name={filter.name}
                                value={filter.value}
                                onChange={onFilterChange}
                                className="w-full py-3 px-4 rounded-lg border-2 border-[#004b9a]/20 focus:border-[#004b9a] focus:ring-2 focus:ring-[#004b9a]/30 bg-white">
                                <option value="">{filter.placeholder}</option>
                                {filter.options.map(option => (
                                    <option
                                        key={option.value}
                                        value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        )
                    })}
                </div>
            )}

            {/* Tabla */}
            <div className="overflow-x-auto rounded-lg border border-[#004b9a]/20">
                <table className="min-w-full">
                    <thead className="bg-[#004b9a] text-white">
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className={`px-6 py-4 font-semibold ${
                                        column.align === 'center'
                                            ? 'text-center'
                                            : 'text-left'
                                    } ${
                                        index === 0
                                            ? 'rounded-tl-lg'
                                            : index === columns.length - 1 &&
                                                !actions
                                              ? 'rounded-tr-lg'
                                              : ''
                                    }`}>
                                    {column.header}
                                </th>
                            ))}
                            {actions && (
                                <th className="px-6 py-4 font-semibold text-center rounded-tr-lg">
                                    Acciones
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#004b9a]/10">
                        {data.map((item, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className="hover:bg-[#004b9a]/5 transition-colors">
                                {columns.map((column, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className={`px-6 py-4 ${
                                            column.align === 'center'
                                                ? 'text-center'
                                                : 'text-left'
                                        } ${
                                            colIndex === 0
                                                ? 'font-medium text-gray-800'
                                                : 'text-gray-600'
                                        }`}>
                                        {column.render
                                            ? column.render(item)
                                            : item[column.accessor]}
                                    </td>
                                ))}
                                {actions && (
                                    <td className="px-6 py-4 text-center">
                                        {actions.map((action, actionIndex) => (
                                            <button
                                                key={actionIndex}
                                                onClick={() =>
                                                    action.handler(item)
                                                }
                                                className={`p-2 ${action.color} hover:bg-[#004b9a]/10 rounded-lg transition-colors`}>
                                                {action.icon}
                                            </button>
                                        ))}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            {totalPages >= 1 && (
                <div className="flex items-center justify-between px-4 mt-6">
                    <span className="text-sm text-gray-600">
                        {totalItems !== undefined &&
                            `Mostrando ${data.length} de ${totalItems} resultados`}
                    </span>

                    <div className="flex gap-2">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1 || loading}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                                currentPage === 1 || loading
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-[#004b9a] text-white hover:bg-[#003a7a]'
                            }`}>
                            <ArrowLeft size={16} />
                            Anterior
                        </button>

                        <span className="flex items-center px-4 py-2 text-gray-600">
                            Página {currentPage} de {totalPages}
                        </span>

                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages || loading}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                                currentPage === totalPages || loading
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-[#004b9a] text-white hover:bg-[#003a7a]'
                            }`}>
                            Siguiente
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default StandardTable
