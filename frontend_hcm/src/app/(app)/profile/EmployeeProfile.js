import React from 'react'
import { Cake, IdCard, Captions, HeartHandshake, NotebookPen } from 'lucide-react'

const EmployeeProfile = ({ user }) => {
    return (
        <div className="mb-8">
            {/* Encabezado */}
            <div className="flex items-center gap-6 mb-6 p-6 bg-[#004b9a] text-white rounded-lg shadow-lg">
                <div className="flex-shrink-0 w-32 h-32">
                    {user.person?.photo_url ? (
                        <img
                            src={user.person.photo_url}
                            alt={`${user.person.first_name} ${user.person.last_name}`}
                            className="object-cover w-32 h-32 border-4 border-white rounded-full shadow-lg"
                        />
                    ) : (
                        <div className="flex items-center justify-center w-32 h-32 bg-gray-200 rounded-full">
                            <svg
                                className="w-16 h-16 text-gray-400"
                                fill="currentColor"
                                viewBox="0 0 24 24">
                                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112 15c3.183 0 6.135.946 8.546 2.564a3 3 0 013.454 3.429zM18 10a6 6 0 11-12 0 6 6 0 0112 0z" />
                            </svg>
                        </div>
                    )}
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        {user.person?.first_name} {user.person?.last_name}
                    </h1>
                    <p className="text-lg font-medium">
                        {user.email || 'Lic. en Administración de Negocios'}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-7 lg:grid-cols-3">
                {/* Columna Izquierda */}
                <div className="space-y-6 lg:col-span-1 sm:col-span-2">
                    {/* Datos de Contacto */}
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h2 className="flex items-center text-xl font-semibold mb-4 text-[#004b9a]">
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="currentColor"
                                viewBox="0 0 24 24">
                                <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
                                <path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586z" />
                            </svg>
                            Información de Contacto
                        </h2>
                        <ul className="space-y-3">
                            <li className="flex items-center">
                                <IdCard
                                    size={20}
                                    className="mr-2 text-gray-600"></IdCard>
                                {user.person?.identification_type}
                                {' - '}
                                {user.person.identification_value}
                            </li>
                            <li className="flex items-center">
                                <svg
                                    className="w-4 h-4 mr-2 text-gray-600"
                                    fill="currentColor"
                                    viewBox="0 0 24 24">
                                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z" />
                                </svg>
                                {user.person.email}
                            </li>
                            <li className="flex items-center">
                                <svg
                                    className="w-4 h-4 mr-2 text-gray-600"
                                    fill="currentColor"
                                    viewBox="0 0 24 24">
                                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                                </svg>
                                {user.person?.phone || 'N/A'}
                            </li>
                            <li className="flex items-center">
                                <svg
                                    className="w-4 h-4 mr-2 text-gray-600"
                                    fill="currentColor"
                                    viewBox="0 0 24 24">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                </svg>
                                {user.person?.country || 'Pacora Montemadero'}
                            </li>
                        </ul>
                    </div>

                    {/* Competencias Clave - Estilo Mejorado */}
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h2 className="flex items-center text-xl font-semibold mb-4 text-[#004b9a]">
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="currentColor"
                                viewBox="0 0 24 24">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                            Competencias Clave
                        </h2>
                        <div className="space-y-4">
                            {user.person?.competencies &&
                            typeof user.person.competencies === 'object' ? (
                                Object.values(user.person.competencies).map(
                                    (comp, index) => (
                                        <div key={index} className="space-y-2">
                                            <h3 className="font-medium text-gray-800">
                                                {comp.document_name}
                                            </h3>
                                            <ul className="pl-5 space-y-1 text-sm text-gray-600 list-none">
                                                {comp.skills.map(
                                                    (skill, skillIndex) => (
                                                        <li
                                                            key={skillIndex}
                                                            className="relative before:content-['•'] before:absolute before:-left-4 before:text-[#004b9a] before:font-bold">
                                                            {skill}
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </div>
                                    ),
                                )
                            ) : (
                                <p className="text-sm text-gray-500">
                                    No hay competencias registradas
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Idiomas - Actualizado */}
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h2 className="flex items-center text-xl font-semibold mb-4 text-[#004b9a]">
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="currentColor"
                                viewBox="0 0 24 24">
                                <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" />
                            </svg>
                            Idiomas
                        </h2>
                        <div className="space-y-2">
                            {user.person?.languages &&
                            typeof user.person.languages === 'object' ? (
                                Object.values(user.person.languages).map(
                                    (lang, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between">
                                            <span>{lang.document_name}</span>
                                            <span className="text-gray-600">
                                                {lang.level}
                                            </span>
                                        </div>
                                    ),
                                )
                            ) : (
                                <p className="text-gray-600">
                                    No hay idiomas registrados
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Datos de Contacto */}
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h2 className="flex items-center text-xl font-semibold mb-4 text-[#004b9a]">
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="currentColor"
                                viewBox="0 0 24 24">
                                <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
                                <path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586z" />
                            </svg>
                            Otros
                        </h2>
                        <ul className="space-y-3">
                            <li className="flex items-center">
                                <Cake
                                    size={20}
                                    className="mr-2 text-gray-600"></Cake>
                                {user.person?.birth_date}
                            </li>
                            <li className="flex items-center">
                                <Captions
                                    size={20}
                                    className="mr-2 text-gray-600"></Captions>
                                {user.person?.gender}
                            </li>
                            <li className="flex items-center">
                                <HeartHandshake
                                    size={20}
                                    className="mr-2 text-gray-600"></HeartHandshake>
                                {user.person?.ethnicity}
                            </li>
                            <li className="flex items-center">
                                <NotebookPen
                                    size={20}
                                    className="mr-2 text-gray-600"></NotebookPen>
                                {user.person?.marital_status}
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Columna Derecha */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Resumen Profesional */}
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4 text-[#004b9a] border-l-4 pl-3 border-[#004b9a]">
                            Resumen Profesional
                        </h2>
                        <p className="leading-relaxed text-gray-600">
                            {user.person?.summary || 'Pacora Montemadero'}
                        </p>
                    </div>

                    {/* Experiencia Laboral - Estilo mejorado */}
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4 text-[#004b9a] border-l-4 pl-3 border-[#004b9a]">
                            Experiencia Laboral
                        </h2>
                        <div className="space-y-4">
                            {user.person?.recent_jobs &&
                            typeof user.person.recent_jobs === 'object' &&
                            user.person.recent_jobs !==
                                'No hay información de empleos' ? (
                                Object.values(user.person.recent_jobs).map(
                                    (job, index) => (
                                        <div
                                            key={index}
                                            className="border-l-2 pl-4 border-[#004b9a]">
                                            {/* Encabezado del trabajo */}
                                            <div className="mb-2">
                                                <h3 className="text-lg font-semibold text-gray-800">
                                                    {job.position}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {job.document_name} |{' '}
                                                    {job.company_name}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {new Date(
                                                        job.issue_date,
                                                    ).toLocaleDateString()}{' '}
                                                    -{' '}
                                                    {job.expiration_date
                                                        ? new Date(
                                                              job.expiration_date,
                                                          ).toLocaleDateString()
                                                        : 'Presente'}
                                                </p>
                                            </div>

                                            {/* Lista de responsabilidades con estilo especial */}
                                            {job.responsibilities && (
                                                <div className="mt-3">
                                                    <p className="text-sm font-medium text-[#004b9a] mb-2">
                                                        Responsabilidades:
                                                    </p>
                                                    <ul className="pl-5 space-y-2 text-sm text-gray-600 list-none text-[12px]">
                                                        {job.responsibilities
                                                            .split('\n')
                                                            .map(
                                                                (
                                                                    responsibility,
                                                                    idx,
                                                                ) => (
                                                                    <li
                                                                        key={
                                                                            idx
                                                                        }
                                                                        className="relative text-[12px] before:content-['•'] before:absolute before:-left-4 before:text-[#004b9a] before:font-bold">
                                                                        {
                                                                            responsibility
                                                                        }
                                                                    </li>
                                                                ),
                                                            )}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    ),
                                )
                            ) : (
                                <p className="text-sm text-gray-500">
                                    No hay información de empleos
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Formación Académica - Corregido */}
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4 text-[#004b9a] border-l-4 pl-3 border-[#004b9a]">
                            Formación Académica
                        </h2>
                        <div className="space-y-4">
                            {user.person?.recent_studies &&
                            typeof user.person.recent_studies === 'object' &&
                            user.person.recent_studies !==
                                'No hay información de estudios' ? (
                                Object.values(user.person.recent_studies).map(
                                    (study, index) => (
                                        <div
                                            key={index}
                                            className="border-l-2 pl-4 border-[#004b9a]">
                                            <h3 className="text-lg font-semibold">
                                                {study.document_name}
                                            </h3>
                                            <p className="text-sm font-medium text-gray-600">
                                                {study.institution} |{' '}
                                                {study.degree} |{' '}
                                                {new Date(
                                                    study.issue_date,
                                                ).toLocaleDateString()}{' '}
                                                a{' '}
                                                {study.expiration_date
                                                    ? new Date(
                                                          study.expiration_date,
                                                      ).toLocaleDateString()
                                                    : 'Presente'}
                                            </p>
                                        </div>
                                    ),
                                )
                            ) : (
                                <p className="text-gray-600">
                                    No hay información de estudios
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Formación Académica - Corregido */}
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4 text-[#004b9a] border-l-4 pl-3 border-[#004b9a]">
                            Cursos
                        </h2>
                        <div className="space-y-4">
                            {user.person?.recent_courses &&
                            typeof user.person.recent_courses === 'object' &&
                            user.person.recent_courses !==
                                'No hay información de estudios' ? (
                                Object.values(user.person.recent_courses).map(
                                    (curse, index) => (
                                        <div
                                            key={index}
                                            className="border-l-2 pl-4 border-[#004b9a]">
                                            <h3 className="text-lg font-semibold">
                                                {curse.document_name}
                                            </h3>
                                            <p className="text-sm font-medium text-gray-600">
                                                {curse.hours} |{' '}
                                                {curse.instructor} |{' '}
                                                {new Date(
                                                    curse.issue_date,
                                                ).toLocaleDateString()}{' '}
                                                a{' '}
                                                {curse.expiration_date
                                                    ? new Date(
                                                          curse.expiration_date,
                                                      ).toLocaleDateString()
                                                    : 'Presente'}
                                            </p>
                                        </div>
                                    ),
                                )
                            ) : (
                                <p className="text-gray-600">
                                    No hay información de estudios
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmployeeProfile
