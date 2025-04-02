'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye } from 'lucide-react'
import useDepartments from '@/hooks/useDepartments' // Importa el hook para listar departamentos
import useModalities from '@/hooks/useModalities'
import usePositions from '@/hooks/usePositions'
import useCreateVacancies from '@/hooks/useCreateVacancies'
import useVacancies from '@/hooks/useVacancies'
import useStatuses from '@/hooks/useStatuses'
import StandardLoader from '@/components/StandardLoader'
import StandardTable from '@/components/StandardTable'
import CreateVacancyForm from './CreateVacancyForm'
import { toast } from 'sonner'
import { mutate } from 'swr'
import { GeneralModal } from '@/components/Modal'
import Badge from '@/components/Badge'

const JobListPage = () => {
    const router = useRouter()
    const {
        departments,
    } = useDepartments()
    const {
        statuses,
    } = useStatuses()
    const {
        modalities,
    } = useModalities()
    const {
        positions,
    } = usePositions()
    const {
        createVacancies,
        loading: creatingJob,
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

    const [isCreating, setIsCreating] = useState(false)


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
            accessor: 'description',
            render: item => ` ${item.department?.description}`,
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
            render: item => {
                // Mapeo de estados a variantes
                const statusVariant = {
                    'Activo': 'success',
                    'Inactivo': 'secondary',
                    'Pendiente': 'default',
                    // Agrega más mapeos según tus necesidades
                }
                
                return (
                    <Badge
                        variant={statusVariant[item.status?.name] || 'default'}
                        className="capitalize" // Para texto en minúsculas
                    >
                        {item.status?.name}
                    </Badge>
                )
            }
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
        <div className="static min-h-screen ml-5 space-y-4">
            <div className="flex justify-end mt-6 ">
                <button
                    onClick={() => setIsCreating(true)}
                    className="px-6 py-2 bg-[#004b9a] text-white rounded-lg hover:bg-[#003a7a] transition-colors flex items-center gap-2">
                    Crear Nueva Vacante
                </button>
            </div>
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

            {/* Formulario para crear vacante */}
            {isCreating && (
                <GeneralModal
                    size="p2xl"
                    isOpen={isCreating}
                    onClose={() => {
                        setIsCreating(false)
                    }}>
                    <CreateVacancyForm
                        departments={departments}
                        positions={positions}
                        modalities={modalities}
                        onSubmit={async formData => {
                            try {
                                const payload = {
                                    ...formData,
                                    requirements: JSON.stringify(
                                        formData.requirements,
                                    ),
                                    responsability: JSON.stringify(
                                        formData.responsability,
                                    ),
                                }

                                await createVacancies(payload)
                                toast.success('Vacante creada exitosamente')
                                setIsCreating(false)
                                mutate()
                            } catch (error) {
                                toast.error(`Error: ${error.message}`)
                            }
                        }}
                        onCancel={() => setIsCreating(false)}
                        isSubmitting={creatingJob}
                    />
                </GeneralModal>
            )}
        </div>
    )
}

export default JobListPage
