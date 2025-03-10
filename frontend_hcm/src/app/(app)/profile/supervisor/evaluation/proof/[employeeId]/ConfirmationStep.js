import { motion } from 'framer-motion';

const ConfirmationStep = ({ data, scores = {}, departmentId, periodId }) => {
  const calculateTotalScore = () => {
    if (!scores || typeof scores !== 'object') return 0;
    
    return Object.values(scores).reduce((total, section) => {
      if (!section) return total;
      return total + Object.values(section).reduce((sum, scoreData) => {
        return sum + (Number(scoreData?.score) || 0);
      }, 0);
    }, 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="p-6 rounded-lg bg-green-50">
        <h3 className="text-xl font-semibold text-green-800">
          Confirmación Final
        </h3>
        <p className="mt-2 text-sm text-green-700">
          Revise los detalles antes de enviar la evaluación.
        </p>
      </div>

      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h4 className="text-lg font-semibold text-[#004b9a] mb-4">
          Detalles de la Evaluación
        </h4>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-gray-600">Empleado Evaluado</p>
            <p className="text-gray-900">{data?.employee.full_name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Departamento</p>
            <p className="text-gray-900">{data?.evaluator.department}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Periodo</p>
            <p className="text-gray-900">{data?.period.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Puntuación Total</p>
            <p className="text-[#004b9a] font-semibold">{calculateTotalScore()}</p>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-lg bg-yellow-50">
        <p className="text-sm text-yellow-800">
          Al confirmar, la evaluación será enviada y no podrá ser modificada.
        </p>
      </div>
    </motion.div>
  );
};

export default ConfirmationStep;