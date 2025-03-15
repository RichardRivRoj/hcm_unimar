'use client'

import { useTrainingProgram } from '@/hooks/admin/useTrainingPrograms'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Loader from '@/components/Loader'
import { Alert, AlertDescription } from '@/components/alert'
import { ArrowLeft, Calendar, CalendarCheck, Edit, Trash2 } from 'lucide-react'
import { DeleteModal, GeneralModal } from '@/components/Modal'
import UpdateTrainingProgramForm from './UpdateTrainingForm'
import StandardLoader from '@/components/StandardLoader'

const ProgramDetailPage = ({ params }) => {
    const id = params.id
    const { selectedProgram, fetchProgram, loading, error, deleteProgram } =
        useTrainingProgram()
    const router = useRouter()
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    useEffect(() => {
        fetchProgram(id)
    }, [id])

    const handleDelete = async () => {
        const { success } = await deleteProgram(id)
        if (success) {
            router.push('/profile/admin/training/programs')
        }
    }

    if (loading) return <StandardLoader />
    if (error)
        return (
            <Alert>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )

    return (
        <div className="min-h-screen p-6 ml-12 bg-gray-50">
            {/* Header con botones */}
            <div className="mb-8">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-[#004b9a] hover:text-[#003a7a]">
                        <ArrowLeft size={20} className="mr-2" />
                        Volver a Programas
                    </button>

                    <div className="flex gap-4">
                        {/* Botón Eliminar */}
                        {selectedProgram?.status?.name === 'Activo' && (
                            <button
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="p-2 text-red-600 transition-colors rounded-md hover:bg-red-100">
                                <Trash2 size={24} />
                            </button>
                        )}

                        {/* Botón Editar */}
                        <div className="flex flex-row">
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="px-6 py-2 text-white bg-[#004b9a] rounded-lg hover:bg-[#003a7a] transition-colors flex flex-row">
                                <Edit size={20} className="mr-2" />
                                Editar Programa
                            </button>
                        </div>
                    </div>
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
                            onClick={handleDelete}
                            className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700">
                            Eliminar
                        </button>
                    </>
                }>
                <p>¿Estás seguro de que deseas eliminar este programa?</p>
            </DeleteModal>

            {/* Modal de Edición */}
            <GeneralModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Editar Programa"
                size="p2xl" // Asegúrate de que tu Modal soporte diferentes tamaños
            >
                <UpdateTrainingProgramForm
                    programId={id}
                    onClose={() => setIsEditModalOpen(false)}
                />
            </GeneralModal>

            {/* Contenido principal */}
            <div className="p-6 bg-white rounded-lg shadow-lg">
                {/* Encabezado */}
                <div className="border-b-2 border-[#004b9a] pb-4 mb-6">
                    <h1 className="text-3xl font-bold text-[#004b9a]">
                        {selectedProgram?.name}
                    </h1>
                    <div className="flex gap-4 mt-2">
                        <span className="px-3 py-1 text-sm text-blue-800 bg-blue-100 rounded-full">
                            {selectedProgram?.training_type?.name}
                        </span>
                        <span className="px-3 py-1 text-sm text-purple-800 bg-purple-100 rounded-full">
                            {selectedProgram?.modality?.name}
                        </span>
                        <span
                            className={`px-3 py-1 rounded-full text-sm ${
                                selectedProgram?.status?.name === 'Activo'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                            }`}>
                            {selectedProgram?.status?.name}
                        </span>
                    </div>
                </div>

                {/* Detalles del programa */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Columna izquierda */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-[#004b9a] mb-2">
                                Descripción
                            </h3>
                            <p className="text-gray-600 whitespace-pre-line">
                                {selectedProgram?.description}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-[#004b9a] mb-2">
                                Fechas
                            </h3>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <Calendar
                                        size={18}
                                        className="text-[#004b9a]"
                                    />
                                    <span className="text-gray-600">
                                        Inicio:{' '}
                                        {new Date(
                                            new Date(
                                                selectedProgram?.start_date,
                                            ).toLocaleString('en-US', {
                                                timeZone: 'America/Caracas',
                                            }),
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CalendarCheck
                                        size={18}
                                        className="text-[#004b9a]"
                                    />
                                    <span className="text-gray-600">
                                        Fin:{' '}
                                        {new Date(
                                            new Date(
                                                selectedProgram?.end_date,
                                            ).toLocaleString('en-US', {
                                                timeZone: 'America/Caracas',
                                            }),
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Columna derecha */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-[#004b9a] mb-2">
                                Visibilidad
                            </h3>
                            <p className="text-gray-600">
                                {selectedProgram?.visibility?.name}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-[#004b9a] mb-2">
                                Contenido del Programa
                            </h3>
                            <div className="space-y-4">
                                {(() => {
                                    try {
                                        const content = selectedProgram?.content

                                        // Si no hay contenido, mostrar mensaje
                                        if (!content) {
                                            return (
                                                <div className="p-4 text-gray-600 rounded-lg bg-gray-50">
                                                    No se ha definido contenido
                                                    para este programa
                                                </div>
                                            )
                                        }

                                        // Intentar parsear el JSON
                                        const parsedContent =
                                            JSON.parse(content)

                                        // Si el contenido no es un array, mostrar mensaje
                                        if (!Array.isArray(parsedContent)) {
                                            return (
                                                <div className="p-4 text-gray-600 rounded-lg bg-gray-50">
                                                    El contenido del programa no
                                                    tiene un formato válido
                                                </div>
                                            )
                                        }

                                        // Si todo está bien, renderizar los módulos
                                        return parsedContent.map(
                                            (module, index) => (
                                                <div
                                                    key={index}
                                                    className="p-4 rounded-lg bg-gray-50">
                                                    <h4 className="font-medium text-[#004b9a] mb-2">
                                                        Módulo {index + 1}:{' '}
                                                        {module.module}
                                                    </h4>
                                                    {module.topics &&
                                                    Array.isArray(
                                                        module.topics,
                                                    ) ? (
                                                        <ul className="pl-6 space-y-1 list-disc">
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
                                                        <p className="text-gray-600">
                                                            No hay temas
                                                            definidos
                                                        </p>
                                                    )}
                                                </div>
                                            ),
                                        )
                                    } catch (error) {
                                        // Manejo de errores de JSON.parse
                                        return (
                                            <div className="p-4 text-gray-600 rounded-lg bg-gray-50">
                                                Error al cargar el contenido del
                                                programa
                                            </div>
                                        )
                                    }
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProgramDetailPage
