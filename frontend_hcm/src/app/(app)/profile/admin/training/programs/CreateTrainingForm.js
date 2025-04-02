'use client'

import { useState, useEffect } from 'react'
import axios from '@/lib/axios'
import { useTrainingProgram } from '@/hooks/admin/useTrainingPrograms'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const CreateTrainingProgramForm = ({ onClose }) => {
    const router = useRouter()
    const { createProgram, loading, error, validationErrors } =
        useTrainingProgram()
    const [options, setOptions] = useState({
        departments: [],
        employees: [],
        trainingTypes: [],
        modalities: [],
    })

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        content: [],
        start_date: '',
        end_date: '',
        limit: '',
        visibility_id: 1,
        training_type_id: '',
        modality_id: '',
        departments: [],
        employees: [],
        status_id: 1, // Valor por defecto
    })

    // Carga inicial de opciones
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [depts, emps, types, mods] = await Promise.all([
                    axios.get('/api/general/list/departments'),
                    axios.get('/api/general/list/employees'),
                    axios.get('/api/general/list/training-types'),
                    axios.get('/api/general/list/modalities'),
                ])

                setOptions({
                    departments: depts.data,
                    employees: emps.data,
                    trainingTypes: types.data,
                    modalities: mods.data,
                })
            } catch (error) {
                toast.error('Error loading options:', error)
            }
        }
        fetchOptions()
    }, [])

    // Manejo de módulos del contenido programático
    const handleContentChange = (index, field, value) => {
        const newContent = [...formData.content]
        newContent[index][field] = value
        setFormData(prev => ({ ...prev, content: newContent }))
    }

    const addModule = () => {
        setFormData(prev => ({
            ...prev,
            content: [...prev.content, { module: '', topics: [''] }],
        }))
    }

    const addTopic = moduleIndex => {
        const newContent = [...formData.content]
        newContent[moduleIndex].topics.push('')
        setFormData(prev => ({ ...prev, content: newContent }))
    }

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            const payload = {
                ...formData,
                content: JSON.stringify(formData.content), // Convertir a JSON
                // Eliminar campos innecesarios según visibilidad
                departments:
                    formData.visibility_id === 3 ? formData.departments : [],
                employees:
                    formData.visibility_id === 2 ? formData.employees : [],
            }
            const response = await createProgram(payload)

            if (response.success) {
                toast.success('Programa creado', {
                    description: 'Las notificaciones se enviaron correctamente',
                    action: {
                        label: 'Ver programa',
                        onClick: () =>
                            router.push(`/training/${response.program.id}`),
                    },
                })
                onClose()
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || 'Error al crear el programa'

            toast.error('Acción fallida', {
                description: errorMessage,
                action: {
                    label: 'Reintentar',
                    onClick: () => handleSubmit(e),
                },
            })
        }
    }

    return (
        <div className="w-full space-y-4">
            <h2 className="text-2xl font-bold text-[#004b9a] mb-4">
                Nuevo Programa de Capacitación
            </h2>

            <div className="max-h-[70vh] overflow-y-auto pr-4 scrollbar-none">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Sección de Información Básica */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2 font-semibold">
                                Nombre del Programa*
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={e =>
                                    setFormData(prev => ({
                                        ...prev,
                                        name: e.target.value,
                                    }))
                                }
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#004b9a]"
                                required
                            />
                            {validationErrors.name && (
                                <span className="text-sm text-red-600">
                                    {validationErrors.name[0]}
                                </span>
                            )}
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold">
                                Límite de Participantes
                            </label>
                            <input
                                type="number"
                                name="limit"
                                value={formData.limit}
                                onChange={e =>
                                    setFormData(prev => ({
                                        ...prev,
                                        limit: e.target.value,
                                    }))
                                }
                                className="w-full p-2 border rounded"
                                min="1"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold">
                            Descripción del Programa
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={e =>
                                setFormData(prev => ({
                                    ...prev,
                                    description: e.target.value,
                                }))
                            }
                            className="w-full h-32 p-2 border rounded"
                            placeholder="Describa los objetivos y alcance del programa..."
                        />
                        {validationErrors.description && (
                            <span className="text-sm text-red-600">
                                {validationErrors.description[0]}
                            </span>
                        )}
                    </div>

                    {/* Selectores Principales */}
                    <div className="grid grid-cols-3 gap-6">
                        <div>
                            <label className="block mb-2 font-semibold">
                                Tipo de Capacitación*
                            </label>
                            <select
                                name="training_type_id"
                                value={formData.training_type_id}
                                onChange={e =>
                                    setFormData(prev => ({
                                        ...prev,
                                        training_type_id: e.target.value,
                                    }))
                                }
                                className="w-full p-2 bg-white border rounded"
                                required>
                                <option value="">Seleccionar...</option>
                                {options.trainingTypes.map(type => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold">
                                Modalidad*
                            </label>
                            <select
                                name="modality_id"
                                value={formData.modality_id}
                                onChange={e =>
                                    setFormData(prev => ({
                                        ...prev,
                                        modality_id: e.target.value,
                                    }))
                                }
                                className="w-full p-2 bg-white border rounded"
                                required>
                                <option value="">Seleccionar...</option>
                                {options.modalities.map(mod => (
                                    <option key={mod.id} value={mod.id}>
                                        {mod.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold">
                                Visibilidad*
                            </label>
                            <select
                                name="visibility_id"
                                value={formData.visibility_id}
                                onChange={e =>
                                    setFormData(prev => ({
                                        ...prev,
                                        visibility_id: parseInt(e.target.value),
                                        department_id: null,
                                        employees: [],
                                    }))
                                }
                                className="w-full p-2 bg-white border rounded"
                                required>
                                <option value={1}>Público</option>
                                <option value={2}>Privado</option>
                                <option value={3}>Departamental</option>
                            </select>
                        </div>
                    </div>

                    {/* Campos Condicionales */}
                    {formData.visibility_id === 3 && (
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="font-semibold">
                                    Departamentos Seleccionados*
                                </label>
                                <span className="text-sm text-[#004b9a]">
                                    {formData.departments.length} departamentos
                                    seleccionados
                                </span>
                            </div>
                            <div className="border rounded">
                                <div className="h-48 overflow-y-auto">
                                    {options.departments.map(dept => (
                                        <label
                                            key={dept.id}
                                            className="flex items-center p-2 hover:bg-gray-50">
                                            <input
                                                type="checkbox"
                                                value={dept.id}
                                                checked={formData.departments.includes(
                                                    dept.id,
                                                )}
                                                onChange={e => {
                                                    const newDepartments = e
                                                        .target.checked
                                                        ? [
                                                              ...formData.departments,
                                                              dept.id,
                                                          ]
                                                        : formData.departments.filter(
                                                              id =>
                                                                  id !==
                                                                  dept.id,
                                                          )
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        departments:
                                                            newDepartments,
                                                    }))
                                                }}
                                                className="mr-2"
                                            />
                                            <span>
                                                {dept.description} (
                                                {dept.active_employees_count}{' '}
                                                empleados)
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {formData.visibility_id === 2 && (
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="font-semibold">
                                    Empleados Seleccionados*
                                </label>
                                <span className="text-sm text-[#004b9a]">
                                    {formData.employees.length} seleccionados
                                </span>
                            </div>
                            <div className="border rounded">
                                <div className="h-48 overflow-y-auto">
                                    {options.employees.map(emp => (
                                        <label
                                            key={emp.id}
                                            className="flex items-center p-2 hover:bg-gray-50">
                                            <input
                                                type="checkbox"
                                                value={emp.id}
                                                checked={formData.employees.includes(
                                                    emp.id,
                                                )}
                                                onChange={e => {
                                                    const newEmployees = e
                                                        .target.checked
                                                        ? [
                                                              ...formData.employees,
                                                              emp.id,
                                                          ]
                                                        : formData.employees.filter(
                                                              id =>
                                                                  id !== emp.id,
                                                          )
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        employees: newEmployees,
                                                    }))
                                                }}
                                                className="mr-2"
                                            />
                                            <span>
                                                {emp.full_name} -{' '}
                                                {emp.current_department}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Contenido Programático Estructurado */}
                    <div>
                        <label className="block mb-2 font-semibold">
                            Contenido Programático
                        </label>
                        {formData.content.map((module, index) => (
                            <div
                                key={index}
                                className="p-4 mb-4 border rounded">
                                <div className="flex gap-4 mb-3">
                                    <input
                                        type="text"
                                        placeholder={`Módulo ${index + 1}`}
                                        value={module.module}
                                        onChange={e =>
                                            handleContentChange(
                                                index,
                                                'module',
                                                e.target.value,
                                            )
                                        }
                                        className="w-1/2 p-2 border rounded"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => addTopic(index)}
                                        className="px-3 py-1 text-white bg-[#004b9a] rounded hover:bg-[#003a7a]">
                                        + Tema
                                    </button>
                                </div>
                                {module.topics.map((topic, topicIndex) => (
                                    <input
                                        key={topicIndex}
                                        type="text"
                                        placeholder={`Tema ${topicIndex + 1}`}
                                        value={topic}
                                        onChange={e => {
                                            const newTopics = [...module.topics]
                                            newTopics[topicIndex] =
                                                e.target.value
                                            handleContentChange(
                                                index,
                                                'topics',
                                                newTopics,
                                            )
                                        }}
                                        className="w-full p-2 mb-2 border rounded"
                                    />
                                ))}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addModule}
                            className="px-4 py-2 text-white bg-[#004b9a] rounded hover:bg-[#003a7a]">
                            + Agregar Módulo
                        </button>
                    </div>

                    {/* Fechas */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2 font-semibold">
                                Fecha de Inicio*
                            </label>
                            <input
                                type="date"
                                name="start_date"
                                value={formData.start_date}
                                onChange={e =>
                                    setFormData(prev => ({
                                        ...prev,
                                        start_date: e.target.value,
                                    }))
                                }
                                className="w-full p-2 border rounded"
                                min={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold">
                                Fecha de Finalización
                            </label>
                            <input
                                type="date"
                                name="end_date"
                                value={formData.end_date}
                                onChange={e =>
                                    setFormData(prev => ({
                                        ...prev,
                                        end_date: e.target.value,
                                    }))
                                }
                                className="w-full p-2 border rounded"
                                min={formData.start_date}
                            />
                        </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex justify-end gap-4 pt-6 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 text-white bg-[#004b9a] rounded hover:bg-[#003a7a] disabled:bg-gray-400">
                            {loading ? 'Creando...' : 'Crear Programa'}
                        </button>
                    </div>

                    {error && (
                        <div className="p-4 mt-4 text-red-700 bg-red-100 rounded">
                            {error}
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}

export default CreateTrainingProgramForm
