const ChartContainer = ({ title, children }) => (
    <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-gray-600">{title}</h3>
        <div className="h-64">{children}</div>
    </div>
)

export default ChartContainer;
