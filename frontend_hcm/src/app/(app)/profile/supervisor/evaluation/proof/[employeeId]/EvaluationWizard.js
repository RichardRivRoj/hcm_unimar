'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Stepper } from 'react-form-stepper'
import { motion } from 'framer-motion'
import {
    CheckCircleIcon,
    UserCircleIcon,
    CalendarIcon,
    BriefcaseIcon,
} from '@heroicons/react/24/outline'
import usePerformanceEvaluations from '@/hooks/supervisor/usePerformanceEvaluations'
import ModalEvaluation from '@/components/ModalEvaluation'
import CompetenceStep from './CompetenceStep'
import ResultsStep from './ResultsStep'
import ConfirmationStep from './ConfirmationStep'
import { useNavigation } from '@/providers/NavigationProvider'
import { toast } from 'sonner'

const EvaluationWizard = ({ employeeId, departmentId, periodId }) => {
    const { navigation, updateNavigation } = useNavigation()
    const [currentStep, setCurrentStep] = useState(0)
    const [isOpen, setIsOpen] = useState(true)
    const [sections, setSections] = useState([])
    const [scores, setScores] = useState({})

    const handleCloseModal = () => {
        setIsOpen(false)
        setCurrentStep(0)
        updateNavigation(0, 0)
    }

    const {
        evaluationDetails: data,
        loading,
        error,
        fetchEvaluationDetails,
        fetchEvaluationStructure,
        createEvaluation,
    } = usePerformanceEvaluations()

    useEffect(() => {
        const initialScores = {}
        sections.forEach(section => {
            initialScores[section.id] = {}
            section.questions?.forEach(question => {
                initialScores[section.id][question.id] = {
                    score: undefined,
                    comment: '',
                }
            })
        })
        setScores(initialScores)
    }, [sections])

    const loadData = async () => {
        try {
            await fetchEvaluationDetails(employeeId)
            const structure = await fetchEvaluationStructure()
            setSections(structure)
        } catch (error) {
            console.error('Error loading data:', error)
        }
    }

    useEffect(() => {
        if (employeeId) loadData()
    }, [employeeId])

    const isAllSectionsComplete = useCallback(() => {
        return sections.every(section =>
            section.questions?.every(
                question =>
                    scores[section.id]?.[question.id]?.score !== undefined,
            ),
        )
    }, [scores, sections])

    const handleStepChange = () => {
        if (currentStep === 1 && !isAllSectionsComplete()) {
            toast.error('¡Debes completar todas las secciones primero!')
            return
        }
        if (currentStep < 3) {
            setCurrentStep(prev => prev + 1)
        } else {
            handleSubmit()
        }
    }

    const handleSubmit = async () => {
        const formattedResponses = Object.entries(scores).flatMap(
            ([sectionId, questions]) =>
                Object.entries(questions).map(([questionId, data]) => ({
                    question_id: parseInt(questionId),
                    score: data.score,
                    comments: data.comment || '',
                    section_id: parseInt(sectionId),
                })),
        )

        try {
            toast.promise(
                createEvaluation({
                    employee_id: employeeId,
                    department_id: departmentId,
                    period_id: periodId,
                    responses: formattedResponses,
                }),
                {
                    loading: 'Enviando evaluación...',
                    success: () => {
                        setIsOpen(false)
                        return 'Evaluación enviada exitosamente!'
                    },
                    error: error => {
                        const message =
                            error.response?.data?.message ||
                            'Error al enviar la evaluación'
                        return `${message} 🚨`
                    },
                },
            )
        } catch (error) {
            console.error('Error al enviar la evaluación:', error)
            toast.error('Ocurrió un error inesperado')
        }
    }

    const IntroContent = () => (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-2 text-center">
                <CheckCircleIcon className="h-16 w-16 text-[#004b9a] mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-800">
                    Evaluación de Desempeño
                </h2>
                <p className="text-gray-600">
                    Verifique los datos antes de comenzar
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <motion.div
                    className="p-6 bg-gray-50 rounded-xl"
                    whileHover={{ scale: 1.02 }}>
                    <div className="flex items-center gap-3 mb-4">
                        <BriefcaseIcon className="h-6 w-6 text-[#004b9a]" />
                        <h3 className="text-lg font-semibold text-[#004b9a]">
                            Evaluador
                        </h3>
                    </div>
                    <dl className="space-y-3">
                        <div>
                            <dt className="text-sm font-medium text-gray-600">
                                Departamento
                            </dt>
                            <dd className="mt-1 text-gray-900">
                                {data?.evaluator.department}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-600">
                                Responsable
                            </dt>
                            <dd className="mt-1 text-gray-900">
                                {data?.evaluator.head}
                            </dd>
                        </div>
                    </dl>
                </motion.div>

                <motion.div
                    className="p-6 bg-gray-50 rounded-xl"
                    whileHover={{ scale: 1.02 }}>
                    <div className="flex items-center gap-3 mb-4">
                        <UserCircleIcon className="h-6 w-6 text-[#004b9a]" />
                        <h3 className="text-lg font-semibold text-[#004b9a]">
                            Evaluado
                        </h3>
                    </div>
                    <dl className="space-y-3">
                        <div>
                            <dt className="text-sm font-medium text-gray-600">
                                Nombre completo
                            </dt>
                            <dd className="mt-1 text-gray-900">
                                {data?.employee.full_name}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-600">
                                Cargo
                            </dt>
                            <dd className="mt-1 text-gray-900">
                                {data?.employee.position}
                            </dd>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <dt className="text-sm font-medium text-gray-600">
                                    Documento
                                </dt>
                                <dd className="mt-1 text-gray-900">
                                    {data?.employee.identification}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-600">
                                    Contrato
                                </dt>
                                <dd className="mt-1 text-gray-900">
                                    {data?.employee.contract.employment_type}
                                </dd>
                            </div>
                        </div>
                    </dl>
                </motion.div>
            </div>

            <motion.div
                className="p-4 bg-[#004b9a]/10 rounded-lg flex items-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}>
                <CalendarIcon className="h-6 w-6 text-[#004b9a]" />
                <div>
                    <p className="text-sm font-medium text-gray-600">
                        Periodo de evaluación
                    </p>
                    <p className="text-lg font-semibold text-[#004b9a]">
                        {data?.period.name}
                    </p>
                </div>
            </motion.div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentStep(1)}
                className="w-full py-4 bg-[#004b9a] text-white rounded-xl font-semibold hover:bg-[#003a7a] transition-colors">
                Confirmar e Iniciar Evaluación
            </motion.button>
        </div>
    )

    const EvaluationContent = () => (
        <div className="max-w-4xl mx-auto space-y-8">
            <Stepper
                steps={[
                    { label: 'Introducción' },
                    { label: 'Competencias' },
                    { label: 'Resultados' },
                    { label: 'Confirmación' },
                ]}
                activeStep={currentStep}
                onStepClick={(step) => {
                    if (step < currentStep) setCurrentStep(step) // Permitir retroceder
                }}
                styleConfig={{
                    activeBgColor: '#004b9a',
                    completedBgColor: '#004b9a',
                    inactiveBgColor: '#e5e7eb',
                    labelColor: '#6b7280',
                    activeLabelColor: '#004b9a',
                    completedLabelColor: '#374151',
                    size: '40px',
                    borderRadius: '50%',
                    fontWeight: '500',
                }}
                connectorStateColors
                connectorStyleConfig={{
                    disabledColor: '#e5e7eb',
                    activeColor: '#004b9a',
                    completedColor: '#004b9a',
                    size: '2px',
                    stepSize: '40px',
                }}
            />

            <div className="mt-8">
                {currentStep === 1 && (
                    <CompetenceStep
                        sections={sections}
                        scores={scores}
                        setScores={setScores}
                        currentSectionIndex={navigation.currentSection}
                        currentQuestionIndex={navigation.currentQuestion}
                        setCurrentSectionIndex={section =>
                            updateNavigation(section, 0)
                        }
                        setCurrentQuestionIndex={question =>
                            updateNavigation(
                                navigation.currentSection,
                                question,
                            )
                        }
                        onAllSectionsComplete={() => setCurrentStep(2)}
                    />
                )}
                {currentStep === 2 && (
                    <ResultsStep sections={sections} scores={scores} />
                )}
                {currentStep === 3 && (
                    <ConfirmationStep
                        sections={sections}
                        data={data}
                        scores={scores}
                        departmentId={departmentId}
                        periodId={periodId}
                    />
                )}
            </div>

            {/* Botones solo desde el paso 2 en adelante */}
            {currentStep >= 2 && (
                <div className="flex justify-between pt-6 border-t">
                    <button
                        onClick={() => setCurrentStep(prev => prev - 1)}
                        className="px-8 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
                        Anterior
                    </button>

                    <button
                        onClick={handleStepChange}
                        className="ml-auto px-8 py-3 bg-[#004b9a] text-white rounded-lg hover:bg-[#003a7a]"
                        disabled={
                            currentStep === 3 && !isAllSectionsComplete()
                        }>
                        {currentStep === 3
                            ? 'Finalizar Evaluación'
                            : 'Siguiente Paso'}
                    </button>
                </div>
            )}
        </div>
    )

    return (
        <>
            {isOpen && (
                <ModalEvaluation
                    isOpen={isOpen}
                    onClose={handleCloseModal}
                    title="Evaluación">
                    {currentStep === 0 ? (
                        <IntroContent />
                    ) : (
                        <EvaluationContent />
                    )}
                </ModalEvaluation>
            )}
        </>
    )
}

export default EvaluationWizard
