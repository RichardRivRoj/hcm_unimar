'use client'

import { toast } from 'sonner'

const StudyData = ({
    formData,
    handleDocumentChange,
    removeDocument,
    addDocument,
}) => {
    return (
        <>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Formación Académica (Máximo 2 estudios)
            </h3>

            {formData.documents.studies.map((study, index) => (
                <div
                    key={index}
                    className="p-4 mb-6 space-y-4 border rounded-lg">
                    {/* Nombre del estudio */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Título del estudio *
                        </label>
                        <input
                            type="text"
                            value={study.name || ''}
                            onChange={e =>
                                handleDocumentChange(
                                    'studies',
                                    index,
                                    'name',
                                    e.target.value,
                                )
                            }
                            required
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Ej: Ingeniería en Sistemas"
                        />
                    </div>

                    {/* Fechas importantes */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Fecha de inicio *
                            </label>
                            <input
                                type="date"
                                value={study.issue_date || ''}
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
                                        'studies',
                                        index,
                                        'issue_date',
                                        selectedDate,
                                    )

                                    // Resetear fecha final si es menor
                                    if (
                                        study.expiration_date &&
                                        selectedDate > study.expiration_date
                                    ) {
                                        handleDocumentChange(
                                            'studies',
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
                                Fecha de graduación
                            </label>
                            <input
                                type="date"
                                value={study.expiration_date || ''}
                                min={
                                    study.issue_date ||
                                    new Date().toISOString().split('T')[0]
                                } // Mínimo fecha de inicio
                                onChange={e => {
                                    const selectedDate = e.target.value

                                    // Validar fecha mínima
                                    if (
                                        study.issue_date &&
                                        selectedDate < study.issue_date
                                    ) {
                                        toast.error(
                                            'La fecha final no puede ser anterior a la de inicio',
                                        )
                                        return
                                    }

                                    handleDocumentChange(
                                        'studies',
                                        index,
                                        'expiration_date',
                                        selectedDate,
                                    )
                                }}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                            {study.expiration_date &&
                                study.issue_date &&
                                study.expiration_date < study.issue_date && (
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
                                Institución educativa *
                            </label>
                            <input
                                type="text"
                                value={study.metadata?.institution || ''}
                                onChange={e =>
                                    handleDocumentChange(
                                        'studies',
                                        index,
                                        'metadata',
                                        {
                                            ...study.metadata,
                                            institution: e.target.value,
                                        },
                                    )
                                }
                                required
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: Universidad Nacional"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Grado obtenido *
                            </label>

                            <input
                                type="text"
                                value={study.metadata?.degree || ''}
                                onChange={e =>
                                    handleDocumentChange(
                                        'studies',
                                        index,
                                        'metadata',
                                        {
                                            ...study.metadata,
                                            degree: e.target.value,
                                        },
                                    )
                                }
                                required
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: Universidad Nacional"
                            />
                        </div>
                    </div>

                    {/* Botón para eliminar estudio */}
                    {formData.documents.studies.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeDocument('studies', index)}
                            className="px-4 py-2 mt-2 text-sm text-red-600 bg-red-100 rounded-lg hover:bg-red-200">
                            Eliminar Estudio
                        </button>
                    )}
                </div>
            ))}

            {/* Botón para agregar estudio */}
            {formData.documents.studies.length < 2 && (
                <button
                    type="button"
                    onClick={() => addDocument('studies')}
                    className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                    Agregar Estudio
                </button>
            )}
        </>
    )
}

export default StudyData
