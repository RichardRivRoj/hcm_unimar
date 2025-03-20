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
import StandardLoader from '@/components/StandardLoader'
import StandardTable from '@/components/StandardTable'
import { toast } from 'sonner'
import { mutate } from 'swr'

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

        if (
            !formState.position_id ||
            !formState.department_id ||
            !formState.mode_id
        ) {
            toast.error('Complete todos los campos obligatorios (*)')
            return
        }

        try {
            const payload = {
                ...formState,
                requirements: JSON.stringify(formState.requirements),
                responsability: JSON.stringify(formState.responsability),
            }

            await createVacancies(payload)

            // Notificación de éxito
            toast.success('Vacante creada exitosamente')

            // Resetear el formulario
            setFormState({
                position_id: '',
                department_id: '',
                description: '',
                requirements: [],
                responsability: [],
                num_vacancy: 1,
                mode_id: '',
            })

            setIsCreating(false)

            // Reiniciar la tabla
            mutate()
        } catch (errorCreate) {
            // Notificación de error
            toast.error(`Error al crear la vacante: ${errorCreate.message}`)
        }
    }

    const isFormValid =
        formState.position_id && formState.department_id && formState.mode_id

    // Configuración de la tabla
    const tableColumns = [
        {
            header: 'Título',
            accessor: 'position',
            render: item =>
                `${item.position?.description} - ${item.department?.name}`,
        },
        {
            header: 'Departamento',
            accessor: 'name',
            render: item => ` ${item.department?.name}`,
        },
        {
            header: 'Cargo',
            accessor: 'position.description',
            render: item => ` ${item.position?.description}`,
        },
        {
            header: 'Modalidad',
            accessor: 'mode.name',
            render: item => ` ${item.mode?.name}`,
        },
        {
            header: 'Estatus',
            accessor: 'status.name',
            render: item => ` ${item.status?.name}`,
        },
    ]

    const tableFilters = [
        {
            name: 'department_id',
            placeholder: 'Seleccione departamento',
            options: [
                { value: '', label: 'Todos los departamentos' },
                ...departments.map(dept => ({
                    value: dept.id,
                    label: dept.name,
                })),
            ],
        },
        {
            name: 'position_id',
            placeholder: 'Seleccione posición',
            options: [
                { value: '', label: 'Todos los cargos' },
                ...positions.map(pos => ({
                    value: pos.id,
                    label: pos.description,
                })),
            ],
        },
        {
            name: 'status_id',
            placeholder: 'Seleccione estado',
            options: [
                { value: '', label: 'Todos los estados' },
                ...statuses.map(status => ({
                    value: status.id,
                    label: status.name,
                })),
            ],
        },
    ]

    const tableActions = [
        {
            icon: <Eye size={20} />,
            color: 'text-blue-600',
            handler: item =>
                router.push(
                    `/profile/admin/recruitment/job-postings/vacancy/${item.id}`,
                ),
        },
    ]

    if (loading) return <StandardLoader />
    if (error) return <div className="p-6 text-red-600">Error: {error}</div>

    return (
        <div className="static min-h-screen">
            {/* Tabla de vacantes */}
            <StandardTable
                title="Resumen de Vacantes"
                columns={tableColumns}
                data={vacancies}
                filters={tableFilters}
                currentPage={currentPage}
                totalPages={paginationMeta?.last_page || 1}
                onPageChange={setCurrentPage}
                onFilterChange={e => {
                    setFilters(prev => ({
                        ...prev,
                        [e.target.name]: e.target.value,
                    }))
                    setCurrentPage(1)
                }}
                actions={tableActions}
            />

            <div className="flex justify-end mt-6">
                <button
                    onClick={() => setIsCreating(true)}
                    className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none">
                    Crear Nueva Vacante
                </button>
            </div>

            {/* Formulario para crear vacante */}
            {isCreating && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-3/6 p-8 overflow-y-auto bg-white rounded-lg shadow-lg h-3/4 sm:w-3/6 scrollbar-none">
                        <h1 className="mb-6 text-2xl font-semibold text-gray-700">
                            Crear Vacante
                        </h1>

                        <form onSubmit={handleSubmit} className="space-y-6">
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
                    </div>
                </div>
            )}
        </div>
    )
}

export default JobListPage
