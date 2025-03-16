'use client'

import DetailCard from '@/components/DetailCard'
import { CheckIcon } from 'lucide-react'

const JobDetailContent = ({ vacancy, handleBack, onClick }) => {
    return (
        <div className="max-w-4xl p-10 mx-auto my-8 text-justify bg-white shadow-lg rounded-xl">
            <div className="p-4 space-y-8">
                {/* Header con botones */}
                <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
                    <button
                        onClick={handleBack}
                        className="flex items-center text-gray-600 hover:text-blue-800 group w-fit">
                        <span className="mr-2 text-2xl transition-transform group-hover:-translate-x-1">
                            ←
                        </span>
                        <span className="font-medium">Volver</span>
                    </button>

                    <button 
                    onClick={onClick}
                    className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
                        Postularse
                    </button>
                </div>

                {/* Detalles principales */}
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {vacancy.position?.description}
                        {' - '}
                        {vacancy.department?.name}
                    </h1>
                    <p className="text-base text-gray-600">
                        {vacancy.description}
                    </p>
                </div>

                {/* Cards con información */}
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

                {/* Requisitos */}
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

                {/* Responsabilidades */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Responsabilidades principales
                    </h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {vacancy.responsability?.length > 0 ? (
                            vacancy.responsability.map((req, index) => (
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
                                No se han definido responsabilidades específicas
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JobDetailContent
