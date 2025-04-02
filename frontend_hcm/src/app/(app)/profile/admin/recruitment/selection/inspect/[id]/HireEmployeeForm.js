'use client'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import useHireEmployee from '@/hooks/useHireEmployee'
import useEmploymentTypes from '@/hooks/employmentTypesView'
import useContractTypes from '@/hooks/contractTypesView'
import useContractForm from '@/hooks/admin/useContractForm'

const HireEmployeeForm = ({ candidateId, onSuccess }) => {
    const { hireEmployee, loading, validationErrors } =
        useHireEmployee()
    const { employment } = useEmploymentTypes()
    const { contract } = useContractTypes()
    const { paymentTerms } = useContractForm() // Nuevo hook
    const [errors, setErrors] = useState([])

    const today = new Date().toLocaleDateString('es-CA', { timeZone: 'UTC' })

    const [formData, setFormData] = useState({
        start_date: today,
        end_date: '',
        contract_type_id: '',
        employment_type_id: '',
        payment_term_id: '', // Nuevo campo
        email: '',
    })

    const indefiniteContract = contract?.find(
        con => con.name.toLowerCase() === 'indefinido',
    )
    const isIndefinite = formData.contract_type_id == indefiniteContract?.id

    useEffect(() => {
        if (isIndefinite) {
            setFormData(prev => ({ ...prev, end_date: '' }))
        }
    }, [isIndefinite])

    const validateEmailFormat = email => {
        const regex = /^[a-zA-Z0-9._%+-]+@unimar\.edu\.ve$/i
        return regex.test(email)
    }

    const handleChange = e => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }))
        // Limpiar errores al modificar el campo
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setErrors({})

        // Validación de email
        if (!validateEmailFormat(formData.email)) {
            toast.error('El correo debe tener dominio @unimar.edu.ve')
            return setErrors({ email: ['Dominio inválido'] })
        }

        // Validación de fechas
        if (!isIndefinite && !formData.end_date) {
            toast.error(
                'La fecha final es requerida para este tipo de contrato',
            )
            return setErrors({ end_date: ['Campo requerido'] })
        }

        try {
            const response = await hireEmployee(candidateId, formData)
            toast.success('Contratación exitosa!', {
                description: 'El empleado ha sido registrado correctamente',
            })
            onSuccess(response)
        } catch (err) {
            toast.error('Error en la contratación', {
                description:
                    err.errors || 'Por favor verifica los datos ingresados',
            })
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
            {/* Sección de Tipo de Contrato */}
            <div className="p-6 bg-white border border-gray-100 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-[#004b9a] mb-4">
                    Datos del Contrato
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Tipo de contrato *
                        </label>
                        <select
                            id="contract_type_id"
                            name="contract_type_id"
                            value={formData.contract_type_id}
                            onChange={handleChange}
                            required
                            className="block w-full p-2.5 mt-1 border rounded-md focus:ring-2 focus:ring-[#004b9a] focus:border-[#004b9a] transition-colors">
                            <option value="">
                                Seleccione un tipo de contrato
                            </option>
                            {contract.map(con => (
                                <option key={con.id} value={con.id}>
                                    {con.short_name} - {con.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Fecha de inicio *
                            </label>
                            <input
                                type="date"
                                id="start_date"
                                name="start_date"
                                value={formData.start_date}
                                min={new Date().toLocaleDateString('es-ES', { timeZone: 'UTC' })}
                                onChange={handleChange}
                                required
                                className="block w-full p-2.5 mt-1 border rounded-md focus:ring-2 focus:ring-[#004b9a] focus:border-[#004b9a] transition-colors"
                            />
                            {validationErrors.start_date && (
                                <p className="mt-1 text-sm text-red-600">
                                    {validationErrors.start_date[0]}
                                </p>
                            )}
                        </div>

                        {!isIndefinite && (
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Fecha de finalización *
                                </label>
                                <input
                                    type="date"
                                    id="end_date"
                                    name="end_date"
                                    value={formData.end_date}
                                    onChange={handleChange}
                                    required={!isIndefinite}
                                    min={formData.start_date}
                                    className="block w-full p-2.5 mt-1 border rounded-md focus:ring-2 focus:ring-[#004b9a] focus:border-[#004b9a] transition-colors"
                                    disabled={isIndefinite}
                                />
                                {validationErrors.end_date && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {validationErrors.end_date[0]}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Términos de Pago *
                        </label>
                        <select
                            id='payment_term_id'
                            name="payment_term_id"
                            value={formData.payment_term_id}
                            onChange={handleChange}
                            required
                            className="block w-full p-2.5 mt-1 border rounded-md focus:ring-2 focus:ring-[#004b9a] focus:border-[#004b9a] transition-colors">
                            <option value="">
                                Seleccione términos de pago
                            </option>
                            {paymentTerms.map(term => (
                                <option key={term.id} value={term.id}>
                                    {term.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Sección de Datos Laborales */}
            <div className="p-6 bg-white border border-gray-100 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-[#004b9a] mb-4">
                    Datos Laborales
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Tipo de empleo *
                        </label>
                        <select
                            id="employment_type_id"
                            name="employment_type_id"
                            value={formData.employment_type_id}
                            onChange={handleChange}
                            required
                            className="block w-full p-2.5 mt-1 border rounded-md focus:ring-2 focus:ring-[#004b9a] focus:border-[#004b9a] transition-colors">
                            <option value="">
                                Seleccione un tipo de empleo
                            </option>
                            {employment.map(emp => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.short_name} - {emp.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Correo institucional *
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={() => {
                                if (
                                    formData.email &&
                                    !validateEmailFormat(formData.email)
                                ) {
                                    toast.error('Formato de correo inválido')
                                    setErrors({ email: ['Dominio incorrecto'] })
                                }
                            }}
                            required
                            className="block w-full p-2.5 mt-1 border rounded-md focus:ring-2 focus:ring-[#004b9a] focus:border-[#004b9a] transition-colors"
                            placeholder="ejemplo@unimar.edu.ve"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.email[0]}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 text-white bg-[#004b9a] rounded-md hover:bg-[#003366] transition-colors font-medium disabled:bg-opacity-70 disabled:cursor-not-allowed">
                {loading
                    ? 'Procesando contratación...'
                    : 'Confirmar Contratación'}
            </button>
        </form>
    )
}

export default HireEmployeeForm
