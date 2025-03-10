import { motion } from 'framer-motion'
import { Stepper } from 'react-form-stepper'
import QuestionStep from './QuestionStep'
import { useCallback, useEffect, useState } from 'react'

const SectionStep = ({
    section,
    scores,
    onScoreChange,
    isCurrent,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    onNext,
    onPrev,
    isComplete,
}) => {
    // Mantener el índice localmente
    const [localIndex, setLocalIndex] = useState(currentQuestionIndex)

    // 5. Validación de preguntas
    const questions = section.questions || []
    const hasQuestions = questions.length > 0

    // 6. Efecto de inicialización
    useEffect(() => {
        if (hasQuestions && localIndex >= questions.length) {
            setLocalIndex(0)
            setCurrentQuestionIndex(0)
        }
    }, [hasQuestions, questions.length])

    // Sincronizar solo cuando el índice padre cambia intencionalmente
    useEffect(() => {
        setLocalIndex(currentQuestionIndex)
    }, [currentQuestionIndex])

    const handleNavigation = direction => {
        const newIndex =
            direction === 'next'
                ? Math.min(localIndex + 1, section.questions.length - 1)
                : Math.max(localIndex - 1, 0)

        // Actualizar ambos estados de forma sincronizada
        setLocalIndex(newIndex)
        setCurrentQuestionIndex(newIndex) // Sincronizar con el padre
    }

    const handleScore = score => {
        onScoreChange(section.id, currentQuestion.id, 'score', score)
    }

    const handleComment = comment => {
        onScoreChange(section.id, currentQuestion.id, 'comment', comment)
    }

    const currentQuestion = section.questions?.[localIndex] || {}

    const handleNext = useCallback(() => {
        if (localIndex < section.questions.length - 1) {
            handleNavigation('next')
        } else if (isComplete) {
            onNext() // Solo se ejecuta si la sección está completa
        }
    }, [localIndex, section.questions.length, isComplete, onNext])

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isCurrent ? 1 : 0, x: isCurrent ? 0 : 20 }}
            className={`space-y-8 ${!isCurrent && 'hidden'}`}>
            {hasQuestions ? (
                <>
                    <Stepper
                        steps={section.questions.map((_, i) => ({
                            label: `Pregunta ${i + 1}`,
                        }))}
                        activeStep={localIndex}
                        styleConfig={{
                            activeBgColor: '#004b9a',
                            completedBgColor: '#004b9a',
                            inactiveBgColor: '#e5e7eb',
                            size: '32px',
                        }}
                        connectorStyleConfig={{
                            disabledColor: '#e5e7eb',
                            size: 2,
                        }}
                    />

                    <QuestionStep
                        key={`${section.id}-${currentQuestion.id}`}
                        question={currentQuestion}
                        onScoreChange={handleScore}
                        onCommentChange={handleComment}
                        initialScore={scores[currentQuestion.id]?.score}
                        initialComment={scores[currentQuestion.id]?.comment}
                        questionNumber={localIndex + 1}
                        totalQuestions={section.questions.length}
                    />
                </>
            ) : (
                <div className="p-4 text-yellow-800 bg-yellow-100">
                    No hay preguntas disponibles en esta sección
                </div>
            )}

            <div className="flex justify-between pt-6 border-t">
                <button
                    onClick={() => {
                        if (localIndex > 0) {
                            handleNavigation('prev') // Usar dirección constante
                        } else {
                            onPrev() // Cambiar a sección anterior
                        }
                    }}
                    disabled={localIndex === 0}
                    className="px-6 py-2 text-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-100">
                    Anterior
                </button>

                <button
                    onClick={handleNext}
                    className="px-6 py-2 bg-[#004b9a] text-white rounded-lg hover:bg-[#003a7a] disabled:opacity-50"
                    disabled={
                        !isComplete &&
                        localIndex === section.questions.length - 1
                    }>
                    {localIndex === section.questions.length - 1
                        ? isComplete
                            ? 'Siguiente Sección'
                            : 'Completa todas las preguntas'
                        : 'Siguiente'}
                </button>
            </div>
        </motion.div>
    )
}

export default SectionStep
