'use client'

const LanguageData = ({
    formData,
    handleDocumentChange,
    removeDocument,
    addDocument,
}) => {
    return (
        <>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Idiomas
            </h3>

            {formData.documents.languages.map((language, index) => (
                <div
                    key={index}
                    className="p-4 mb-6 space-y-4 border rounded-lg">
                    {/* Campo para el idioma */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Idioma *
                        </label>
                        <input
                            type="text"
                            value={language.name || ''}
                            onChange={e =>
                                handleDocumentChange(
                                    'languages',
                                    index,
                                    'name',
                                    e.target.value,
                                )
                            }
                            required
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Ej: Inglés"
                        />
                    </div>

                    {/* Campo para el nivel de dominio (texto) */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Nivel de dominio *
                        </label>
                        <input
                            type="text"
                            value={language.detail?.level || ''}
                            onChange={e =>
                                handleDocumentChange(
                                    'languages',
                                    index,
                                    'detail',
                                    {
                                        level: e.target.value,
                                    },
                                )
                            }
                            required
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Ej: Avanzado, Intermedio, Nativo, etc."
                        />
                    </div>

                    {/* Botón para eliminar idioma */}
                    {formData.documents.languages.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeDocument('languages', index)}
                            className="px-4 py-2 mt-2 text-sm text-red-600 bg-red-100 rounded-lg hover:bg-red-200">
                            Eliminar Idioma
                        </button>
                    )}
                </div>
            ))}

            {/* Botón para agregar idioma */}
            {formData.documents.languages.length < 3 && (
                <button
                    type="button"
                    onClick={() => addDocument('languages')}
                    className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                    Agregar Idioma
                </button>
            )}
        </>
    )
}

export default LanguageData
