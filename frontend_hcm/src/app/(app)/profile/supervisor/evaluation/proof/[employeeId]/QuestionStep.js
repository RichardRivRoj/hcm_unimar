import React, { useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useDebouncedCallback } from 'use-debounce'

const QuestionStep = React.memo(
    ({
        question,
        questionNumber,
        totalQuestions,
        onScoreChange,
        onCommentChange,
        initialScore,
        initialComment,
    }) => {
        const stateRef = useRef({
            score: initialScore ?? null,
            comment: initialComment ?? '',
        })

        const debouncedCommentUpdate = useDebouncedCallback(value => {
            onCommentChange(value)
        }, 600) // 500ms de retraso

        const updateScore = useCallback(
            value => {
                stateRef.current.score = value
                onScoreChange(value)
            },
            [onScoreChange],
        )

        const handleCommentChange = useCallback(
            e => {
                stateRef.current.comment = e.target.value
                debouncedCommentUpdate(e.target.value)
            },
            [debouncedCommentUpdate],
        )

        const showError = useRef(false)

        const handleBlur = () => {
            showError.current = true
        }

        return (
            <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}>
                <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-[#004b9a]">
                            Pregunta {questionNumber} de {totalQuestions}
                        </span>
                    </div>

                    <p className="mb-8 text-lg text-gray-800">
                        {question.text}
                    </p>

                    <div className="grid grid-cols-5 gap-4 mb-8">
                        {[1, 2, 3, 4, 5].map(s => (
                            <motion.button
                                key={s}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => updateScore(s)}
                                className={`p-3 text-center border rounded-lg transition-all ${
                                    stateRef.current.score === s
                                        ? 'border-[#004b9a] bg-[#004b9a]/10'
                                        : 'hover:border-[#004b9a]'
                                }`}>
                                <span className="text-xl font-semibold text-gray-700">
                                    {s}
                                </span>
                            </motion.button>
                        ))}
                    </div>

                    <div className="mt-6">
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                            Comentarios
                        </label>
                        <textarea
                            defaultValue={stateRef.current.comment}
                            onChange={handleCommentChange}
                            onBlur={handleBlur}
                            className={`w-full p-3 border ${
                                showError.current &&
                                !stateRef.current.comment.trim()
                                    ? 'border-red-500'
                                    : 'border-gray-300'
                            } rounded-lg focus:ring-2 focus:ring-[#004b9a] focus:border-[#004b9a]`}
                            rows="3"
                            placeholder="Agregar comentarios..."
                            required
                        />
                        {showError.current &&
                            !stateRef.current.comment.trim() && (
                                <p className="mt-1 text-sm text-red-600">
                                    Debes agregar un comentario
                                </p>
                            )}
                    </div>
                </div>
            </motion.div>
        )
    },
    (prevProps, nextProps) => {
        return (
            prevProps.questionNumber === nextProps.questionNumber &&
            prevProps.totalQuestions === nextProps.totalQuestions &&
            prevProps.initialScore === nextProps.initialScore &&
            prevProps.initialComment === nextProps.initialComment
        )
    },
)

QuestionStep.displayName = 'QuestionStep'

export default QuestionStep
