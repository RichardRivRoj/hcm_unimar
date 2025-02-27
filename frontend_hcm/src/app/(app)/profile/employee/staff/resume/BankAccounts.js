import { useState } from 'react'
import useBankAccounts from '@/hooks/useBankAccounts'
import { Skeleton } from '@/components/skeleton'
import { Alert, AlertDescription } from '@/components/alert'
import Modal from '@/components/Modal'
import useListBanks from '@/hooks/useListBanks'
import useListAccountTypes from '@/hooks/useListAccountTypes'
import useListCurrencies from '@/hooks/useListCurrencies'
import axios from '@/lib/axios'

const BankAccountDocuments = () => {
    const {
        personal_info,
        bank_accounts,
        loading,
        error,
        meta,
        refresh,
        currentPage,
        totalPages,
        goToPage,
    } = useBankAccounts()

    const { banks, loading: loadingBanks, error: errorBanks } = useListBanks()
    const { accounts, loading: loadingAccounts, error: errorAccounts } = useListAccountTypes()
    const { currencies, loading: loadingCurrencies, error: errorCurrenciess } = useListCurrencies()

    const [selectedAccount, setSelectedAccount] = useState(null)
    const [isFormModalOpen, setIsFormModalOpen] = useState(false)
    const [formError, setFormError] = useState(null)
    const [validationErrors, setValidationErrors] = useState({})

    const token = localStorage.getItem('token'); // ¡Faltaba esta línea!

    const [formData, setFormData] = useState({
        bank_id: '',
        account_type_id: '',
        currency_id: '',
        status_id: 1,
        account_number: '',
    })

    const handleInputChange = e => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }))
        setValidationErrors(prev => ({ ...prev, [name]: null }))
    }

    const handleCreateAccount = async () => {
        try {
            const token = localStorage.getItem('token');
            
            const response = await axios.post('/api/documents/banks', formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (response.status === 201) {
                setIsFormModalOpen(false);
                refresh(currentPage);
                setFormData({
                    bank_id: '',
                    account_type_id: '',
                    currency_id: '',
                    status_id: 1,
                    account_number: ''
                });
            }
        } catch (err) {
            if (err.response?.status === 422) {
                setValidationErrors(err.response.data.errors);
            } else {
                setFormError(err.response?.data?.message || 'Error de conexión');
            }
        }
    };

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )
    }

    return (
        <div className="space-y-4">
            {/* Modal para crear nueva cuenta */}
            <Modal
                isOpen={isFormModalOpen}
                onClose={() => {
                    setIsFormModalOpen(false)
                    setFormError(null)
                    setValidationErrors({})
                }}
                maxWidth="lg">
                <div className="p-6 space-y-4 bg-white rounded-lg">
                    <h2 className="text-2xl font-bold">
                        Nueva Cuenta Bancaria
                    </h2>

                    {formError && (
                        <Alert variant="destructive">
                            <AlertDescription>{formError}</AlertDescription>
                        </Alert>
                    )}

                    <div className="grid gap-6 md:grid-cols-1">
                        <div className="space-y-2">
                            <label className="block font-medium">Banco *</label>
                            {loadingBanks ? (
                                <p className="text-gray-500">
                                    Cargando bancos...
                                </p>
                            ) : error ? (
                                <p className="text-sm text-red-500">{error}</p>
                            ) : (
                                <select
                                    name="bank_id"
                                    value={formData.bank_id || ''}
                                    className={`w-full p-2 border rounded ${validationErrors.bank_id ? 'border-red-500' : ''}`}
                                    onChange={handleInputChange}>
                                    <option value="">
                                        Seleccione un banco
                                    </option>
                                    {banks.map(bank => (
                                        <option key={bank.id} value={bank.id}>
                                            {bank.code}{'-'}{bank.short_name}
                                        </option>
                                    ))}
                                </select>
                            )}

                            {validationErrors.bank_id && (
                                <span className="text-sm text-red-500">
                                    {validationErrors.bank_id[0]}
                                </span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="block font-medium">
                                Número de Cuenta *
                            </label>
                            <input
                                type="text"
                                name="account_number"
                                value={formData.account_number}
                                max={21}
                                className={`w-full p-2 border rounded ${
                                    validationErrors.account_number
                                        ? 'border-red-500'
                                        : ''
                                }`}
                                onChange={handleInputChange}
                            />
                            {validationErrors.account_number && (
                                <span className="text-sm text-red-500">
                                    {validationErrors.account_number[0]}
                                </span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="block font-medium">Tipo de Cuenta *</label>
                            {loadingAccounts ? (
                                <p className="text-gray-500">
                                    Cargando...
                                </p>
                            ) : error ? (
                                <p className="text-sm text-red-500">{error}</p>
                            ) : (
                                <select
                                    name="account_type_id"
                                    value={formData.account_type_id || ''}
                                    className={`w-full p-2 border rounded ${validationErrors.account_type_id ? 'border-red-500' : ''}`}
                                    onChange={handleInputChange}>
                                    <option value="">
                                        Seleccione una opción
                                    </option>
                                    {accounts.map(account => (
                                        <option key={account.id} value={account.id}>
                                            {account.name}
                                        </option>
                                    ))}
                                </select>
                            )}

                            {validationErrors.account_type_id && (
                                <span className="text-sm text-red-500">
                                    {validationErrors.account_type_id[0]}
                                </span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="block font-medium">Moneda *</label>
                            {loadingAccounts ? (
                                <p className="text-gray-500">
                                    Cargando...
                                </p>
                            ) : error ? (
                                <p className="text-sm text-red-500">{error}</p>
                            ) : (
                                <select
                                    name="currency_id"
                                    value={formData.currency_id || ''}
                                    className={`w-full p-2 border rounded ${validationErrors.currency_id ? 'border-red-500' : ''}`}
                                    onChange={handleInputChange}>
                                    <option value="">
                                        Seleccione una opción
                                    </option>
                                    {currencies.map(currency => (
                                        <option key={currency.id} value={currency.id}>
                                            {currency.short_name}
                                        </option>
                                    ))}
                                </select>
                            )}

                            {validationErrors.currency_id && (
                                <span className="text-sm text-red-500">
                                    {validationErrors.currency_id[0]}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            onClick={() => setIsFormModalOpen(false)}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                            Cancelar
                        </button>
                        <button
                            onClick={handleCreateAccount}
                            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                            Guardar Cuenta
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modal para detalles de cuenta */}
            <Modal
                isOpen={!!selectedAccount}
                onClose={() => setSelectedAccount(null)}
                maxWidth="lg">
                {selectedAccount && (
                    <div className="p-6 bg-white rounded-lg">
                        <h2 className="mb-4 text-2xl font-bold">
                            Cuenta {selectedAccount.bank_name}
                        </h2>

                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="font-semibold">Banco:</p>
                                <p>{selectedAccount.bank_short_name}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Tipo de Cuenta:</p>
                                <p>{selectedAccount.account_type}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Tipo de Cuenta:</p>
                                <p>{selectedAccount.account_number}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Moneda:</p>
                                <p>{selectedAccount.currency}</p>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={() => setSelectedAccount(null)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg">
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Encabezado */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Cuentas Bancarias</h2>
                <div className="flex gap-4">
                    <button
                        onClick={() => setIsFormModalOpen(true)}
                        className="px-4 py-2 text-white bg-[#004b9a] rounded-lg hover:bg-[#003a7a]">
                        + Nueva Cuenta
                    </button>
                    <button
                        onClick={() => refresh(currentPage)}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                        disabled={loading}>
                        {loading ? 'Actualizando...' : '⟳ Actualizar'}
                    </button>
                </div>
            </div>

            {/* Listado */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <Skeleton key={i} className="w-full h-20 rounded-lg" />
                    ))}
                </div>
            ) : (
                <>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {bank_accounts?.map(account => (
                            <div
                                key={account.id}
                                onClick={() => setSelectedAccount(account)}
                                className="p-4 bg-white border rounded-lg cursor-pointer hover:shadow-md">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold">
                                        {account.bank_short_name}
                                    </h3>
                                    <span
                                        className={`px-2 py-1 text-sm rounded-full ${
                                            account.status === 'Activo'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                        {account.status}
                                    </span>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <p>
                                        <span className="font-medium">
                                            Número:
                                        </span>{' '}
                                        {account.account_number}
                                    </p>
                                    <p>
                                        <span className="font-medium">
                                            Tipo:
                                        </span>{' '}
                                        {account.account_type}
                                    </p>
                                    <p>
                                        <span className="font-medium">
                                            Moneda:
                                        </span>{' '}
                                        {account.currency}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Paginación */}
                    <div className="flex items-center justify-between mt-4">
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 text-white bg-blue-500 rounded-lg disabled:opacity-50">
                            Anterior
                        </button>

                        <span className="text-sm text-gray-600">
                            Página {currentPage} de {totalPages}
                        </span>

                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 text-white bg-blue-500 rounded-lg disabled:opacity-50">
                            Siguiente
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

export default BankAccountDocuments
