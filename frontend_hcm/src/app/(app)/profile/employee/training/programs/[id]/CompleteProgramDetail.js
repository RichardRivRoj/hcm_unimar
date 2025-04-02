'use client'

import { CalendarIcon, DocumentCheckIcon, ChartBarIcon, ClockIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

const ProgramResultsDetail = ({ program }) => {
    const router = useRouter()
    
    const parseContent = () => {
        try {
            if (!program.content) return null
            return JSON.parse(program.content)
        } catch (error) {
            toast.error('Contenido del programa de análisis de errores')
            return null
        }
    }

    const content = parseContent()

    const handleDownloadCertificate = () => {
        // Lógica para descargar constancia
        toast.message('Descarga de constancia iniciada', {
            description: 'Tu certificado se está generando...'
        })
    }

    const renderResultItem = (label, value, icon, suffix = '') => {
        return (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
                {icon}
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500">{label}</p>
                    <p className="font-medium text-gray-700">
                        {value ?? 'Sin datos disponibles'}
                        {value && suffix}
                    </p>
                </div>
            </div>
        )
    }

    const canDownloadCertificate = program.results.score !== null || 
                                 program.results.attendance_rate !== null

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-white rounded-lg shadow-lg">
            
            {/* Encabezado */}
            <div className="border-b-2 border-[#004b9a] pb-4 mb-6">
                <div className="mb-4">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-[#004b9a] hover:text-[#003a7a]">
                        <ArrowLeft size={20} className="mr-2" />
                        Volver a Programas
                    </button>
                </div>
                <h1 className="text-3xl font-bold text-[#004b9a]">
                    {program.name}
                </h1>
                <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-3 py-1 text-sm text-white bg-green-600 rounded-full">
                        {program.classification}
                    </span>
                    <span className="px-3 py-1 text-sm text-blue-800 bg-blue-100 rounded-full">
                        {program.training_type}
                    </span>
                    <span className="px-3 py-1 text-sm text-purple-800 bg-purple-100 rounded-full">
                        {program.modality}
                    </span>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="grid gap-8 md:grid-cols-2">
                {/* Columna izquierda */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-[#004b9a] mb-3">
                            Descripción del programa
                        </h3>
                        <p className="leading-relaxed text-gray-600">
                            {program.description}
                        </p>
                    </div>

                    <div className="space-y-4">
                        {renderResultItem(
                            'Puntuación Final',
                            program.results.score,
                            <ChartBarIcon className="w-6 h-6 text-[#004b9a]" />,
                            '/100'
                        )}

                        {renderResultItem(
                            'Tasa de Asistencia',
                            program.results.attendance_rate,
                            <ClockIcon className="w-6 h-6 text-[#004b9a]" />,
                            '%'
                        )}

                        {renderResultItem(
                            'Fecha de Culminación',
                            new Date(program.results.completion_date).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            }),
                            <CalendarIcon className="w-6 h-6 text-[#004b9a]" />
                        )}
                    </div>
                </div>

                {/* Columna derecha */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-[#004b9a] mb-3">
                            Estructura del Programa
                        </h3>

                        {content ? (
                            <div className="space-y-4">
                                {content.map((module, index) => (
                                    <div
                                        key={index}
                                        className="p-4 rounded-lg bg-gray-50">
                                        <h4 className="font-medium text-[#004b9a] mb-2">
                                            Módulo {index + 1}: {module.module}
                                        </h4>
                                        {module.topics?.length > 0 ? (
                                            <ul className="pl-6 space-y-2 list-disc">
                                                {module.topics.map(
                                                    (topic, i) => (
                                                        <li
                                                            key={i}
                                                            className="text-gray-600">
                                                            {topic}
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-gray-500">
                                                Sin temas definidos en este módulo
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 text-center rounded-lg bg-gray-50">
                                <p className="text-gray-500">
                                    Contenido del programa no disponible
                                </p>
                            </div>
                        )}
                    </div>

                    {canDownloadCertificate && (
                        <div className="mt-6">
                            <button
                                onClick={handleDownloadCertificate}
                                className="flex items-center justify-center w-full gap-2 px-6 py-3 font-medium text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700">
                                <DocumentCheckIcon className="w-5 h-5" />
                                Descargar Constancia de Culminación
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

export default ProgramResultsDetail