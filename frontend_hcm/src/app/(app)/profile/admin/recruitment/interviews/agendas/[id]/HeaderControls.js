import { Trash2 } from "lucide-react"

const HeaderControls = ({ onDelete, onEdit, isEditing, agenda, isRated }) => (
    <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
    
        {agenda.agenda.status === 'Activo' && !isRated && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
                onClick={onDelete}
                className="p-2 text-red-800 transition rounded-md hover:bg-red-100">
                <Trash2 size={24} />
            </button>
            {!isEditing && (
                <button
                    onClick={onEdit}
                    className="px-6 py-2 bg-[#004b9a] text-white rounded-lg hover:bg-[#003a7a] transition-colors flex items-center gap-2">
                    Editar Agenda
                </button>
            )}
        </div>
        )}
    </div>
)

export default HeaderControls