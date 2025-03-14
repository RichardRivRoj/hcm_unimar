'use client'

import { useRouter } from 'next/navigation'
import { CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import StandardTable from '@/components/StandardTable'
import { EyeIcon } from '@heroicons/react/24/solid'
import { ArrowLeft } from 'lucide-react'
import { useEmployeeTrainings } from '@/hooks/employee/useEmployeeTrainings'
import { toast } from 'sonner'
import { useState } from 'react'
import { DeleteModal } from '@/components/Modal'

const EnrolledProgramDetail = ({ program }) => {
    const [isCanceling, setIsCanceling] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const { cancelEnrollment } = useEmployeeTrainings()
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

    const handleCancelEnrollment = async () => {
        setIsCanceling(true)
        try {
            const success = await cancelEnrollment(program.id)
            if (success) {
                toast.success('Inscripción cancelada', {
                    description:
                        'Has sido dado de baja del programa exitosamente',
                })
                router.push('/profile/employee/training/programs/')
            }
        } catch (error) {
            toast.error('Error al cancelar', {
                description: error.message,
            })
        } finally {
            setIsCanceling(false)
        }
    }

    // Configuración de la tabla de empleados inscritos
    const tableColumns = [
        {
            header: 'Nombre',
            accessor: 'name',
        },
        {
            header: 'Correo',
            accessor: 'email',
        },
        {
            header: 'Fecha de inscripción',
            accessor: 'enrollment_date',
            render: item => (
                <span>
                    {new Date(item.enrollment_date).toLocaleDateString(
                        'es-ES',
                        {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        },
                    )}
                </span>
            ),
        },
    ]

    const tableActions = [
        {
            icon: <EyeIcon className="w-5 h-5 text-[#004b9a]" />,
            color: 'text-[#004b9a]',
            handler: item =>
                router.push(
                    `/profile/employee/training/${item.employee_id || 'unknown'}`,
                ),
        },
    ]

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-white rounded-lg shadow-lg">
            {/* Encabezado */}
            <div className="border-b-2 border-[#004b9a] pb-4 mb-6">
                <div className="flex flex-col justify-between gap-4 mb-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center text-[#004b9a] hover:text-[#003a7a]">
                            <ArrowLeft size={20} className="mr-2" />
                            Volver a Programas
                        </button>

                        {((program.classification === 'INSCRITOS' &&
                            program.visibility === 'Público') ||
                            program.classification === 'EN_PROGRESO') && (
                            <button
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="bg-red-600 hover:bg-red-700' px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg">
                                Dar de baja
                            </button>
                        )}
                    </div>
                </div>

                {/* Modal de Eliminación */}
                <DeleteModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    title="Eliminar Programa"
                    actions={
                        <>
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                                Cancelar
                            </button>
                            <button
                                onClick={handleCancelEnrollment}
                                disabled={isCanceling}
                                className={`flex items-center px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                                    isCanceling
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-red-600 hover:bg-red-700'
                                }`}>
                                {isCanceling ? 'Cancelando...' : 'Dar de baja'}
                            </button>
                        </>
                    }>
                    <p>
                        ¿Estás seguro de que deseas darte de baja del programa{' '}
                        <span className='font-bold'>{program.name}</span>?
                    </p>
                </DeleteModal>

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
                        Inscritos: {program.enrolled_employees.length}
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
                                    Este programa está disponible para empleados
                                    específicos
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabla de empleados inscritos */}
            <div className="mt-8">
                <StandardTable
                    title="Empleados Inscritos"
                    columns={tableColumns}
                    data={program.enrolled_employees}
                    actions={tableActions}
                />
            </div>
        </motion.div>
    )
}

export default EnrolledProgramDetail
