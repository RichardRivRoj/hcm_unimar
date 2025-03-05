export default function EmployeeHeader({ employee }) {
    return (
        <div className="p-6 mb-8 bg-white rounded-lg shadow-sm">
            <h1 className="mb-2 text-2xl font-bold text-gray-800">
                {employee.nombre_completo}
            </h1>
            <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                <div>
                    <span className="font-semibold">Identificación:</span>
                    <p>
                        {employee.identificacion.tipo}-
                        {employee.identificacion.numero}
                    </p>
                </div>
                <div>
                    <span className="font-semibold">Estatus:</span>
                    <p>{employee.estatus}</p>
                </div>
                <div>
                    <span className="font-semibold">Email:</span>
                    <p>{employee.email}</p>
                </div>
            </div>
        </div>
    )
}
