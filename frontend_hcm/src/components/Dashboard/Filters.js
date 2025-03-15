const Filters = ({ departments }) => (
    <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3 lg:grid-cols-4">
        <select className="input-filter">
            <option value="">Todos los departamentos</option>
            {departments.map(dept => (
                <option key={dept.id} value={dept.id}>
                    {dept.name}
                </option>
            ))}
        </select>
        <select className="input-filter">
            <option value="">Últimos 30 días</option>
            <option value="7">Última semana</option>
            <option value="90">Últimos 3 meses</option>
        </select>
    </div>
)

export default Filters
