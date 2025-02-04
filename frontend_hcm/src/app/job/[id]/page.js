'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DetailCard from '@/components/DetailCard'
import useVacancyDetail from '@/hooks/useVacancyDetail'
import CheckIcon from '@/components/CheckIcon'

const JobDetails = ({ params }) => {
    const router = useRouter()
    const { id } = params
    const { vacancy, loading, error } = useVacancyDetail(id)
    const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false)

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

    if (error) return <div>Error: {error}</div>

    return (
        <>
            <div className="max-w-4xl p-10 mx-auto text-justify bg-white shadow-lg rounded-xl">
                <div className="p-4 space-y-8">
                    <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center text-gray-600 hover:text-blue-800 group w-fit">
                            <span className="mr-2 text-2xl transition-transform group-hover:-translate-x-1">
                                ←
                            </span>
                            <span className="font-medium">Volver</span>
                        </button>

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <button
                                onClick={() => setIsApplicationModalOpen(true)}
                                className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
                                Postularse
                            </button>
                        </div>
                    </div>

                    {/* Encabezado y detalles de la vacante */}
                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {vacancy.title}
                        </h1>
                        <p className="text-base text-gray-600">
                            {vacancy.description}
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                        <DetailCard
                            title="Cargo"
                            value={vacancy.position?.description}
                        />
                        <DetailCard
                            title="Departamento"
                            value={vacancy.department?.name}
                        />
                        <DetailCard title="Modalidad" value={vacancy.mode?.name} />
                        <DetailCard title="Vacantes" value={vacancy.num_vacancy} />
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Requisitos principales
                        </h2>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {vacancy.requirements?.length > 0 ? (
                                vacancy.requirements.map((req, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start p-4 rounded-lg bg-gray-50">
                                        <CheckIcon />
                                        <span className="ml-3 text-gray-700">
                                            {req}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-gray-500 rounded-lg bg-gray-50">
                                    No se han definido requisitos específicos
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de postulación */}
            {isApplicationModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-md p-6 bg-white rounded-lg">
                        <h2 className="mb-4 text-xl font-semibold">
                            Postularse a: {vacancy.title}
                        </h2>

                        <form className="space-y-4">
                            {/* Campo Nombre */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Nombre completo *
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Campo Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Correo electrónico *
                                </label>
                                <input
                                    type="email"
                                    required
                                    className="w-full p-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Campo Teléfono */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Teléfono *
                                </label>
                                <input
                                    type="tel"
                                    required
                                    className="w-full p-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Botones de acción */}
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsApplicationModalOpen(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                                    Enviar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default JobDetails;
