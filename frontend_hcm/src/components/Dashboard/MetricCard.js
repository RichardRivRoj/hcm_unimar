const MetricCard = ({ title, value, description, color = '#004b9a' }) => (
    <div className="p-4 transition-shadow bg-white border border-gray-200 shadow-xs rounded-xl hover:shadow-md">
      <h3 className="text-xs font-medium tracking-wide text-gray-500 uppercase">{title}</h3>
      <div className="flex items-baseline gap-2 mt-2">
        <span className="text-2xl font-bold" style={{ color }}>{value}</span>
        {description && <span className="text-sm text-gray-500">{description}</span>}
      </div>
    </div>
  )

export default MetricCard;
