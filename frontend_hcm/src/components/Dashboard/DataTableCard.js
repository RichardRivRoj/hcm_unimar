const DataTableCard = ({ title, children }) => (
    <div className="col-span-2 p-4 bg-white border border-gray-200 shadow-xs rounded-xl">
        <h3 className="mb-4 text-xs font-medium tracking-wide text-gray-500 uppercase">
            {title}
        </h3>
        {children}
    </div>
)
export default DataTableCard
