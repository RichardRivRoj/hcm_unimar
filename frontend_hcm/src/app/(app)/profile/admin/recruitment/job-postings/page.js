'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, Edit, Trash2 } from 'lucide-react'
import useDepartments from '@/hooks/useDepartments' // Importa el hook para listar departamentos
import useModalities from '@/hooks/useModalities'
import usePositions from '@/hooks/usePositions'
import useCreateVacancies from '@/hooks/useCreateVacancies'
import useVacancies from '@/hooks/useVacancies'
import useStatuses from '@/hooks/useStatuses'

const JobListPage = () => {
    const router = useRouter()
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
    const {
        createVacancies,
        loading: creatingJob,
        error: errorCreate,
        success,
    } = useCreateVacancies()
    const [filters, setFilters] = useState({
        department_id: '',
        position_id: '',
        status_id: '',
    })
    const [currentPage, setCurrentPage] = useState(1)
    const { vacancies, loading, error, paginationMeta } = useVacancies(
        currentPage,
        filters,
    )

    const [formState, setFormState] = useState({
        position_id: '',
        department_id: '',
        title: '',
        description: '',
        requirements: [],
        responsability: [],
        num_vacancy: 1,
        mode_id: '',
    })

    const [isCreating, setIsCreating] = useState(false)

    const handleChange = e => {
        const { name, value, type } = e.target

        setFormState(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value) : value,
        }))
    }

    // Función para manejar cambios en los filtros
    const handleFilterChange = e => {
        const { name, value } = e.target
        setFilters(prev => ({
            ...prev,
            [name]: value,
        }))
        setCurrentPage(1) // Resetear a la primera página al cambiar filtros
    }

    const handleRequirementsChange = e => {
        const requirementsArray = e.target.value.split('\n')
        setFormState(prev => ({
            ...prev,
            requirements: requirementsArray,
        }))
    }
    
    const handleResponsabilityChange = e => {
        const responsabilityArray = e.target.value.split('\n')
        setFormState(prev => ({
            ...prev,
            responsability: responsabilityArray,
        }))
    }

    const handleSubmit = async e => {
        e.preventDefault()

        // Validación de campos obligatorios
        if (
            !formState.position_id ||
            !formState.department_id ||
            !formState.mode_id ||
            !formState.title
        ) {
            alert('Complete todos los campos obligatorios (*)')
            return
        }

        try {
            const payload = {
                ...formState,
                requirements: JSON.stringify(formState.requirements),
                responsability: JSON.stringify(formState.responsability),
            }

            await createVacancies(payload)

            // Resetear el formulario y cerrar el modal
            setFormState({
                position_id: '',
                department_id: '',
                title: '',
                description: '',
                requirements: [],
                responsability: [],
                num_vacancy: 1,
                mode_id: '',
            })
            setIsCreating(false)

            // Recargar la página para actualizar la lista de vacantes
            router.refresh()
        } catch (error) {
            setIsCreating(false)
            alert('Error al crear vacante: ' + error.message)
        }
    }

    const isFormValid =
        formState.position_id &&
        formState.department_id &&
        formState.title &&
        formState.mode_id

    if (loading)
        return (
            <div className="p-6 space-y-4">
                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
        )
    if (error) return <div className="p-6 text-red-600">Error: {error}</div>

    return (
        <div className="static min-h-screen">
            {/* Tabla de vacantes */}
            <div className="max-w-full p-6 mx-auto mt-6 ml-6 overflow-hidden bg-white rounded-lg shadow-lg">
                <h2 className="mb-4 text-2xl font-semibold text-gray-700">
                    Resumen de Vacantes
                </h2>

                {/* Filtros */}
                <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-3">
                    <select
                        name="department_id"
                        value={filters.department_id}
                        onChange={handleFilterChange}
                        required
                        className="w-full p-3 text-sm text-gray-700 transition duration-200 ease-in-out bg-transparent border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-0">
                        <option value="" className="text-gray-500">
                            Seleccione departamento
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

                    <select
                        name="position_id"
                        value={filters.position_id}
                        onChange={handleFilterChange}
                        className="w-full p-3 text-sm text-gray-700 transition duration-200 ease-in-out bg-transparent border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-0">
                        <option value="" className="text-gray-500">
                            Seleccione posición
                        </option>
                        {positions.map(pos => (
                            <option
                                key={pos.id}
                                value={pos.id}
                                className="text-gray-600">
                                {pos.description}
                            </option>
                        ))}
                    </select>

                    <select
                        name="status_id"
                        value={filters.status_id}
                        onChange={handleFilterChange}
                        className="w-full p-3 text-sm text-gray-700 transition duration-200 ease-in-out bg-transparent border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-0">
                        <option value="" className="text-gray-500">
                            Seleccione estado
                        </option>
                        {statuses.map(status => (
                            <option
                                key={status.id}
                                value={status.id}
                                className="text-gray-600">
                                {status.name}
                            </option>
                        ))}
                    </select>
                </div>

                <table className="min-w-full border-separate table-auto border-spacing-2">
                    <thead>
                        <tr className="text-left bg-blue-200">
                            <th className="px-6 py-3 text-sm font-medium text-gray-800">
                                Título
                            </th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-800">
                                Departamento
                            </th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-800">
                                Cargo
                            </th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-800">
                                Modalidad
                            </th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-800">
                                Estatus
                            </th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-800">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {vacancies.map(vacancy => (
                            <tr
                                key={vacancy.id}
                                className="border-b hover:bg-blue-50">
                                <td className="px-6 py-2 text-sm">
                                    {vacancy.title}
                                </td>
                                <td className="px-6 py-2 text-sm">
                                    {vacancy.department?.name}
                                </td>
                                <td className="px-6 py-2 text-sm">
                                    {vacancy.position?.description}
                                </td>
                                <td className="px-6 py-2 text-sm">
                                    {vacancy.mode?.name}
                                </td>
                                <td className="px-6 py-2 text-sm">
                                    {vacancy.status?.name}
                                </td>
                                <td className="justify-center px-8 py-2 text-sm">
                                    {/* Botón Ver Detalles */}
                                    <button
                                        onClick={() =>
                                            router.push(
                                                `/profile/admin/recruitment/job-postings/vacancy/${vacancy.id}`,
                                            )
                                        }
                                        className="p-1 text-blue-600 transition rounded-md hover:bg-gray-100">
                                        <Eye size={26} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Controles de paginación */}
                <div className="flex items-center justify-center mt-6 space-x-2">
                    <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-2 py-1 text-xs text-white rounded ${
                            currentPage === 1
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-[#004b9a] hover:bg-blue-700'
                        }`}>
                        ← Anterior
                    </button>
                    <span className="text-xs text-gray-700">
                        Página {currentPage} de {paginationMeta.last_page}
                    </span>
                    <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === paginationMeta.last_page}
                        className={`px-2 py-1 text-xs text-white rounded ${
                            currentPage === paginationMeta.last_page
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-[#004b9a] hover:bg-blue-700'
                        }`}>
                        Siguiente →
                    </button>
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        onClick={() => setIsCreating(true)}
                        className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none">
                        Crear Nueva Vacante
                    </button>
                </div>
            </div>

            {/* Formulario para crear vacante */}
            {isCreating && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-3/6 p-8 overflow-y-auto bg-white rounded-lg shadow-lg h-3/4 sm:w-3/6 scrollbar-none">
                        <h1 className="mb-6 text-2xl font-semibold text-gray-700">
                            Crear Vacante
                        </h1>

                        {loadingDepartments && (
                            <p className="text-sm text-gray-500">
                                Cargando departamentos...
                            </p>
                        )}
                        {errorDepartments && (
                            <p className="text-sm text-red-500">
                                Error al cargar departamentos:{' '}
                                {errorDepartments.message}
                            </p>
                        )}
                        {loadingModalities && (
                            <p className="text-sm text-gray-500">
                                Cargando Modalidad...
                            </p>
                        )}
                        {errorModalities && (
                            <p className="text-sm text-red-500">
                                Error al cargar Modalidad:{' '}
                                {errorModalities.message}
                            </p>
                        )}
                        {loadingPositions && (
                            <p className="text-sm text-gray-500">
                                Cargando Cargos...
                            </p>
                        )}
                        {errorPositions && (
                            <p className="text-sm text-red-500">
                                Error al cargar Cargos: {errorPositions.message}
                            </p>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Título */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600">
                                    Título *
                                </label>
                                <input
                                    name="title"
                                    value={formState.title}
                                    onChange={handleChange}
                                    required
                                    className="p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>

                            {/* Departamento */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600">
                                    Departamento *
                                </label>
                                <select
                                    name="department_id"
                                    value={formState.department_id}
                                    onChange={handleChange}
                                    required
                                    className="p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
                                    <option value="">
                                        Seleccione departamento
                                    </option>
                                    {departments.map(dept => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Posición */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600">
                                    Posición *
                                </label>
                                <select
                                    name="position_id"
                                    value={formState.position_id}
                                    onChange={handleChange}
                                    required
                                    className="p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
                                    <option value="">
                                        Seleccione posición
                                    </option>
                                    {positions.map(pos => (
                                        <option key={pos.id} value={pos.id}>
                                            {pos.description}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Modalidad */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600">
                                    Modalidad *
                                </label>
                                <select
                                    name="mode_id"
                                    value={formState.mode_id}
                                    onChange={handleChange}
                                    required
                                    className="p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
                                    <option value="">
                                        Seleccione modalidad
                                    </option>
                                    {modalities.map(mod => (
                                        <option key={mod.id} value={mod.id}>
                                            {mod.name}
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

                            {/* Requisitos */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600">
                                    Requisitos (uno por línea)
                                </label>
                                <textarea
                                    value={formState.requirements.join('\n')}
                                    onChange={handleRequirementsChange}
                                    className="p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    rows="4"
                                />
                            </div>

                            {/* Requisitos */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600">
                                    Responsabilidades (uno por línea)
                                </label>
                                <textarea
                                    value={formState.responsability.join('\n')}
                                    onChange={handleResponsabilityChange}
                                    className="p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    rows="4"
                                />
                            </div>

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
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => setIsCreating(false)}
                                    className="w-1/4 px-3 py-2 mt-4 text-white bg-gray-400 rounded-lg hover:bg-gray-500">
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    disabled={!isFormValid || creatingJob}
                                    className="w-1/4 px-3 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50">
                                    {creatingJob
                                        ? 'Creando...'
                                        : 'Crear Vacante'}
                                </button>
                            </div>
                        </form>

                        {errorCreate && (
                            <p className="mt-4 text-sm text-red-500">
                                Error al crear la vacante: {errorCreate}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default JobListPage
