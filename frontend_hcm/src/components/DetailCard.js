// Componente auxiliar para detalles
const DetailCard = ({ title, value }) => (
    <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-xs">
        <h3 className="mb-1 text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-lg font-semibold text-gray-800">{value || '-'}</p>
    </div>
);

export default DetailCard;