'use client'
import usePerformanceEvaluations from '@/hooks/supervisor/usePerformanceEvaluations'
import { useEffect } from 'react'
import Loading from '@/app/(app)/Loading'
import StandardTable from '@/components/StandardTable'
import { useRouter } from 'next/navigation'
import { FaClipboardList } from 'react-icons/fa'
import Loader from '@/components/Loader'

const UnevaluatedEmployeesList = () => {
    const router = useRouter()
    const {
        unevaluated,
        activePeriod,
        loading,
        error,
        fetchUnevaluatedEmployees,
    } = usePerformanceEvaluations()

    useEffect(() => {
        fetchUnevaluatedEmployees()
    }, [])

    const columns = [
        {
            header: 'Nombre',
            accessor: 'name',
        },
        {
            header: 'Documento',
            accessor: 'document',
        },
        {
            header: 'Cargo',
            accessor: 'position',
        },
    ]

    const handleCreateEvaluation = employee => {
        // El parámetro es cada empleado individual
        // Validar usando el employee recibido
        if (!employee?.id || !activePeriod?.id) {
            console.error('Datos incompletos:', { employee, activePeriod })
            return
        }

        // Construir URL con parámetros correctos
        const params = new URLSearchParams({
            employee_id: employee.id,
            department_id: employee.department_id,
            period_id: activePeriod.id,
        })

        router.push(
            `/profile/supervisor/evaluation/proof/${employee.id}?${params.toString()}`,
        )
    }

    const actions = [
        {
            icon: <FaClipboardList className="text-lg text-blue-600" />,
            color: 'text-blue-500 hover:text-blue-700',
            handler: handleCreateEvaluation,
            tooltip: 'Crear evaluación',
        },
    ]

    if (loading) return <Loader />

    if (error)
        return (
            <div className="max-w-4xl p-8 mx-auto mt-8">
                <div className="p-4 text-red-600 bg-red-100 rounded-lg">
                    {error.message || 'Error al cargar los empleados'}
                </div>
            </div>
        )

    if (!activePeriod)
        return (
            <div className="max-w-4xl p-8 mx-auto mt-8">
                <div className="p-6 text-center bg-yellow-100 rounded-lg">
                    <h3 className="mb-3 text-xl font-semibold text-yellow-800">
                        No hay período de evaluación activo
                    </h3>
                    <p className="text-yellow-700">
                        Actualmente no existe ningún período de evaluación en
                        curso. Por favor contacte al área de RRHH para más
                        información.
                    </p>
                </div>
            </div>
        )

    return (
        <div className="max-w-6xl px-4 mx-auto">
            <StandardTable
                title={`Evaluación de Desempeño - ${activePeriod.name}`}
                columns={columns}
                data={unevaluated}
                actions={actions}
                currentPage={1}
                totalPages={1}
                onPageChange={() => {}}
                emptyState={
                    <div className="p-8 text-center">
                        <div className="inline-block p-6 bg-green-100 rounded-lg">
                            <h3 className="mb-2 text-xl font-semibold text-green-800">
                                ¡Evaluaciones completadas!
                            </h3>
                            <p className="text-green-700">
                                Todos los empleados de tu departamento han sido
                                evaluados en este período.
                            </p>
                        </div>
                    </div>
                }
            />
        </div>
    )
}

export default UnevaluatedEmployeesList
