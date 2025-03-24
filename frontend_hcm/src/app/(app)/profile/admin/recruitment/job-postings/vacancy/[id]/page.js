'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
import useDepartments from '@/hooks/useDepartments'
import useModalities from '@/hooks/useModalities'
import usePositions from '@/hooks/usePositions'
import useStatuses from '@/hooks/useStatuses'
import DetailCard from '@/components/DetailCard'
import CheckIcon from '@/components/CheckIcon'
import axios from '@/lib/axios'
import StandardLoader from '@/components/StandardLoader'
import Badge from '@/components/Badge'

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
        responsability: [],
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
                const normalizedResponsability = normalizeRequirements(
                    data.responsability,
                )

                setVacancy({
                    ...data,
                    requirements: normalizedRequirements,
                    responsability: normalizedResponsability,
                })
                setFormState({
                    ...data,
                    requirements: normalizedRequirements,
                    responsability: normalizedResponsability,
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
                responsability: JSON.stringify(formState.responsability),
            })

            if (response.data.success) {
                // Normalizar requirements en la respuesta
                const normalizedRequirements = normalizeRequirements(
                    response.data.data.requirements,
                )

                const normalizedResponsability = normalizeRequirements(
                    response.data.data.responsability,
                )

                setVacancy({
                    ...response.data.data,
                    requirements: normalizedRequirements,
                    responsability: normalizedResponsability,
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
        return <StandardLoader />
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
        <div className="max-w-4xl p-8 mx-auto bg-white rounded-xl shadow-lg border border-[#004b9a]/20">
            {/* Header */}
            <div className="mb-8 border-b-2 border-[#004b9a] pb-4">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-[#004b9a] hover:text-[#003a7a] group">
                        <ArrowLeft className="mr-2 transition-transform group-hover:-translate-x-1" />
                        <span className="font-medium">Volver a vacantes</span>
                    </button>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={openDeleteConfirmation}
                            className="p-2 text-red-600 transition-colors rounded-lg hover:bg-red-100">
                            <Trash2 size={24} />
                        </button>

                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-4 py-2 text-white bg-[#004b9a] rounded-lg hover:bg-[#003a7a] transition-colors">
                                <Edit size={18} />
                                Editar Vacante
                            </button>
                        )}
                    </div>
                </div>

                <h1 className="mt-6 text-3xl font-bold text-[#004b9a]">
                    {vacancy.position?.description}
                    <span className="block mt-2 text-xl text-gray-600">
                        {vacancy.department?.name}
                    </span>
                </h1>
            </div>

            {/* Mensajes de estado */}
            {successMessage && (
                <div className="p-4 mb-6 text-green-700 bg-green-100 border border-green-200 rounded-lg">
                    {successMessage}
                </div>
            )}

            {updateError && (
                <div className="p-4 mb-6 text-red-700 bg-red-100 border border-red-200 rounded-lg">
                    {updateError}
                </div>
            )}

            {isEditing ? (
                // Formulario de edición (mantener estructura con mejoras de estilo)
                <form onSubmit={handleUpdate} className="space-y-8">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Campos del formulario con estilos actualizados */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-[#004b9a]">
                                Departamento *
                            </label>
                            <select
                                name="department_id"
                                value={formState.department_id}
                                onChange={handleChange}
                                className="w-full p-3 border-2 border-[#004b9a]/20 rounded-lg focus:border-[#004b9a] focus:ring-2 focus:ring-[#004b9a]/30"
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

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-[#004b9a]">
                                Cargo *
                            </label>
                            <select
                                name="position_id"
                                value={formState.position_id}
                                onChange={handleChange}
                                className="w-full p-3 border-2 border-[#004b9a]/20 rounded-lg focus:border-[#004b9a] focus:ring-2 focus:ring-[#004b9a]/30"
                                required>
                                <option value="">
                                    Seleccionar departamento
                                </option>
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

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-[#004b9a]">
                                Modalidad *
                            </label>
                            <select
                                name="mode_id"
                                value={formState.mode_id}
                                onChange={handleChange}
                                className="w-full p-3 border-2 border-[#004b9a]/20 rounded-lg focus:border-[#004b9a] focus:ring-2 focus:ring-[#004b9a]/30"
                                required>
                                <option value="">
                                    Seleccionar departamento
                                </option>
                                <option value="">Seleccionar Cargo</option>
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
                                className="w-full p-3 border-2 border-[#004b9a]/20 rounded-lg focus:border-[#004b9a] focus:ring-2 focus:ring-[#004b9a]/30"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-[#004b9a]">
                                Estado *
                            </label>
                            <select
                                name="status_id"
                                value={formState.status_id}
                                onChange={handleChange}
                                className="w-full p-3 border-2 border-[#004b9a]/20 rounded-lg focus:border-[#004b9a] focus:ring-2 focus:ring-[#004b9a]/30"
                                required>
                                <option value="">Seleccionar Estado</option>
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

                    {/* Sección de requisitos y responsabilidades */}
                    <div className="p-6 bg-[#004b9a]/5 rounded-xl border border-[#004b9a]/20">
                        <label className="block mb-4 text-lg font-semibold text-[#004b9a]">
                            Requisitos y Responsabilidades
                        </label>

                        <div className="space-y-4">
                            <textarea
                                className="w-full p-4 border-2 border-[#004b9a]/20 rounded-lg focus:border-[#004b9a] focus:ring-2 focus:ring-[#004b9a]/30"
                                value={formState.requirements.join('\n')}
                                onChange={handleRequirementsChange}
                                required
                            />

                            <textarea
                                className="w-full p-4 border-2 border-[#004b9a]/20 rounded-lg focus:border-[#004b9a] focus:ring-2 focus:ring-[#004b9a]/30"
                                value={formState.responsability.join('\n')}
                                onChange={handleRequirementsChange}
                                required
                            />
                        </div>
                        {/* Descripción */}
                        <div className="flex flex-col space-y-4">
                            <label className="block mb-4 text-lg font-semibold text-[#004b9a]">
                                Descripción
                            </label>
                            <textarea
                                name="description"
                                value={formState.description}
                                onChange={handleChange}
                                className="w-full p-4 border-2 border-[#004b9a]/20 rounded-lg focus:border-[#004b9a] focus:ring-2 focus:ring-[#004b9a]/30"
                                rows="4"
                            />
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-4 pt-6 mt-8 border-t">
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-6 py-2 text-[#004b9a] border-2 border-[#004b9a] rounded-lg hover:bg-[#004b9a]/10 transition-colors">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 text-white bg-[#004b9a] rounded-lg hover:bg-[#003a7a] transition-colors">
                            {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            ) : (
                // Vista de solo lectura
                <div className="space-y-8">
                    {/* Detalles principales */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="p-4 bg-[#004b9a]/5 rounded-xl border border-[#004b9a]/20">
                            <h3 className="text-sm font-semibold text-[#004b9a] mb-2">
                                Estado
                            </h3>
                            <p className='text-lg font-medium'>
                            <Badge
                                variant={
                                    vacancy.status?.name === 'Activo'
                                        ? 'success'
                                        : vacancy.status?.name === 'Inactivo'
                                          ? 'secondary'
                                          : 'danyer'
                                }>
                                {vacancy.status?.name}
                            </Badge>
                            </p>
                        </div>

                        <div className="p-4 bg-[#004b9a]/5 rounded-xl border border-[#004b9a]/20">
                            <h3 className="text-sm font-semibold text-[#004b9a] mb-2">
                                Modalidad
                            </h3>
                            <p className="text-lg font-medium">
                                {vacancy.mode?.name}
                            </p>
                        </div>

                        <div className="p-4 bg-[#004b9a]/5 rounded-xl border border-[#004b9a]/20">
                            <h3 className="text-sm font-semibold text-[#004b9a] mb-2">
                                Vacantes
                            </h3>
                            <p className="text-lg font-medium">
                                {vacancy.num_vacancy}
                            </p>
                        </div>
                    </div>

                    {/* Descripción */}
                    <div className="p-6 bg-[#004b9a]/5 rounded-xl border border-[#004b9a]/20">
                        <h2 className="mb-4 text-lg font-semibold text-[#004b9a]">
                            Descripción del Cargo
                        </h2>
                        <p className="text-gray-700 whitespace-pre-line">
                            {vacancy.description}
                        </p>
                    </div>

                    {/* Requisitos y Responsabilidades */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="p-6 bg-[#004b9a]/5 rounded-xl border border-[#004b9a]/20">
                            <h2 className="mb-4 text-lg font-semibold text-[#004b9a]">
                                Requisitos
                            </h2>
                            <ul className="space-y-3">
                                {vacancy.requirements?.map((req, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start gap-2">
                                        <div className="w-5 h-5 mt-1 text-[#004b9a]">
                                            <CheckIcon />
                                        </div>
                                        <span className="text-gray-700">
                                            {req}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="p-6 bg-[#004b9a]/5 rounded-xl border border-[#004b9a]/20">
                            <h2 className="mb-4 text-lg font-semibold text-[#004b9a]">
                                Responsabilidades
                            </h2>
                            <ul className="space-y-3">
                                {vacancy.responsability?.map((res, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start gap-2">
                                        <div className="w-5 h-5 mt-1 text-[#004b9a]">
                                            <CheckIcon />
                                        </div>
                                        <span className="text-gray-700">
                                            {res}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de confirmación */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="p-6 bg-white rounded-xl w-96 border-2 border-[#004b9a]/20">
                        <h3 className="mb-4 text-xl font-semibold text-[#004b9a]">
                            Confirmar Eliminación
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
                                    ¿Estás seguro de que deseas eliminar esta
                                    vacante?
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
        </div>
    )
}

export default VacancyDetails
