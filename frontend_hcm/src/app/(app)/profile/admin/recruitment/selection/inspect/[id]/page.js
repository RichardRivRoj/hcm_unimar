'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import axios from '@/lib/axios'
import useAgendaResultShow from '@/hooks/useResultDetailsShow'
import DetailCard from '@/components/DetailCard'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import Modal from '@/components/Modal' // Importar el componente Modal
import HireEmployeeForm from '@/components/HireEmployeeForm' // Importar el formulario de contratación

const ResultDetails = ({ params }) => {
    const router = useRouter()
    const { id } = params
    const { data: result, loading, error } = useAgendaResultShow(id)
    const [loadingStatus, setLoadingStatus] = useState(false)
    const [errorStatus, setErrorStatus] = useState(null)
    const [successStatus, setSuccessStatus] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleDownloadPDF = () => {
        const element = document.getElementById('report-content')

        html2canvas(element).then(canvas => {
            const imgData = canvas.toDataURL('image/png')
            const pdf = new jsPDF('p', 'mm', 'a4')
            const imgWidth = 210 // Ancho de A4 en mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
            pdf.save(`reporte_${result.candidate.personal_info.full_name}.pdf`)
        })
    }

    // Abrir modal
    const openModal = () => setIsModalOpen(true)

    // Cerrar modal
    const closeModal = () => setIsModalOpen(false)

    // Manejar éxito en la contratación
    const handleHireSuccess = response => {
        setSuccessStatus(true)
        closeModal() // Cerrar el modal después de contratar
        console.log('Candidato contratado:', response)
    }

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deleteError, setDeleteError] = useState(null)
    const [deleteSuccess, setDeleteSuccess] = useState(false)

    const openDeleteConfirmation = () => {
        setShowDeleteModal(true)
        setDeleteError(null)
        setDeleteSuccess(false)
    }

    const cancelDelete = () => setShowDeleteModal(false)

    const confirmDelete = async () => {
        try {
            // Cambiar la ruta al endpoint correcto de AgendaResult
            const response = await axios.delete(`/api/agenda-results/${id}`)

            if (response.status === 200) {
                setDeleteSuccess(true)
                // Redirigir después de 1.5 segundos
                setTimeout(() => router.back(), 1500)
            }
        } catch (err) {
            setDeleteError(
                err.response?.data?.message ||
                    'Error en el proceso de rechazo del candidato',
            )
        } finally {
            setTimeout(() => setShowDeleteModal(false), 2000)
        }
    }

    if (loading) {
        return (
            <div className="max-w-4xl p-8 mx-auto space-y-6 animate-pulse">
                <div className="w-3/4 h-10 bg-gray-100 rounded-full"></div>
                <div className="w-2/3 h-4 bg-gray-100 rounded"></div>
                <div className="grid gap-4 mt-8 md:grid-cols-2">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="p-4 space-y-2 rounded-lg bg-gray-50">
                            <div className="w-1/4 h-4 bg-gray-100 rounded"></div>
                            <div className="w-3/4 h-6 bg-gray-100 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (error) return <div className="p-6 text-red-600">Error: {error}</div>

    return (
        <div
            id="report-content"
            className="max-w-4xl p-8 mx-auto text-justify bg-white shadow-sm rounded-xl">
            {/* Encabezado y controles */}
            <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-gray-600 hover:text-blue-800 group w-fit">
                    <span className="mr-2 text-2xl transition-transform group-hover:-translate-x-1">
                        ←
                    </span>
                    <span className="font-medium">Volver</span>
                </button>

                <button
                    onClick={handleDownloadPDF}
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                    Descargar PDF
                </button>
            </div>

            {/* Contenido principal */}
            <div className="space-y-8">
                {/* Información del candidato */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {result.candidate.personal_info.full_name}
                            </h1>
                            <p className="text-lg text-gray-600">
                                Proceso de selección para:{' '}
                                {result.candidate.vacancy_info.position}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Detalles principales */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <DetailCard
                        title="Identificación"
                        value={result.candidate.personal_info.identification}
                    />
                    <DetailCard
                        title="Promedio General"
                        value={result.process_details.average_score}
                    />
                    <DetailCard
                        title="Total Evaluaciones"
                        value={result.process_details.total_agendas}
                    />
                    <DetailCard
                        title="Departamento"
                        value={result.candidate.vacancy_info.department}
                    />
                    <DetailCard
                        title="Vacante"
                        value={result.candidate.vacancy_info.vacancy_title}
                    />
                    <DetailCard
                        title="Modalidad"
                        value={result.candidate.vacancy_info.modality}
                    />
                </div>

                {/* Detalles de evaluaciones */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Evaluaciones Realizadas
                    </h2>
                    <div className="space-y-4">
                        {result.process_details.agendas.map((agenda, index) => (
                            <div key={index} className="p-4 border rounded-lg">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">
                                        {agenda.type}
                                    </h3>
                                    <span
                                        className={`px-2 py-1 text-sm rounded ${
                                            agenda.status === 'Completada'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {agenda.status}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            Fecha: {agenda.scheduled_date}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Hora: {agenda.time}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Ubicación: {agenda.location}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">
                                            Puntuación: {agenda.score}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Comentarios: {agenda.comments}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Línea de tiempo */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Cronología del Proceso
                    </h2>
                    <div className="space-y-4">
                        {result.process_details.timeline.map((event, index) => (
                            <div key={index} className="flex items-start gap-4">
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`w-3 h-3 rounded-full ${
                                            event.status === 'Completada'
                                                ? 'bg-green-500'
                                                : 'bg-gray-300'
                                        }`}></div>
                                    {index <
                                        result.process_details.timeline.length -
                                            1 && (
                                        <div className="w-px h-8 bg-gray-300"></div>
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium">{event.event}</p>
                                    <p className="text-sm text-gray-600">
                                        {event.date}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Modal de confirmación */}
                {showDeleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="p-6 bg-white rounded-lg w-96">
                            <h3 className="mb-4 text-xl font-semibold">
                                Confirmar
                            </h3>

                            {deleteError && (
                                <div className="p-2 mb-4 text-red-600 bg-red-100 rounded">
                                    {deleteError}
                                </div>
                            )}

                            {deleteSuccess ? (
                                <div className="p-2 text-green-600 bg-green-100 rounded">
                                    Candidato rechazado exitosamente!
                                </div>
                            ) : (
                                <>
                                    <p className="mb-4 text-gray-600">
                                        Esta acción realizará:
                                        <ul className="pl-5 list-disc">
                                            <li>
                                                Marcar al candidato como
                                                Rechazado
                                            </li>
                                            <li>
                                                Inactivar todas las agendas
                                                relacionadas
                                            </li>
                                            <li>
                                                Enviar notificación al candidato
                                            </li>
                                        </ul>
                                    </p>

                                    <div className="flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={cancelDelete}
                                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                                            Cancelar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={confirmDelete}
                                            className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700">
                                            Confirmar
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Botón de Agendar Entrevista (solo si es Aceptado) */}
                <div className="flex gap-4">
                    {result.candidate.status_application?.name !==
                        'Pendiente' && (
                        <button
                            onClick={openModal}
                            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                            Contratar
                        </button>
                    )}
                    {(result.candidate.status_application?.name ===
                        'Aceptado' ||
                        result.candidate.status_application?.name ===
                            'En Progreso') && (
                        <div className="flex gap-4">
                            <button
                                onClick={openDeleteConfirmation} // Aquí se ejecuta correctamente la función
                                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700">
                                Rechazar
                            </button>
                        </div>
                    )}
                </div>

                {/* Modal de Contratación */}
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <div className="flex flex-col gap-4">
                        <h2 className="text-xl font-semibold">
                            Contratar Candidato
                        </h2>

                        <HireEmployeeForm
                            candidateId={id}
                            onSuccess={handleHireSuccess}
                        />
                    </div>
                </Modal>
            </div>
        </div>
    )
}

export default ResultDetails
