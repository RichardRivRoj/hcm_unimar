'use client'

import { toast } from 'sonner'

const CourseData = ({
    formData,
    handleDocumentChange,
    removeDocument,
    addDocument,
}) => {
    return (
        <>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Cursos Realizados (Máximo 2 cursos)
            </h3>

            {formData.documents.courses.map((course, index) => (
                <div
                    key={index}
                    className="p-4 mb-6 space-y-4 border rounded-lg">
                    {/* Nombre del curso */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Nombre del curso *
                        </label>
                        <input
                            type="text"
                            value={course.name || ''}
                            onChange={e =>
                                handleDocumentChange(
                                    'courses',
                                    index,
                                    'name',
                                    e.target.value,
                                )
                            }
                            required
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Ej: Curso de React Avanzado"
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
                                value={course.issue_date || ''}
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
                                        'courses',
                                        index,
                                        'issue_date',
                                        selectedDate,
                                    )

                                    // Resetear fecha final si es menor
                                    if (
                                        course.expiration_date &&
                                        selectedDate > course.expiration_date
                                    ) {
                                        handleDocumentChange(
                                            'courses',
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
                                value={course.expiration_date || ''}
                                min={
                                    course.issue_date ||
                                    new Date().toISOString().split('T')[0]
                                } // Mínimo fecha de inicio
                                onChange={e => {
                                    const selectedDate = e.target.value

                                    // Validar fecha mínima
                                    if (
                                        course.issue_date &&
                                        selectedDate < course.issue_date
                                    ) {
                                        toast.error(
                                            'La fecha final no puede ser anterior a la de inicio',
                                        )
                                        return
                                    }

                                    handleDocumentChange(
                                        'courses',
                                        index,
                                        'expiration_date',
                                        selectedDate,
                                    )
                                }}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                            {course.expiration_date &&
                                course.issue_date &&
                                course.expiration_date < course.issue_date && (
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
                                Horas del curso *
                            </label>
                            <input
                                type="number"
                                value={course.metadata?.hours || ''}
                                onChange={e =>
                                    handleDocumentChange(
                                        'courses',
                                        index,
                                        'metadata',
                                        {
                                            ...course.metadata,
                                            hours: e.target.value,
                                        },
                                    )
                                }
                                required
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: 40"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Instructor *
                            </label>
                            <input
                                type="text"
                                value={course.metadata?.instructor || ''}
                                onChange={e =>
                                    handleDocumentChange(
                                        'courses',
                                        index,
                                        'metadata',
                                        {
                                            ...course.metadata,
                                            instructor: e.target.value,
                                        },
                                    )
                                }
                                required
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: Juan Pérez"
                            />
                        </div>
                    </div>

                    {/* Botón para eliminar curso */}
                    {formData.documents.courses.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeDocument('courses', index)}
                            className="px-4 py-2 mt-2 text-sm text-red-600 bg-red-100 rounded-lg hover:bg-red-200">
                            Eliminar Curso
                        </button>
                    )}
                </div>
            ))}

            {/* Botón para agregar curso */}
            {formData.documents.courses.length < 2 && (
                <button
                    type="button"
                    onClick={() => addDocument('courses')}
                    className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                    Agregar Curso
                </button>
            )}
        </>
    )
}

export default CourseData
