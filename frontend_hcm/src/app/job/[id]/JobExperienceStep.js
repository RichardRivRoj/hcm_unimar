'use client'

import { toast } from 'sonner'

const JobExperienceStep = ({
    formData,
    handleDocumentChange,
    removeDocument,
    addDocument,
}) => {
    return (
        <>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Experiencia Laboral (Máximo 2 empleos)
            </h3>

            {formData.documents.jobs.map((job, index) => (
                <div
                    key={index}
                    className="p-4 mb-6 space-y-4 border rounded-lg">
                    {/* Nombre del empleo */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Nombre del empleo *
                        </label>
                        <input
                            type="text"
                            value={job.name || ''}
                            onChange={e =>
                                handleDocumentChange(
                                    'jobs',
                                    index,
                                    'name',
                                    e.target.value,
                                )
                            }
                            required
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Ej: Experiencia como Desarrollador Frontend en Google"
                        />
                    </div>

                    {/* Fechas */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Fecha de inicio *
                            </label>
                            <input
                                type="date"
                                value={job.issue_date || ''}
                                max={new Date().toISOString().split('T')[0]} // Máximo fecha actual
                                onChange={e => {
                                    const selectedDate = e.target.value
                                    const today = new Date()
                                        .toISOString()
                                        .split('T')[0]

                                    // Validar fecha máxima
                                    if (selectedDate > today) {
                                        toast.error(
                                            'La fecha de inicio no puede ser futura',
                                        )
                                        return
                                    }

                                    handleDocumentChange(
                                        'jobs',
                                        index,
                                        'issue_date',
                                        selectedDate,
                                    )

                                    // Resetear fecha final si es menor
                                    if (
                                        job.expiration_date &&
                                        selectedDate > job.expiration_date
                                    ) {
                                        handleDocumentChange(
                                            'jobs',
                                            index,
                                            'expiration_date',
                                            '',
                                        )
                                    }
                                }}
                                required
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Fecha de finalización
                            </label>
                            <input
                                type="date"
                                value={job.expiration_date || ''}
                                min={
                                    job.issue_date ||
                                    new Date().toISOString().split('T')[0]
                                } // Mínimo fecha de inicio
                                onChange={e => {
                                    const selectedDate = e.target.value

                                    // Validar fecha mínima
                                    if (
                                        job.issue_date &&
                                        selectedDate < job.issue_date
                                    ) {
                                        toast.error(
                                            'La fecha final no puede ser anterior a la de inicio',
                                        )
                                        return
                                    }

                                    handleDocumentChange(
                                        'jobs',
                                        index,
                                        'expiration_date',
                                        selectedDate,
                                    )
                                }}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                            {job.expiration_date &&
                                job.issue_date &&
                                job.expiration_date < job.issue_date && (
                                    <p className="mt-1 text-xs text-red-600">
                                        Fecha inválida
                                    </p>
                                )}
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-4">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Empresa *
                            </label>
                            <input
                                type="text"
                                value={job.metadata?.company_name || ''}
                                onChange={e =>
                                    handleDocumentChange(
                                        'jobs',
                                        index,
                                        'metadata',
                                        {
                                            ...job.metadata,
                                            company_name: e.target.value,
                                        },
                                    )
                                }
                                required
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Posición/Cargo *
                            </label>
                            <input
                                type="text"
                                value={job.metadata?.position || ''}
                                onChange={e =>
                                    handleDocumentChange(
                                        'jobs',
                                        index,
                                        'metadata',
                                        {
                                            ...job.metadata,
                                            position: e.target.value,
                                        },
                                    )
                                }
                                required
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Responsabilidades */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Responsabilidades (Una por línea) *
                        </label>
                        <textarea
                            value={job.metadata?.responsibilities || ''}
                            onChange={e =>
                                handleDocumentChange(
                                    'jobs',
                                    index,
                                    'metadata',
                                    {
                                        ...job.metadata,
                                        responsibilities: e.target.value,
                                    },
                                )
                            }
                            required
                            className="w-full h-24 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Ej: - Desarrollo de componentes React..."
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Escribe cada responsabilidad en una línea separada
                        </p>
                    </div>

                    {/* Botón eliminar */}
                    {formData.documents.jobs.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeDocument('jobs', index)}
                            className="px-4 py-2 mt-2 text-sm text-red-600 bg-red-100 rounded-lg hover:bg-red-200">
                            Eliminar Empleo
                        </button>
                    )}
                </div>
            ))}

            {/* Botón agregar */}
            {formData.documents.jobs.length < 2 && (
                <button
                    type="button"
                    onClick={() => addDocument('jobs')}
                    className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                    Agregar Empleo
                </button>
            )}
        </>
    )
}

export default JobExperienceStep
