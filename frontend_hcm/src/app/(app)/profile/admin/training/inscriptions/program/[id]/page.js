'use client'

import { useRouter } from 'next/navigation'
import { CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import StandardTable from '@/components/StandardTable'
import { EyeIcon } from '@heroicons/react/24/solid'
import { ArrowLeft } from 'lucide-react'
import { useRegistrationProgramDetail } from '@/hooks/admin/useRegistrationDetail'
import { toast } from 'sonner'
import { useState } from 'react'
import { DeleteModal } from '@/components/Modal'

const RegistrationProgram = ({ params }) => {
    const router = useRouter()
    const {
        program,
        participants,
        filters,
        meta,
        loading,
        error,
        params: filterParams,
        updateParams,
        goToPage,
    } = useRegistrationProgramDetail(params.id)

    // Configuración de la tabla
    const tableColumns = [
        {
            header: 'Nombre',
            accessor: 'name', // Acceso directo al campo 'name'
            render: item => item?.name || '-',
        },
        {
            header: 'Correo',
            accessor: 'email', // Acceso directo al campo 'email'
            render: item => item?.email || '-', // Acceso directo al campo 'email'
        },
        {
            header: 'Departamento',
            accessor: 'department', // Acceso directo al campo 'department'
            render: item => item?.department || '-', // Acceso directo al campo 'department'
        },
        {
            header: 'Fecha de inscripción',
            accessor: 'enrollment_date', // Acceso directo al campo 'enrollment_date'
            render: item =>
                item?.enrollment_date ? new Date(item.enrollment_date).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                }) : '-',
        },
        {
            header: 'Estado',
            accessor: 'status', // Acceso directo al campo 'status'
            render: item => item?.status || '-', // Acceso directo al campo 'status'
        },
    ];

    const tableActions = [
        {
            icon: <EyeIcon className="w-5 h-5 text-[#004b9a]" />,
            color: 'text-[#004b9a]',
            handler: item =>
                router.push(
                    `/profile/admin/training/inscriptions/inspect/${item.id}`,
                ),
        },
    ]

    const tableFilters = [
        {
            name: 'status',
            value: filterParams.status,
            placeholder: 'Filtrar por estado',
            type: 'select',
            options: filters?.completion_statuses?.map(status => ({
                value: status,
                label: status
            })) || []
        }
    ]

    const handleFilterChange = e => {
        const { name, value } = e.target
        updateParams({ [name]: value })
    }

    const handlePageChange = page => {
        goToPage(page)
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
                    Error: {error}
                </div>
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-[#004b9a] hover:text-[#003a7a]">
                    <ArrowLeft size={20} className="mr-2" />
                    Volver a Programas
                </button>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 ml-6 bg-white rounded-lg shadow-lg">
            {/* Encabezado */}
            <div className="border-b-2 border-[#004b9a] pb-4 mb-6">
                <div className="flex items-center gap-4 mb-4">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-[#004b9a] hover:text-[#003a7a]">
                        <ArrowLeft size={20} className="mr-2" />
                        Volver
                    </button>
                </div>

                <h1 className="text-3xl font-bold text-[#004b9a]">
                    {program?.name || 'Cargando...'}
                </h1>

                <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-3 py-1 text-sm text-blue-800 bg-blue-100 rounded-full">
                        {program?.metadata?.type || 'N/A'}
                    </span>
                    <span className="px-3 py-1 text-sm text-purple-800 bg-purple-100 rounded-full">
                        {program?.metadata?.modality || 'N/A'}
                    </span>
                    <span
                        className={`px-3 py-1 text-sm rounded-full ${
                            program?.metadata?.status === 'Activo'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                        }`}>
                        {program?.metadata?.status || 'N/A'}
                    </span>
                </div>
            </div>

            {/* Contenido Principal */}
            <div className="grid gap-8 md:grid-cols-2">
                {/* Columna Izquierda */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-[#004b9a] mb-3">
                            Detalles del Programa
                        </h3>
                        <p className="text-gray-600">{program?.description}</p>
                    </div>

                    <div className="space-y-4">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
                            <CalendarIcon className="w-6 h-6 text-[#004b9a]" />
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Fecha de inicio
                                </p>
                                <p className="font-medium text-gray-700">
                                    {new Date(
                                        program?.schedule?.start,
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
                                        program?.schedule?.end
                                    ).toLocaleDateString('es-ES', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                        <div className="p-4 rounded-lg bg-gray-50">
                            <h4 className="font-semibold text-[#004b9a] mb-2">
                                Capacidad
                            </h4>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <UserGroupIcon className="w-5 h-5 text-[#004b9a]" />
                                    <span>
                                        Total: {program?.metadata?.capacity?.total || 0}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <UserGroupIcon className="w-5 h-5 text-[#004b9a]" />
                                    <span>
                                        Disponible: {program?.metadata?.capacity?.available || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Columna Derecha */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-[#004b9a] mb-3">
                            Estructura del Contenido
                        </h3>
                        {program?.content ? (
                            <div className="space-y-4">
                                {program.content.map((module, index) => (
                                    <div
                                        key={index}
                                        className="p-4 rounded-lg bg-gray-50">
                                        <h4 className="font-medium text-[#004b9a]">
                                            Módulo {index + 1}: {module.module}
                                        </h4>
                                        {module.topics?.length > 0 && (
                                            <ul className="pl-4 mt-2 space-y-1 list-disc">
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
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 text-center rounded-lg bg-gray-50">
                                <p className="text-gray-500">
                                    Contenido no disponible
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="p-4 rounded-lg bg-blue-50">
                        <div className="flex items-center gap-3">
                            <UserGroupIcon className="w-6 h-6 text-[#004b9a]" />
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Visibilidad: {program?.metadata?.visibility || 'N'}
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

            {/* Tabla de Participantes */}
            <div className="mt-8">
                <StandardTable
                    title="Participantes"
                    columns={tableColumns}
                    data={participants || []}
                    filters={tableFilters}
                    currentPage={meta?.current_page || 1}
                    totalPages={meta?.last_page || 1}
                    onPageChange={handlePageChange}
                    onFilterChange={handleFilterChange}
                    actions={tableActions}
                    loading={loading}
                />
            </div>
        </motion.div>
    )
}

export default RegistrationProgram