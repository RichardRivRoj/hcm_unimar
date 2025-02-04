'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import useDepartments from '@/hooks/useDepartments'
import useModalities from '@/hooks/useModalities'
import usePositions from '@/hooks/usePositions'
import useStatuses from '@/hooks/useStatuses'
import DetailCard from '@/components/DetailCard'
import CheckIcon from '@/components/CheckIcon'
import axios from '@/lib/axios'

const VacancyDetails = ({ params }) => {
    const router = useRouter()
    const { id } = params
    const [vacancy, setVacancy] = useState(null)
    const {
        departments,
        loading: loadingDepartments,
        error: errorDepartments,
    } = useDepartments()
    const {
        statuses,
        loading: loadingStatuses,
        error: errorStatuses,
    } = useStatuses()
    const {
        modalities,
        loading: loadingModalities,
        error: errorModalities,
    } = useModalities()
    const {
        positions,
        loading: loadingPositions,
        error: errorPositions,
    } = usePositions()
    const [formState, setFormState] = useState({
        position_id: '',
        department_id: '',
        title: '',
        description: '',
        requirements: [],
        num_vacancy: 1,
        mode_id: '',
        status_id: '',
    })
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [updateError, setUpdateError] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)
    const [isUpdating, setIsUpdating] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deleteError, setDeleteError] = useState(null)
    const [deleteSuccess, setDeleteSuccess] = useState(false)

    // Normalizar requirements
    const normalizeRequirements = requirements => {
        if (Array.isArray(requirements)) {
            return requirements
        }
        if (typeof requirements === 'string') {
            try {
                return JSON.parse(requirements) || []
            } catch (err) {
                console.error('Error parsing requirements:', err)
                return []
            }
        }
        return []
    }

    // Cargar datos iniciales
    useEffect(() => {
        const fetchVacancy = async () => {
            try {
                const response = await axios.get(`/api/vacancies/${id}`)
                const data = response.data

                // Normalizar requirements
                const normalizedRequirements = normalizeRequirements(
                    data.requirements,
                )

                setVacancy({ ...data, requirements: normalizedRequirements })
                setFormState({
                    ...data,
                    requirements: normalizedRequirements,
                })
                setLoading(false)
            } catch (err) {
                console.error('Error:', err)
                setError('Error al cargar la vacante')
                setLoading(false)
            }
        }

        fetchVacancy()
    }, [id])

    // Manejar cambios en el formulario
    const handleChange = e => {
        const { name, value } = e.target
        setFormState(prev => ({ ...prev, [name]: value }))
    }

    // Función para abrir el modal de confirmación
    const openDeleteConfirmation = () => {
        setShowDeleteModal(true)
        setDeleteError(null)
        setDeleteSuccess(false)
    }

    // Función para cancelar la eliminación
    const cancelDelete = () => {
        setShowDeleteModal(false)
    }

    // Función para confirmar la eliminación
    const confirmDelete = async () => {
        try {
            const response = await axios.delete(`/api/vacancies/${id}`)

            if (response.data.success) {
                setDeleteSuccess(true)
                setTimeout(() => {
                    router.back()
                }, 1500)
            }
        } catch (err) {
            setDeleteError(
                err.response?.data?.message || 'Error al eliminar la vacante',
            )
        } finally {
            setShowDeleteModal(false)
        }
    }
    // Manejar cambios en los requisitos
    const handleRequirementsChange = e => {
        const requirementsArray = e.target.value
            .split('\n')
            .filter(line => line.trim() !== '') // Eliminar líneas vacías

        setFormState(prev => ({
            ...prev,
            requirements: requirementsArray,
        }))
    }

    // Enviar actualización
    const handleUpdate = async e => {
        e.preventDefault()
        setUpdateError(null)
        setSuccessMessage(null)
        setIsUpdating(true)

        try {
            const response = await axios.put(`/api/vacancies/${id}`, {
                ...formState,
                requirements: JSON.stringify(formState.requirements),
            })

            if (response.data.success) {
                // Normalizar requirements en la respuesta
                const normalizedRequirements = normalizeRequirements(
                    response.data.data.requirements,
                )

                setVacancy({
                    ...response.data.data,
                    requirements: normalizedRequirements,
                })
                setSuccessMessage('Vacante actualizada exitosamente')
                setIsEditing(false)
                setTimeout(() => setSuccessMessage(null), 3000)
            }
        } catch (err) {
            setUpdateError(
                err.response?.data?.message || 'Error al actualizar la vacante',
            )
        } finally {
            setIsUpdating(false)
        }
    }

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

    if (error) {
        return (
            <div className="max-w-4xl p-8 mx-auto text-center">
                <div className="p-4 mb-4 text-red-600 bg-red-100 rounded-lg">
                    {error}
                </div>
                <button
                    onClick={() => router.back()}
                    className="flex items-center justify-center gap-2 px-6 py-2 text-gray-600 transition-all hover:text-gray-800">
                    <span className="text-xl">←</span>
                    Volver a vacantes
                </button>
            </div>
        )
    }

    return (
        <div className="max-w-4xl p-8 mx-auto text-justify bg-white shadow-sm rounded-xl">
            <div className="p-2 bg-white">
                {/* Header y controles */}
                <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
                    {/* Botón Volver a vacantes (izquierda) */}
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-gray-600 hover:text-blue-800 group w-fit">
                        <span className="mr-2 text-2xl transition-transform group-hover:-translate-x-1">
                            ←
                        </span>
                        <span className="font-medium">Volver a vacantes</span>
                    </button>

                    {/* Contenedor para los botones de la derecha */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        {/* Modal de confirmación */}
                        {showDeleteModal && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                                <div className="p-6 bg-white rounded-lg w-96">
                                    <h3 className="mb-4 text-xl font-semibold">
                                        Confirmar eliminación
                                    </h3>

                                    {deleteError && (
                                        <div className="p-2 mb-4 text-red-600 bg-red-100 rounded">
                                            {deleteError}
                                        </div>
                                    )}

                                    {deleteSuccess ? (
                                        <div className="p-2 text-green-600 bg-green-100 rounded">
                                            Vacante eliminada exitosamente
                                        </div>
                                    ) : (
                                        <>
                                            <p className="mb-4 text-gray-600">
                                                ¿Estás seguro de que deseas
                                                eliminar esta vacante?
                                            </p>

                                            <div className="flex justify-end gap-3">
                                                <button
                                                    type="button"
                                                    onClick={cancelDelete}
                                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                                                    Cancelar
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={confirmDelete}
                                                    className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700">
                                                    Eliminar
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Botón de eliminar modificado */}
                        <button
                            onClick={openDeleteConfirmation}
                            className="p-2 text-red-600 transition rounded-md hover:bg-red-100">
                            <Trash2 size={24} />
                        </button>

                        {/* Botón Editar Vacante */}
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
                                Editar Vacante
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Mensajes de estado */}
            {successMessage && (
                <div className="p-4 mb-6 text-green-700 bg-green-100 rounded-lg">
                    {successMessage}
                </div>
            )}
            {updateError && (
                <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-lg">
                    {updateError}
                </div>
            )}

            {isEditing ? (
                // Formulario de edición
                <form onSubmit={handleUpdate} className="space-y-8">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Campo Título */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Título *
                            </label>
                            <input
                                name="title"
                                value={formState.title}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        {/* Campo Departamento */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Departamento *
                            </label>
                            <select
                                name="department_id"
                                value={formState.department_id}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required>
                                <option value="">
                                    Seleccionar departamento
                                </option>
                                {departments.map(dept => (
                                    <option
                                        key={dept.id}
                                        value={dept.id}
                                        className="text-gray-600">
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Campo Cargo */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Cargo *
                            </label>
                            <select
                                name="position_id"
                                value={formState.position_id}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required>
                                <option value="">Seleccionar Cargo</option>
                                {positions.map(pos => (
                                    <option
                                        key={pos.id}
                                        value={pos.id}
                                        className="text-gray-600">
                                        {pos.description}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Modalidad */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Modalidad *
                            </label>
                            <select
                                name="mode_id"
                                value={formState.mode_id}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required>
                                <option value="">Seleccionar Modalidad</option>
                                {modalities.map(mode => (
                                    <option
                                        key={mode.id}
                                        value={mode.id}
                                        className="text-gray-600">
                                        {mode.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Número de vacantes */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600">
                                Número de vacantes *
                            </label>
                            <input
                                type="number"
                                name="num_vacancy"
                                min="1"
                                value={formState.num_vacancy}
                                onChange={handleChange}
                                required
                                className="p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        {/* Modalidad */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Estado *
                            </label>
                            <select
                                name="status_id"
                                value={formState.status_id}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required>
                                <option value="">Seleccionar Modalidad</option>
                                {statuses.map(estatus => (
                                    <option
                                        key={estatus.id}
                                        value={estatus.id}
                                        className="text-gray-600">
                                        {estatus.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Sección de Requisitos */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Requisitos (uno por línea) *
                        </label>
                        <textarea
                            value={formState.requirements.join('\n')}
                            onChange={handleRequirementsChange}
                            className="w-full p-3 border rounded-lg h-44 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />

                        {/* Descripción */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600">
                                Descripción
                            </label>
                            <textarea
                                name="description"
                                value={formState.description}
                                onChange={handleChange}
                                className="p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                rows="4"
                            />
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-col gap-4 mt-8 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-6 py-2 text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isUpdating}
                            className="px-6 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                            {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            ) : (
                // Vista de solo lectura
                <div className="space-y-8">
                    {/* Encabezado */}
                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {vacancy.title}
                        </h1>
                        <p className="text-lg text-gray-600">
                            {vacancy.description}
                        </p>
                    </div>

                    {/* Detalles en tarjetas */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <DetailCard
                            title="Cargo"
                            value={vacancy.position?.description}
                        />
                        <DetailCard
                            title="Departamento"
                            value={vacancy.department?.name}
                        />
                        <DetailCard
                            title="Modalidad"
                            value={vacancy.mode?.name}
                        />
                        <DetailCard
                            title="Estatus"
                            value={vacancy.status?.name}
                        />
                        <DetailCard
                            title="Vacantes"
                            value={vacancy.num_vacancy}
                        />
                    </div>

                    {/* Lista de Requisitos */}
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
            )}
        </div>
    )
}

export default VacancyDetails
