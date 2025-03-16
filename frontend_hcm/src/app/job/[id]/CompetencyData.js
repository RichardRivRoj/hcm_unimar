'use client'

const CompetencyData = ({
    formData,
    handleDocumentChange,
    removeDocument,
    addDocument,
}) => {
    return (
        <>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Competencias Técnicas
            </h3>

            {formData.documents.competencies.map((competency, index) => (
                <div
                    key={index}
                    className="p-4 mb-6 space-y-4 border rounded-lg">
                    {/* Nombre del documento de competencias */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Nombre la competencias *
                        </label>
                        <input
                            type="text"
                            value={competency.name || ''}
                            onChange={e =>
                                handleDocumentChange(
                                    'competencies',
                                    index,
                                    'name',
                                    e.target.value,
                                )
                            }
                            required
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Ej: Competencias en Habilidades Blandas"
                        />
                    </div>

                    {/* Lista de competencias */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Competencias (Una por línea) *
                        </label>
                        <textarea
                            value={competency.detail?.join('\n') || ''}
                            onChange={e =>
                                handleDocumentChange(
                                    'competencies',
                                    index,
                                    'detail',
                                    e.target.value.split('\n'),
                                )
                            }
                            required
                            className="w-full h-32 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Ej: Laravel
                                    React
                                    Gestión de proyectos
                                    SQL"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Lista cada competencia en una línea separada
                        </p>
                    </div>

                    {/* Botón para eliminar competencia */}
                    {formData.documents.competencies.length > 1 && (
                        <button
                            type="button"
                            onClick={() =>
                                removeDocument('competencies', index)
                            }
                            className="px-4 py-2 mt-2 text-sm text-red-600 bg-red-100 rounded-lg hover:bg-red-200">
                            Eliminar Competencia
                        </button>
                    )}
                </div>
            ))}

            {/* Botón para agregar competencia */}
            {formData.documents.competencies.length < 3 && (
                <button
                    type="button"
                    onClick={() => addDocument('competencies')}
                    className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                    Agregar Competencia
                </button>
            )}
        </>
    )
}

export default CompetencyData
