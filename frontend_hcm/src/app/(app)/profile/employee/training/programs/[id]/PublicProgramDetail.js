'use client'

import { CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

const PublicProgramDetail = ({ program, onEnroll }) => {
    const [isLoading, setIsLoading] = useState(false)
    const parseContent = () => {
        try {
            if (!program.content) return null
            return JSON.parse(program.content)
        } catch (error) {
            console.error('Error parsing program content:', error)
            return null
        }
    }
    
    const router = useRouter()

    const content = parseContent()

    const handleEnroll = async () => {
        setIsLoading(true)
        try {
            const success = await onEnroll(program.id)
            if (success) {
                toast.success('Inscripción exitosa', {
                    description: 'Te has inscrito correctamente en el programa',
                })
            }
        } catch (error) {
            toast.error('Error en la inscripción', {
                description: error.message,
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-white rounded-lg shadow-lg">
            {/* Encabezado */}
            <div className="border-b-2 border-[#004b9a] pb-4 mb-6">
                <div className="flex flex-col justify-between gap-4 mb-4 sm:flex-row sm:items-center">
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
                    <span className="px-3 py-1 text-sm text-blue-800 bg-blue-100 rounded-full">
                        {program.training_type}
                    </span>
                    <span className="px-3 py-1 text-sm text-purple-800 bg-purple-100 rounded-full">
                        {program.modality}
                    </span>
                    <span
                        className={`px-3 py-1 text-sm rounded-full ${
                            program.status === 'Activo'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                        }`}>
                        {program.status}
                    </span>
                    <span className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-full">
                        Cupos disponibles: {program.available_slots}
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
                        <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
                            <CalendarIcon className="w-6 h-6 text-[#004b9a]" />
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Fecha de inicio
                                </p>
                                <p className="font-medium text-gray-700">
                                    {new Date(
                                        program.start_date,
                                    ).toLocaleDateString('es-ES', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
                            <CalendarIcon className="w-6 h-6 text-[#004b9a]" />
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Fecha de finalización
                                </p>
                                <p className="font-medium text-gray-700">
                                    {new Date(
                                        program.end_date,
                                    ).toLocaleDateString('es-ES', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Columna derecha */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-[#004b9a] mb-3">
                            Estructura del programa
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
                                                Este módulo no tiene temas
                                                definidos
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 text-center rounded-lg bg-gray-50">
                                <p className="text-gray-500">
                                    El contenido del programa estará disponible
                                    próximamente
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="p-4 rounded-lg bg-blue-50">
                        <div className="flex items-center gap-3">
                            <UserGroupIcon className="w-6 h-6 text-[#004b9a]" />
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Visibilidad: {program.visibility}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Este programa está disponible para todos los
                                    empleados
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Botón de acción condicional */}
            {!program.completion_status && (
                <div className="mt-8">
                    <button
                        onClick={handleEnroll}
                        disabled={isLoading || program.available_slots <= 0}
                        className={`w-full py-3 px-6 text-white font-medium rounded-lg transition-colors ${
                            isLoading || program.available_slots <= 0
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-[#004b9a] hover:bg-[#003a7a]'
                        }`}>
                        {program.available_slots <= 0
                            ? 'Cupos agotados'
                            : isLoading
                              ? 'Procesando...'
                              : 'Inscribirse en el programa'}
                    </button>
                </div>
            )}
        </motion.div>
    )
}

export default PublicProgramDetail
