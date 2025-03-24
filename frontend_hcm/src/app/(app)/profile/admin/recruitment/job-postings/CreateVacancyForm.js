'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'

const CreateVacancyForm = ({
    departments,
    positions,
    modalities,
    onSubmit,
    onCancel,
    isSubmitting,
}) => {
    const [formState, setFormState] = useState({
        position_id: '',
        department_id: '',
        description: '',
        requirements: [],
        responsability: [],
        num_vacancy: 1,
        mode_id: '',
    })

    const [requirementInput, setRequirementInput] = useState('')
    const [responsibilityInput, setResponsibilityInput] = useState('')

    const handleAddRequirement = () => {
        if (requirementInput.trim()) {
            setFormState(prev => ({
                ...prev,
                requirements: [...prev.requirements, requirementInput.trim()],
            }))
            setRequirementInput('')
        }
    }

    const handleAddResponsibility = () => {
        if (responsibilityInput.trim()) {
            setFormState(prev => ({
                ...prev,
                responsability: [
                    ...prev.responsability,
                    responsibilityInput.trim(),
                ],
            }))
            setResponsibilityInput('')
        }
    }

    const removeItem = (type, index) => {
        setFormState(prev => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index),
        }))
    }

    const handleChange = e => {
        const { name, value } = e.target
        setFormState(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = e => {
        e.preventDefault()
        onSubmit(formState)
    }

    const isFormValid =
        formState.position_id &&
        formState.department_id &&
        formState.mode_id &&
        formState.num_vacancy > 0

    return (
        <div className="relative w-full mx-auto bg-white rounded-lg ">
            <div className="sticky top-0 z-10 p-2 bg-white border-b">
                <h2 className="text-2xl font-semibold text-[#004b9a]">
                    Nueva Vacante
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[60vh] scrollbar-none">
                {/* Campos principales en grid responsive */}
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                            Departamento *
                        </label>
                        <select
                            name="department_id"
                            value={formState.department_id}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#004b9a] focus:border-[#004b9a]"
                            required>
                            <option value="">Seleccionar...</option>
                            {departments.map(dept => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                            Posición *
                        </label>
                        <select
                            name="position_id"
                            value={formState.position_id}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#004b9a] focus:border-[#004b9a]"
                            required>
                            <option value="">Seleccionar...</option>
                            {positions.map(pos => (
                                <option key={pos.id} value={pos.id}>
                                    {pos.description}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                            Modalidad *
                        </label>
                        <select
                            name="mode_id"
                            value={formState.mode_id}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#004b9a] focus:border-[#004b9a]"
                            required>
                            <option value="">Seleccionar...</option>
                            {modalities.map(mod => (
                                <option key={mod.id} value={mod.id}>
                                    {mod.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                            Número de vacantes *
                        </label>
                        <input
                            type="number"
                            name="num_vacancy"
                            min="1"
                            value={formState.num_vacancy}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#004b9a] focus:border-[#004b9a]"
                            required
                        />
                    </div>
                </div>

                {/* Sección de listas mejorada */}
                <div className="space-y-8">
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Requisitos
                            <span className="ml-1 text-xs text-gray-500">
                                (Agregar uno por uno)
                            </span>
                        </label>

                        <div className="flex flex-col gap-3">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={requirementInput}
                                    onChange={e =>
                                        setRequirementInput(e.target.value)
                                    }
                                    className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-[#004b9a]"
                                    placeholder="Escribe un requisito"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddRequirement}
                                    className="p-3 text-white bg-[#004b9a] rounded-lg hover:bg-[#003a7a] flex items-center">
                                    <Plus size={18} />
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {formState.requirements.map((req, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50">
                                        <span className="text-sm text-gray-700 max-w-[200px] truncate">
                                            {req}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeItem(
                                                    'requirements',
                                                    index,
                                                )
                                            }
                                            className="text-red-500 hover:text-red-700">
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Responsabilidades
                            <span className="ml-1 text-xs text-gray-500">
                                (Agregar una por una)
                            </span>
                        </label>

                        <div className="flex flex-col gap-3">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={responsibilityInput}
                                    onChange={e =>
                                        setResponsibilityInput(e.target.value)
                                    }
                                    className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-[#004b9a]"
                                    placeholder="Escribe una responsabilidad"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddResponsibility}
                                    className="p-3 text-white bg-[#004b9a] rounded-lg hover:bg-[#003a7a] flex items-center">
                                    <Plus size={18} />
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {formState.responsability.map((res, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50">
                                        <span className="text-sm text-gray-700 max-w-[200px] truncate">
                                            {res}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeItem(
                                                    'responsability',
                                                    index,
                                                )
                                            }
                                            className="text-red-500 hover:text-red-700">
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Descripción */}
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                        Descripción del puesto
                    </label>
                    <textarea
                        name="description"
                        value={formState.description}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#004b9a] focus:border-[#004b9a]"
                        rows="4"
                        placeholder="Describe las funciones generales del puesto..."
                    />
                </div>

                {/* Acciones del formulario */}
                <div className="flex justify-end gap-4 pt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={!isFormValid || isSubmitting}
                        className="px-6 py-2 text-white bg-[#004b9a] rounded-lg hover:bg-[#003a7a] disabled:opacity-50 disabled:cursor-not-allowed">
                        {isSubmitting ? 'Creando...' : 'Publicar Vacante'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreateVacancyForm
