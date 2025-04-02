import { motion } from 'framer-motion'

const ResultsStep = ({ scores, sections }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="p-6 bg-[#004b9a]/10 rounded-lg">
        <h3 className="text-xl font-semibold text-[#004b9a]">
          Resumen de Resultados
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          Revise las puntuaciones asignadas en cada sección.
        </p>
      </div>

      {sections.map((section) => (
                <div key={section.id} className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold text-[#004b9a] mb-4">
                        {section.name}
                    </h4>
                    <div className="space-y-4">
                        {section.questions.map((question) => (
                            <div key={question.id} className="pb-4 border-b">
                                <p className="mb-2 text-gray-700">{question.text}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-[#004b9a] font-semibold">
                                        Puntuación: {scores[section.id]?.[question.id]?.score || 'N/A'}
                                    </span>
                                    {scores[section.id]?.[question.id]?.comment && (
                                        <p className="text-sm text-gray-600">
                                            "{scores[section.id][question.id].comment}"
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
    </motion.div>
  )
}

export default ResultsStep