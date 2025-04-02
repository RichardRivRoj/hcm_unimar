'use client'

import { useRouter } from 'next/navigation'
import {
    ClockIcon,
    UserCircleIcon,
    BookOpenIcon,
    IdentificationIcon,
    EnvelopeIcon,
    PhoneIcon,
    DocumentArrowDownIcon,
} from '@heroicons/react/24/outline'
import useDeparmentEnrollments from '@/hooks/supervisor/useDepartmentEnrollments'
import { ArrowLeft, CheckCircleIcon } from 'lucide-react'
import Button from '@/components/Button'
import { PDFDownloadLink } from '@react-pdf/renderer'
import CertificatePDF from '@/components/CertificatePDF'
import { GeneralModal } from '@/components/Modal'
import CalificationForm from '@/components/UpdateProgramForm'
import { useState } from 'react'
import { getAssignedByText } from '@/utils/helpers'
import StandardLoader from '@/components/StandardLoader'

const DepartmentEnrollmentDetailPage = ({ params }) => {
    const { id } = params
    const { data, loading, error, updateEnrollment } = useDeparmentEnrollments(id)
    const [showModal, setShowModal] = useState(false)

    const router = useRouter()

    const handleSuccess = () => {
        setShowModal(false)
        router.refresh() // Recargar datos actualizados
    }

    if (loading) return <StandardLoader />
    if (error) return <div className="p-8 text-red-600">Error: {error}</div>

    return (
        <div className="min-h-screen p-8 bg-gray-50">
            <header className="mb-8">
                <div className="flex items-center justify-between gap-4 mb-4">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-[#004b9a] hover:text-[#003a7a]">
                        <ArrowLeft size={20} className="mr-2" />
                        Volver
                    </button>

                    <div className="flex justify-end gap-4 mt-6">
                        {/* Botón para registrar calificaciones */}
                        {new Date(data.program.schedule.end) < new Date() &&
                            data.enrollment.status === 'Inscrito' && (
                                <Button
                                    onClick={() => setShowModal(true)}
                                    variant="default"
                                    className="bg-[#004b9a] hover:bg-[#003a7a] gap-2">
                                    <CheckCircleIcon className="w-5 h-5" />
                                    Registrar Calificaciones
                                </Button>
                            )}

                        {/* Botón para descargar certificado */}
                        {data.enrollment.status === 'Completado' && (
                            <PDFDownloadLink
                                document={
                                    <CertificatePDF
                                        employee={data.employee}
                                        program={data.program}
                                        enrollment={data.enrollment}
                                    />
                                }
                                fileName={`certificado-${data.employee.full_name}.pdf`}>
                                {({ loading }) => (
                                    <Button
                                        disabled={loading}
                                        variant="success"
                                        className="gap-2 bg-green-600 hover:bg-green-700">
                                        <DocumentArrowDownIcon className="w-5 h-5" />
                                        {loading
                                            ? 'Generando...'
                                            : 'Descargar Certificado'}
                                    </Button>
                                )}
                            </PDFDownloadLink>
                        )}
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-[#004b9a]">
                    <BookOpenIcon className="inline-block w-8 h-8 mr-2" />
                    Detalle de Inscripción
                </h1>
            </header>

            <GeneralModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Registro de Calificaciones"
                size="lg"
                actions={
                    <>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setShowModal(false)}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            form="calification-form"
                            className="bg-[#004b9a] hover:bg-[#003a7a]">
                            Guardar Calificaciones
                        </Button>
                    </>
                }>
                <CalificationForm
                    enrollment={data.enrollment}
                    onSuccess={handleSuccess}
                    updateEnrollment={updateEnrollment}
                />
            </GeneralModal>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Sección Empleado */}
                <DataCard
                    title="Información del Empleado"
                    icon={UserCircleIcon}>
                    <div className="space-y-4">
                        <InfoItem
                            label="Nombre Completo"
                            value={data.employee.full_name}
                        />
                        <InfoItem
                            label="Identificación"
                            value={`${data.employee.identification.code} - ${data.employee.identification.number}`}
                            icon={IdentificationIcon}
                        />

                        <div className="mt-4 space-y-2">
                            <InfoItem
                                label="Email Corporativo"
                                value={data.employee.contact.corporate_email}
                                icon={EnvelopeIcon}
                                link={`mailto:${data.employee.contact.corporate_email}`}
                            />
                            <InfoItem
                                label="Teléfono"
                                value={data.employee.contact.phone}
                                icon={PhoneIcon}
                                link={`tel:${data.employee.contact.phone}`}
                            />
                        </div>
                    </div>
                </DataCard>

                {/* Sección Programa */}
                <DataCard
                    title="Programa de Capacitación"
                    icon={BookOpenIcon}
                    className="lg:col-span-2">
                    <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-blue-50">
                            <h2 className="text-xl font-bold text-[#004b9a] mb-2">
                                {data?.program?.name}
                            </h2>
                            <p className="text-gray-600">
                                {data?.program?.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <InfoItem
                                label="Modalidad"
                                value={data?.program?.modality}
                                className="p-4 bg-white rounded-lg shadow-sm"
                            />
                            <InfoItem
                                label="Tipo"
                                value={data?.program?.type}
                                className="p-4 bg-white rounded-lg shadow-sm"
                            />
                        </div>

                        <div className="p-4 rounded-lg bg-blue-50">
                            <h3 className="text-sm font-semibold text-[#004b9a] mb-2">
                                Calendario
                            </h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <InfoItem
                                    label="Fecha de Inicio"
                                    value={new Date(
                                        data?.program?.schedule?.start,
                                    ).toLocaleDateString('es-ES', {
                                        timeZone: 'UTC',
                                    })}
                                />
                                <InfoItem
                                    label="Fecha de Fin"
                                    value={new Date(
                                        data?.program?.schedule?.end,
                                    ).toLocaleDateString('es-ES', {
                                        timeZone: 'UTC',
                                    })}
                                />
                                <InfoItem
                                    label="Duración"
                                    value={data?.program?.schedule?.duration}
                                />
                            </div>
                        </div>
                    </div>
                </DataCard>

                {/* Sección Inscripción */}
                <DataCard title="Detalles de Inscripción" icon={ClockIcon}>
                    <div className="space-y-4">
                        <InfoItem
                            label="Fecha de Inscripción"
                            value={new Date(
                                data.enrollment.enrollment_date,
                            ).toLocaleDateString('es-ES', { timeZone: 'UTC' })}
                        />
                        <StatusBadge status={data.enrollment.status} />
                        <InfoItem
                            label="Asignado por"
                            value={getAssignedByText(data.enrollment.assigned_by)}
                        />

                        <div className="mt-4 space-y-2">
                            <InfoItem
                                label="Puntaje"
                                value={data.enrollment.score || 'Pendiente'}
                            />
                            <InfoItem
                                label="Asistencia"
                                value={
                                    data.enrollment.attendance_rate
                                        ? `${data.enrollment.attendance_rate}%`
                                        : 'Pendiente'
                                }
                            />
                        </div>
                    </div>
                </DataCard>
            </div>
        </div>
    )
}

// Componentes auxiliares
const DataCard = ({ title, icon: Icon, children, className }) => (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
        <div className="flex items-center pb-2 mb-4 border-b">
            <Icon className="h-6 w-6 text-[#004b9a] mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>
        {children}
    </div>
)

const InfoItem = ({ label, value, icon: Icon, link }) => (
    <div className="space-y-1">
        <div className="flex items-center text-sm text-gray-500">
            {Icon && <Icon className="w-4 h-4 mr-1" />}
            {label}
        </div>
        <div
            className={`font-medium ${link ? 'text-[#004b9a] hover:underline' : 'text-gray-900'}`}>
            {link ? <a href={link}>{value}</a> : value}
        </div>
    </div>
)

const StatusBadge = ({ status }) => {
    const statusColors = {
        Inscrito: 'bg-blue-100 text-blue-800',
        Activo: 'bg-green-100 text-green-800',
        Completado: 'bg-purple-100 text-purple-800',
    }

    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[status] || 'bg-gray-100'}`}>
            {status}
        </span>
    )
}

export default DepartmentEnrollmentDetailPage