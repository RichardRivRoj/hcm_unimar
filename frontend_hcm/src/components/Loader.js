
const Loader = ({ className = '' }) => (
    <div className={`animate-spin rounded-full border-4 border-t-transparent ${className}`}>
        <span className="sr-only">Cargando...</span>
    </div>
)

export default Loader