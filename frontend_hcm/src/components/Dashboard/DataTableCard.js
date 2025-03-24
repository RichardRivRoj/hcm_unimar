const DataTableCard = ({ title, children, className }) => (
    <div
        className={`p-4 bg-white border border-gray-200 rounded-xl shadow-xs ${className}`}>
        <h3 className="mb-4 text-xs font-medium tracking-wide text-gray-500 uppercase">
            {title}
        </h3>
        <div className="relative w-full h-[calc(100%-40px)]">{children}</div>
    </div>
)
export default DataTableCard
