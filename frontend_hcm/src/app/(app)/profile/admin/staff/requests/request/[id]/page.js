'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminRequests } from '@/hooks/admin/useAdminRequests'
import {
    CheckCircle2,
    DownloadIcon,
    FileIcon,
    FileTextIcon,
    Loader,
    UserIcon,
    XCircle,
    XCircleIcon,
} from 'lucide-react'
import InfoItem from '@/components/InfoItem'
import { toast } from 'sonner'
import axios from '@/lib/axios'
import ConstanciaLaborPDF from '@/components/ConstanciaLabor'
import { PDFDownloadLink } from '@react-pdf/renderer'


const AdminRequestDetails = ({ params }) => {
    const router = useRouter()
    const { id } = params
    const { singleData, singleLoading, singleError, fetchSingleRequest } =
        useAdminRequests()

    const [updatingStatus, setUpdatingStatus] = useState(false)

    const handleStatusUpdate = async newStatus => {
        if (!id || updatingStatus) return

        try {
            setUpdatingStatus(true)

            const response = await axios.put(`/api/admin/requests/${id}`, {
                status: newStatus,
            })

            if (response.data.success) {
                await fetchSingleRequest(id)
                toast.success(`Estado actualizado a ${newStatus}`, {
                    description: 'La notificación se envió al empleado',
                })
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error
                ? `${error.response.data.error}: ${error.response.data.message}`
                : 'Error de conexión'

            toast.error('Acción no completada', {
                description: errorMessage,
            })
        } finally {
            setUpdatingStatus(false)
        }
    }

    useEffect(() => {
        if (id) fetchSingleRequest(id)
    }, [id])

    // Manejar estados de carga y error
    if (singleLoading)
        return (
            <div className="flex justify-center p-8">
                <Loader className="w-full animate-spin" />
            </div>
        )

    if (singleError)
        return (
            <div className="p-4 text-red-600 bg-red-100 rounded-lg">
                Error: {singleError.message}
            </div>
        )

    if (!singleData) return null // Prevenir acceso a propiedades de undefined

    return (
        <div className="max-w-4xl p-8 mx-auto text-justify bg-white shadow-sm rounded-xl">
            <div className="p-2 bg-white">
                {/* Header y controles */}
                <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-gray-600 hover:text-blue-800 group w-fit">
                        <span className="mr-2 text-2xl transition-transform group-hover:-translate-x-1">
                            ←
                        </span>
                        <span className="font-medium">
                            Volver a solicitudes
                        </span>
                    </button>

                    {/* Título y estado */}
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold text-gray-800">
                            {singleData.solicitud?.tipo}
                        </h1>
                        <span
                            className={`px-3 py-1 text-sm rounded-full ${
                                singleData.solicitud?.estado === 'Aprobado'
                                    ? 'bg-green-100 text-green-800'
                                    : singleData.solicitud?.estado ===
                                        'Pendiente'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-red-100 text-red-800'
                            }`}>
                            {singleData.solicitud?.estado}
                        </span>
                    </div>
                </div>

                {/* Sección de Información Personal */}
                <section className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <UserIcon className="w-6 h-6 text-blue-600" />
                        <h2 className="text-xl font-semibold text-gray-800">
                            Información Personal
                        </h2>
                    </div>

                    <div className="grid gap-4 p-4 rounded-lg bg-gray-50 md:grid-cols-2">
                        <InfoItem
                            label="Nombre Completo"
                            value={singleData.personal_info.nombre_completo}
                        />
                        <InfoItem
                            label="Identificación"
                            value={`${singleData.personal_info.identificacion.tipo} - ${singleData.personal_info.identificacion.numero}`}
                        />
                        <InfoItem
                            label="Correo Electrónico"
                            value={
                                <div className="space-y-1">
                                    <p>
                                        {
                                            singleData.personal_info.correos
                                                .personal
                                        }
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {
                                            singleData.personal_info.correos
                                                .institucional
                                        }
                                    </p>
                                </div>
                            }
                        />
                        <InfoItem
                            label="Estado"
                            value={
                                <span className="font-medium text-green-700">
                                    {singleData.personal_info.estado_persona}
                                </span>
                            }
                        />
                    </div>
                </section>

                {/* Detalles de la Solicitud */}
                <section className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <FileTextIcon className="w-6 h-6 text-blue-600" />
                        <h2 className="text-xl font-semibold text-gray-800">
                            Detalles de la Solicitud
                        </h2>
                    </div>

                    <div className="p-4 rounded-lg bg-gray-50">
                        <div className="grid gap-4 md:grid-cols-2">
                            <InfoItem
                                label="Tipo de Solicitud"
                                value={singleData.solicitud.tipo}
                            />
                            <InfoItem
                                label="Estado Actual"
                                value={singleData.solicitud.estado}
                            />
                        </div>

                        <div className="mt-4">
                            <h3 className="mb-2 font-medium text-gray-700">
                                Descripción:
                            </h3>
                            <div className="p-3 prose bg-white rounded-md">
                                {
                                    JSON.parse(singleData.solicitud.descripcion)
                                        .content
                                }
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contratos Relacionados */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <FileIcon className="w-6 h-6 text-blue-600" />
                        <h2 className="text-xl font-semibold text-gray-800">
                            Contratos Relacionados
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {singleData.contratos.map((contrato, index) => (
                            <div
                                key={index}
                                className="p-4 rounded-lg bg-gray-50">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <InfoItem
                                        label="Número de Contrato"
                                        value={contrato.numero_contrato}
                                    />
                                    <InfoItem
                                        label="Tipo de Contrato"
                                        value={contrato.tipo_contrato}
                                    />
                                    <InfoItem
                                        label="Departamento"
                                        value={contrato.departamento}
                                    />
                                    <InfoItem
                                        label="Posición"
                                        value={
                                            <div className="space-y-1">
                                                <p className="font-medium">
                                                    {contrato.posicion.nombre}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Nivel{' '}
                                                    {contrato.posicion.nivel}
                                                </p>
                                            </div>
                                        }
                                    />
                                    <InfoItem
                                        label="Salario"
                                        value={
                                            <div>
                                                <p className="font-medium">
                                                    {
                                                        contrato.posicion
                                                            .salario?.monto
                                                    }
                                                    <span className="ml-1 text-gray-600">
                                                        {contrato.posicion
                                                            .salario?.moneda ||
                                                            'N/A'}
                                                    </span>
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Vigente desde:{' '}
                                                    {
                                                        contrato.posicion
                                                            .salario
                                                            ?.vigente_desde
                                                    }
                                                </p>
                                            </div>
                                        }
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
            {/* Botones de aprobación/rechazo */}
            <div className="flex items-center justify-between mt-8">
                <div className="flex gap-4">
                    <button
                        onClick={() => handleStatusUpdate('Aprobado')}
                        disabled={
                            updatingStatus ||
                            singleData.solicitud.estado !== 'Pendiente'
                        }
                        className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
                        <CheckCircle2 className="w-5 h-5" />
                        {updatingStatus ? 'Procesando...' : 'Aprobar Solicitud'}
                    </button>

                    <button
                        onClick={() => handleStatusUpdate('Rechazado')}
                        disabled={
                            updatingStatus ||
                            singleData.solicitud.estado !== 'Pendiente'
                        }
                        className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-alloved">
                        <XCircle className="w-5 h-5" />
                        {updatingStatus
                            ? 'Procesando...'
                            : 'Rechazar Solicitud'}
                    </button>
                </div>

                {/* Botón de descarga (solo para aprobados) */}
                {singleData.solicitud.estado === 'Aprobado' && (
                    <PDFDownloadLink
                        document={<ConstanciaLaborPDF data={singleData} />}
                        fileName="constancia_laboral.pdf"
                        className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                        {({ loading }) => (
                            <>
                                <DownloadIcon className="w-5 h-5" />
                                {loading
                                    ? 'Generando PDF...'
                                    : 'Descargar Planilla'}
                            </>
                        )}
                    </PDFDownloadLink>
                )}
            </div>
        </div>
    )
}

export default AdminRequestDetails
