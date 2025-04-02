'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export const ProgramCard = ({ program, type }) => {
    const router = useRouter()

    const getStatusColor = () => {
        switch (program.completion_classification) {
            case 'PUBLICO':
                return 'bg-blue-100 text-[#004b9a]'
            case 'INSCRITOS':
                return 'bg-amber-100 text-amber-800'
            case 'EN_PROGRESO':
                return 'bg-green-100 text-green-800'
            case 'COMPLETADO':
                return 'bg-gray-100 text-gray-600'
            default:
                return 'bg-gray-100'
        }
    }

    const handleViewDetails = () => {
        // Navegar a la página de detalles con el ID del programa
        router.push(`/profile/employee/training/programs/${program.id}`)
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-shrink-0 p-6 mr-6 transition-shadow bg-white shadow-lg rounded-xl hover:shadow-xl w-96">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-xl font-bold text-[#004b9a] mb-2">
                        {program.name}
                    </h3>
                    <span
                        className={`${getStatusColor()} px-3 py-1 rounded-full text-sm font-medium`}>
                        {program.completion_classification}
                    </span>
                </div>
                <span className="px-2 py-1 text-sm text-gray-500 bg-gray-100 rounded">
                    {program.training_type}
                </span>
            </div>

            <p className="mb-4 text-gray-600 line-clamp-3">
                {program.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center">
                    <CalendarIcon className="w-5 h-5 mr-2 text-[#004b9a]" />
                    <div>
                        <p className="text-xs text-gray-500">Fecha de inicio</p>
                        <p className="text-sm font-medium">
                            {program.start_date}
                        </p>
                    </div>
                </div>
                <div className="flex items-center">
                    <CalendarIcon className="w-5 h-5 mr-2 text-[#004b9a]" />
                    <div>
                        <p className="text-xs text-gray-500">Fecha final</p>
                        <p className="text-sm font-medium">
                            {program.end_date}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                {type === 'public' ? (
                    <div className="flex items-center">
                        <UserGroupIcon className="w-5 h-5 mr-2 text-[#004b9a]" />
                        <span className="text-sm font-medium">
                            {program.available_slots} cupos
                        </span>
                    </div>
                ) : (
                    <div className="flex items-center">
                        <UserIcon className="w-5 h-5 mr-2 text-[#004b9a]" />
                        <span className="text-sm font-medium">
                            {program.enrolled_count} inscritos
                        </span>
                    </div>
                )}
                <button
                    onClick={handleViewDetails}
                    className="px-4 py-2 bg-[#004b9a] hover:bg-[#003a7a] text-white rounded-lg transition-colors text-sm">
                    {type === 'public' ? 'Inscribirse' : 'Ver detalles'}
                </button>
            </div>
        </motion.div>
    )
}

export const Pagination = ({ pagination, setPage }) => {
    const { links, from, to, total } = pagination

    const labelTranslations = {
        '&laquo; Previous': '&laquo; Anterior',
        'Next &raquo;': 'Siguiente &raquo;',
        1: '1',
        2: '2',
        // Agrega más traducciones si es necesario
    }

    const handlePageChange = url => {
        if (!url) return
        const page =
            new URL(url).searchParams.get('public_page') ||
            new URL(url).searchParams.get('enrolled_page') ||
            new URL(url).searchParams.get('completed_page')
        setPage(parseInt(page))
    }

    return (
        <div className="flex flex-col items-center gap-4 mt-6 sm:flex-row sm:justify-between">
            <span className="text-sm text-gray-600">
                Mostrando {from}-{to} de {total}
            </span>

            <div className="flex items-center gap-2">
                {links.map((link, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(link.url)}
                        disabled={!link.url || link.active}
                        className={`px-3 py-1 rounded-md text-sm ${
                            link.active
                                ? 'bg-[#004b9a] text-white'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                        } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                        dangerouslySetInnerHTML={{
                            __html: labelTranslations[link.label] || link.label,
                        }}
                    />
                ))}
            </div>
        </div>
    )
}

export const CalendarIcon = ({ className }) => (
    <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
    </svg>
)

export const UserIcon = ({ className }) => (
    <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
    </svg>
)

export const UserGroupIcon = ({ className }) => (
    <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
    </svg>
)
