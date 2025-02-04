import React from 'react'

import { useRouter } from 'next/navigation'
import usePaginatedJobPostings from '@/hooks/paginatedJobPostings'

const JobList = () => {
    const { jobPostings, loading, error, currentPage, totalPages, goToPage } =
        usePaginatedJobPostings()
    const router = useRouter()

    const handleApply = id => {
        // Redirigir al usuario a la página de detalles de la oferta laboral
        router.push(`/job/${id}`)
    }

    // Limita la descripcion a 10 palabras
    const truncateDescription = description => {
        const words = description.split(' ')
        return words.length > 10
            ? `${words.slice(0, 10).join(' ')}...`
            : description
    }

    if (loading) {
        return (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
        )
    }
    if (error) return <p>Error: {error}</p>

    return (
        <div className="container p-2 mx-auto">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobPostings.map(job => (
                    <div
                        key={job.id}
                        className="p-5 transition-shadow duration-300 bg-white border border-gray-200 shadow-lg rounded-2xl hover:shadow-xl">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {job.title}
                        </h2>
                        <p className="mt-3 text-sm text-left text-gray-600">
                            {truncateDescription(job.description)}
                        </p>

                        <div className="flex items-center justify-between mt-4">
                            <span className="text-sm font-medium text-blue-600">
                                {job.mode.name}
                            </span>
                            <button
                                onClick={() => handleApply(job.id)}
                                className="px-4 py-2 text-sm font-medium text-white bg-[#004b9a] rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300">
                                Postularse
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Controles de paginación */}
            <div className="flex items-center justify-center mt-6 space-x-2">
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-2 py-1 text-xs text-white rounded ${
                        currentPage === 1
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-[#004b9a] hover:bg-blue-700'
                    }`}>
                    ← Anterior
                </button>
                <span className="text-xs text-gray-700">
                    Página {currentPage} de {totalPages}
                </span>
                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-2 py-1 text-xs text-white rounded ${
                        currentPage === totalPages
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-[#004b9a] hover:bg-blue-700'
                    }`}>
                    Siguiente →
                </button>
            </div>
        </div>
    )
}

export default JobList
