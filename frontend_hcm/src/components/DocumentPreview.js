export default function DocumentPreview({ document, onClose }) {
    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">{document.name}</h2>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700">
                    ✕
                </button>
            </div>

            <div className="space-y-4">
                {document.date && (
                    <div>
                        <label className="block text-sm font-medium text-gray-600">
                            Fecha:
                        </label>
                        <p>{new Date(document.date).toLocaleDateString()}</p>
                    </div>
                )}

                {document.status && (
                    <div>
                        <label className="block text-sm font-medium text-gray-600">
                            Estado:
                        </label>
                        <p>{document.status}</p>
                    </div>
                )}

                {document.skills && (
                    <div>
                        <label className="block text-sm font-medium text-gray-600">
                            Habilidades:
                        </label>
                        <ul className="pl-5 list-disc">
                            {document.skills.map((skill, index) => (
                                <li key={index}>{skill}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="flex gap-4 mt-6">
                    <button className="bg-[#004b9a] text-white px-4 py-2 rounded-lg hover:bg-[#003a7a]">
                        Descargar
                    </button>
                    <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                        Editar
                    </button>
                </div>
            </div>
        </div>
    )
}
