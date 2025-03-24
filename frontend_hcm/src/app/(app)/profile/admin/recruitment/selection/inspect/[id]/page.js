'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import axios from '@/lib/axios'
import useAgendaResultShow from '@/hooks/useResultDetailsShow'
import DetailCard from '@/components/DetailCard'
import { Modal } from '@/components/Modal'
import HireEmployeeForm from './HireEmployeeForm'
import StandardLoader from '@/components/StandardLoader'
import { PDFDownloadLink } from '@react-pdf/renderer'
import SelectionResultPDF from '@/components/SelectionResultPDF'
import { format } from 'date-fns'
import { CheckCircle2, XCircle, Clock, Download, ArrowLeft } from 'lucide-react'
import Card from '@/components/Card'

const ResultDetails = ({ params }) => {
    const router = useRouter()
    const { id } = params
    const { data: result, loading, error } = useAgendaResultShow(id)
    const [loadingStatus, setLoadingStatus] = useState(false)
    const [errorStatus, setErrorStatus] = useState(null)
    const [successStatus, setSuccessStatus] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deleteError, setDeleteError] = useState(null)
    const [deleteSuccess, setDeleteSuccess] = useState(false)

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

    // Reemplaza la función handleDownloadPDF por:
    const getFileName = () => {
        const candidateName = result.candidate.personal_info.full_name.replace(
            /\s+/g,
            '_',
        )
        const currentDate = format(new Date(), 'ddMMyyyy')
        return `Resultado_selección_${candidateName}_${currentDate}.pdf`
    }

    if (loading) return <StandardLoader />
    if (error) return <div className="p-6 text-red-600">Error: {error}</div>

    return (
        <div
            id="report-content"
            className="max-w-4xl p-6 mx-auto bg-white shadow-lg rounded-xl">
            {/* Encabezado y controles */}
            <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-[#004b9a] hover:text-[#003a7a] group w-fit">
                    <ArrowLeft className="mr-2 transition-transform group-hover:-translate-x-1" />
                    <span className="font-medium">Volver a resultados</span>
                </button>

                <PDFDownloadLink
                    document={<SelectionResultPDF result={result} />}
                    fileName={getFileName()}
                    className="flex items-center gap-2 px-4 py-2 text-white bg-[#004b9a] rounded-lg hover:bg-[#003a7a] transition-colors">
                    {({ loading }) => (
                        <>
                            <Download size={18} />
                            {loading ? 'Generando PDF...' : 'Descargar Reporte'}
                        </>
                    )}
                </PDFDownloadLink>
            </div>

            {/* Contenido principal */}
            <div className="space-y-8">
                {/* Información del candidato */}
                <div className="p-6 bg-[#004b9a]/5 rounded-xl border border-[#004b9a]/20">
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-[#004b9a]">
                                {result.candidate.personal_info.full_name}
                            </h1>
                            <p className="text-lg text-gray-600">
                                Proceso para:{' '}
                                {result.candidate.vacancy_info.position}
                            </p>
                        </div>
                        <span
                            className={`px-3 py-1 rounded-full text-sm ${
                                result.candidate.status_application?.name ===
                                'Contratado'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-[#004b9a]/10 text-[#004b9a]'
                            }`}>
                            {result.candidate.status_application?.name}
                        </span>
                    </div>
                </div>

                {/* Detalles principales */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card
                        title="Identificación"
                        value={result.candidate.personal_info.identification}
                        icon="id-card"
                        color="#004b9a"
                    />
                    <Card
                        title="Promedio General"
                        value={result.process_details.average_score}
                        icon="rating"
                        color="#004b9a"
                    />
                    <Card
                        title="Total Evaluaciones"
                        value={result.process_details.total_agendas}
                        icon="list"
                        color="#004b9a"
                    />
                    <Card
                        title="Departamento"
                        value={result.candidate.vacancy_info.department}
                        icon="building"
                        color="#004b9a"
                    />
                    <Card
                        title="Vacante"
                        value={result.candidate.vacancy_info.position}
                        icon="job"
                        color="#004b9a"
                    />
                    <Card
                        title="Modalidad"
                        value={result.candidate.vacancy_info.modality}
                        icon="clock"
                        color="#004b9a"
                    />
                </div>

                {/* Evaluaciones */}
                <div className="p-6 bg-white rounded-xl border border-[#004b9a]/20">
                    <h2 className="text-xl font-semibold text-[#004b9a] mb-4 flex items-center gap-2">
                        <CheckCircle2 className="text-[#004b9a]" />
                        Evaluaciones Realizadas
                    </h2>
                    <div className="space-y-4">
                        {result.process_details.agendas.map((agenda, index) => (
                            <div
                                key={index}
                                className="p-4 rounded-lg border border-[#004b9a]/20 hover:border-[#004b9a]/40 transition-colors">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-semibold text-[#004b9a]">
                                        {agenda.type}
                                    </h3>
                                    <span
                                        className={`flex items-center gap-1 text-sm px-2 py-1 rounded ${
                                            agenda.status === 'Completada'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {agenda.status === 'Completada' ? (
                                            <CheckCircle2 size={16} />
                                        ) : (
                                            <Clock size={16} />
                                        )}
                                        {agenda.status}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                                    <div className="space-y-1">
                                        <p className="text-gray-600">
                                            <span className="font-medium">
                                                Fecha:
                                            </span>{' '}
                                            {agenda.scheduled_date}
                                        </p>
                                        <p className="text-gray-600">
                                            <span className="font-medium">
                                                Hora:
                                            </span>{' '}
                                            {agenda.time}
                                        </p>
                                        <p className="text-gray-600">
                                            <span className="font-medium">
                                                Ubicación:
                                            </span>{' '}
                                            {agenda.location}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-medium text-[#004b9a]">
                                            Puntuación: {agenda.score}
                                        </p>
                                        <p className="text-gray-600">
                                            <span className="font-medium">
                                                Comentarios:
                                            </span>{' '}
                                            {agenda.comments}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Línea de tiempo */}
                <div className="p-6 bg-white rounded-xl border border-[#004b9a]/20">
                    <h2 className="text-xl font-semibold text-[#004b9a] mb-4 flex items-center gap-2">
                        <Clock className="text-[#004b9a]" />
                        Cronología del Proceso
                    </h2>
                    <div className="space-y-4">
                        {result.process_details.timeline.map((event, index) => (
                            <div key={index} className="flex items-start gap-4">
                                <div className="flex flex-col items-center pt-1">
                                    <div
                                        className={`w-3 h-3 rounded-full ${
                                            event.status === 'Completada'
                                                ? 'bg-[#004b9a]'
                                                : 'bg-gray-300'
                                        }`}
                                    />
                                    {index <
                                        result.process_details.timeline.length -
                                            1 && (
                                        <div className="w-px h-8 bg-gray-300" />
                                    )}
                                </div>
                                <div className="flex-1 pb-4 border-b border-[#004b9a]/10">
                                    <p className="font-medium text-[#004b9a]">
                                        {event.event}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {event.date}
                                    </p>
                                    {event.details && (
                                        <p className="mt-1 text-sm text-gray-500">
                                            {event.details}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-wrap gap-4 mt-8">
                    {(result.candidate.status_application?.name ===
                        'Aceptado' ||
                        result.candidate.status_application?.name ===
                            'En Progreso') && (
                        <button
                            onClick={openDeleteConfirmation}
                            className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700">
                            <XCircle size={18} />
                            Rechazar Candidato
                        </button>
                    )}

                    {result.candidate.status_application?.name !==
                        'Contratado' &&
                        result.candidate.status_application?.name !==
                            'Rechazado' && (
                            <button
                                onClick={openModal}
                                className="flex items-center gap-2 px-4 py-2 text-white bg-[#004b9a] rounded-lg hover:bg-[#003a7a] transition-colors">
                                <CheckCircle2 size={18} />
                                Contratar Candidato
                            </button>
                        )}
                </div>

                {/* Modals (mantener misma estructura pero actualizar estilos) */}
                {showDeleteModal && (
                    <Modal isOpen={showDeleteModal} onClose={cancelDelete}>
                        <div className="p-6 bg-white rounded-lg w-[500px] max-w-full">
                            <h3 className="mb-4 text-xl font-semibold text-[#004b9a]">
                                Confirmar Rechazo
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
                    </Modal>
                )}
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <div className="bg-white rounded-lg  max-h-[80vh] overflow-auto scrollbar-none">
                    <h2 className="text-xl font-semibold text-[#004b9a] mb-4">
                        <CheckCircle2 className="inline mr-2" />
                        Contratar Candidato
                    </h2>
                    <HireEmployeeForm
                        candidateId={id}
                        onSuccess={handleHireSuccess}
                    />
                </div>
            </Modal>
        </div>
    )
}

export default ResultDetails
