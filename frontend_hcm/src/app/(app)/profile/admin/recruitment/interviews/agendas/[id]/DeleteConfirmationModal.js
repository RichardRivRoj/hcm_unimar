import { GeneralModal } from "@/components/Modal"

const DeleteConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    error,
    success,
}) => (
    <GeneralModal isOpen={isOpen} onClose={onClose}>
        <div className="p-6 bg-white rounded-lg w-96">
            <h3 className="mb-4 text-xl font-semibold">
                Confirmar eliminación
            </h3>
            {error && (
                <div className="p-2 mb-4 text-red-600 bg-red-100 rounded">
                    {error}
                </div>
            )}
            {success ? (
                <div className="p-2 text-green-600 bg-green-100 rounded">
                    Agenda eliminada exitosamente
                </div>
            ) : (
                <>
                    <p className="mb-4 text-gray-600">
                        ¿Estás seguro de que deseas eliminar esta agenda?
                    </p>
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700">
                            Eliminar
                        </button>
                    </div>
                </>
            )}
        </div>
    </GeneralModal>
)

export default DeleteConfirmationModal
