const ChartCard = ({ title, children, className = "" }) => (
    <div className={`bg-white p-6 rounded-xl shadow-sm ${className}`}>
        <h3 className="text-lg font-semibold mb-4 text-[#004b9a]">{title}</h3>
        <div className="relative w-full aspect-[16/9]">  {/* Relación de aspecto 16:9 */}
            {children}
        </div>
    </div>
)

export default ChartCard