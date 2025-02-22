import { useState } from 'react'
import useHireEmployee from '@/hooks/useHireEmployee'
import useEmploymentTypes from '@/hooks/employmentTypesView'
import useContractTypes from '@/hooks/contractTypesView'

const HireEmployeeForm = ({ candidateId, onSuccess }) => {
    const { hireEmployee, loading, error, success } = useHireEmployee()
    const {
        employment,
        loading: loadingEmployment,
        error: errorEmployment,
    } = useEmploymentTypes()
    const {
        contract,
        loading: loadingContract,
        error: errorContract,
    } = useContractTypes()

    // Estado para manejar los datos del formulario
    const [formData, setFormData] = useState({
        start_date: '',
        end_date: '',
        contract_type_id: '',
        employment_type_id: '',
        half: 1, // 1 = tiempo completo por defecto
        email: '',
    })

    // Manejar cambios en los campos del formulario
    const handleChange = e => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    // Manejar el envío del formulario
    const handleSubmit = async e => {
        e.preventDefault()
        try {
            const response = await hireEmployee(candidateId, formData)
            onSuccess(response) // Llama a la función onSuccess si la contratación es exitosa
        } catch (err) {
            console.error('Error al contratar al candidato:', err)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label
                    htmlFor="start_date"
                    className="block text-sm font-medium text-gray-700">
                    Fecha de inicio
                </label>
                <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                    className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
                />
            </div>

            <div>
                <label
                    htmlFor="end_date"
                    className="block text-sm font-medium text-gray-700">
                    Fecha de finalización
                </label>
                <input
                    type="date"
                    id="end_date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
                />
            </div>

            <div>
                <label
                    htmlFor="contract_type_id"
                    className="block text-sm font-medium text-gray-700">
                    Tipo de contrato
                </label>
                <select
                    id="contract_type_id"
                    name="contract_type_id"
                    value={formData.contract_type_id}
                    onChange={handleChange}
                    required
                    className="block w-full p-2 mt-1 border border-gray-300 rounded-md">
                    <option value="">Seleccione un tipo de contrato</option>
                    {contract.map(con => (
                        <option key={con.id} value={con.id}>
                            {con.short_name} - {con.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label
                    htmlFor="employment_type_id"
                    className="block text-sm font-medium text-gray-700">
                    Tipo de empleo
                </label>
                <select
                    id="employment_type_id"
                    name="employment_type_id"
                    value={formData.employment_type_id}
                    onChange={handleChange}
                    required
                    className="block w-full p-2 mt-1 border border-gray-300 rounded-md">
                    <option value="">Seleccione un tipo de empleo</option>
                    {employment.map(emp => (
                        <option key={emp.id} value={emp.id}>
                            {emp.short_name} - {emp.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700">
                    Correo electrónico
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
                />
            </div>

            {error && <div className="text-sm text-red-500">{error}</div>}

            <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300">
                {loading ? 'Contratando...' : 'Contratar'}
            </button>

            {success && (
                <div className="text-sm text-green-500">
                    Candidato contratado exitosamente.
                </div>
            )}
        </form>
    )
}

export default HireEmployeeForm
