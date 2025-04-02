import React from 'react'

const SupervisorProfile = ({ user }) => {
    return (
        <div className="p-6 mb-6 transition-shadow bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#004b9a] flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                    </svg>
                    Perfil de Supervisor
                </h2>
                <div className="mt-2 w-12 h-1 bg-[#004b9a] rounded-full" />
            </div>

            {/* Contenido en grid responsivo */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Sección Izquierda - Información General */}
                {user.department && (
                    <div className="space-y-4">
                        {/* Bloque General */}
                        <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-[#004b9a]">
                            <h3 className="mb-2 text-lg font-semibold text-gray-700">
                                Información del Departamento
                            </h3>
                            <div className="space-y-1.5 text-gray-600">
                                <div className="flex items-center gap-2">
                                    <svg
                                        className="w-4 h-4 text-[#004b9a]"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                        />
                                    </svg>
                                    <span>
                                        <strong className="text-gray-700">
                                            Nombre:
                                        </strong>{' '}
                                        {user.department.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg
                                        className="w-4 h-4 text-[#004b9a]"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <span>
                                        <strong className="text-gray-700">
                                            Código:
                                        </strong>{' '}
                                        {user.department.code}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Bloque Misión/Visión */}
                        <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-gray-50">
                                <h4 className="font-medium text-[#004b9a] mb-2 flex items-center gap-1">
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    Misión
                                </h4>
                                <p className="italic text-gray-600">
                                    "{user.department.mission}"
                                </p>
                            </div>

                            <div className="p-4 rounded-lg bg-gray-50">
                                <h4 className="font-medium text-[#004b9a] mb-2 flex items-center gap-1">
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                        />
                                    </svg>
                                    Visión
                                </h4>
                                <p className="italic text-gray-600">
                                    "{user.department.vision}"
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Sección Derecha - Detalles */}
                {user.department && (
                    <div className="space-y-4">
                        {/* Responsabilidades y Objetivos */}
                        <div className="p-4 rounded-lg bg-gray-50">
                            <h3 className="mb-3 text-lg font-semibold text-gray-700">
                                Responsabilidades y Objetivos
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-medium text-[#004b9a] mb-2">
                                        Responsabilidades
                                    </h4>
                                    <ul className="pl-4 space-y-2">
                                        {user.department.responsibilities.map(
                                            (responsibility, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-start gap-2 text-gray-600">
                                                    <span className="text-[#004b9a]">
                                                        ▹
                                                    </span>
                                                    {responsibility}
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-medium text-[#004b9a] mb-2">
                                        Objetivos
                                    </h4>
                                    <ul className="pl-4 space-y-2">
                                        {user.department.objectives.map(
                                            (objective, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-start gap-2 text-gray-600">
                                                    <span className="text-[#004b9a]">
                                                        ▹
                                                    </span>
                                                    {objective}
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Contacto y Datos */}
                        <div className="p-4 rounded-lg bg-gray-50">
                            <h3 className="mb-3 text-lg font-semibold text-gray-700">
                                Contacto y Datos
                            </h3>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <svg
                                        className="w-4 h-4 text-[#004b9a]"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <span>{user.department.contact_info}</span>
                                </div>

                                <div>
                                    <h4 className="font-medium text-[#004b9a] mt-3 mb-2">
                                        Datos Adicionales
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {Object.entries(
                                            user.department.extra_data,
                                        ).map(([key, value]) => (
                                            <div
                                                key={key}
                                                className="p-2 bg-white border rounded">
                                                <span className="text-sm font-medium text-gray-600">
                                                    {key}:
                                                </span>
                                                <span className="block text-gray-500">
                                                    {value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

           
        </div>
    )
}

export default SupervisorProfile
