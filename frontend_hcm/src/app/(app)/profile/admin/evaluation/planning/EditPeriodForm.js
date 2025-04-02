'use client'

import useEvaluationPeriods from "@/hooks/admin/useEvaluationPeriods"
import { useForm } from "react-hook-form"
import Button from "@/components/Button"

const EditPeriodForm = ({ period, onClose, onSuccess }) => {
    const { register, handleSubmit, setError, formState: { errors } } = useForm({
      defaultValues: {
        name: period.name,
        start_date: period.start_date,
        end_date: period.end_date
      }
    })
  
    const { updateEvaluationPeriod } = useEvaluationPeriods()
  
    const onSubmit = async (data) => {
      try {
        await updateEvaluationPeriod(period.id, data)
        onSuccess()
      } catch (error) {
        // Manejar errores específicos
      if (error.errors) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          setError(field, {
            type: 'manual',
            message: messages[0]
          })
        })
      }
      
      // Mostrar error general si existe
      if (error.message && !error.errors) {
        setError('root', {
          type: 'manual',
          message: error.message
        })
      }
      }
    }
  
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
        <h3 className='text-lg font-bold'>Nuevo Período de Evaluación</h3>
      
      {/* Mensaje de error general */}
      {errors.root && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
          {errors.root.message}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nombre del período
        </label>
        <input
          {...register('name', { 
            required: 'Este campo es requerido' // Mensaje personalizado
          })}
          className={`mt-1 p-2 block w-full rounded-md border ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          } shadow-sm focus:border-blue-500 focus:ring-blue-500`}
          placeholder='Ej. Semestre I - 2025'
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha de inicio
          </label>
          <input
            type="date"
            {...register('start_date', { 
              required: 'Selecciona una fecha de inicio' 
            })}
            className={`mt-1 p-2 block w-full rounded-md border ${
              errors.start_date ? 'border-red-500' : 'border-gray-300'
            } shadow-sm focus:border-blue-500 focus:ring-blue-500`}
          />
          {errors.start_date && (
            <p className="mt-1 text-sm text-red-600">
              {errors.start_date.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha de fin
          </label>
          <input
            type="date"
            {...register('end_date', { 
              required: 'Selecciona una fecha de fin' 
            })}
            className={`mt-1 p-2 block w-full rounded-md border ${
              errors.end_date ? 'border-red-500' : 'border-gray-300'
            } shadow-sm focus:border-blue-500 focus:ring-blue-500`}
          />
          {errors.end_date && (
            <p className="mt-1 text-sm text-red-600">
              {errors.end_date.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="secondary"
          className='text-white bg-gray-500 hover:bg-gray-700 focus:bg-gray-800 active:bg-gray-900'
          onClick={onClose}
        >
          Cancelar
        </Button>
        <Button type="submit" className="text-white bg-[#004b9a] hover:bg-[#003366] focus:bg-[#002244] active:bg-[#001122]" >
          Actualizar Período
        </Button>
      </div>
      </form>
    )
  }

export default EditPeriodForm