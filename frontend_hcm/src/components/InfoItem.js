const InfoItem = ({ label, value }) => (
    <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <div className="mt-1 text-gray-800">{value}</div>
    </div>
)

export default InfoItem;
