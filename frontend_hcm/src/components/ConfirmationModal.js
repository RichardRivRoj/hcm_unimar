import Button from "./Button";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-2xl text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <Button
            variant="secondary"
            className="text-white bg-gray-500 hover:bg-gray-700 focus:bg-gray-800 active:bg-gray-900"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            className="text-white bg-red-500 hover:bg-red-700 focus:bg-red-800 active:bg-red-900"
            onClick={onConfirm}
          >
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

