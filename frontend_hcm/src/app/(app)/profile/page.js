'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/auth'

const Profile = () => {
    const [employee, setEmployee] = useState(null)
    const { user, error } = useAuth()

    useEffect(() => {
        const mockData = {
            name: 'Juan Pérez',
            position: 'Desarrollador Frontend',
            startDate: '15/02/2020',
            email: 'juan.perez@example.com',
            phone: '+1 555 555 555',
            department: 'Tecnología',
            summary:
                'Desarrollador apasionado con más de 5 años de experiencia en proyectos web y tecnologías modernas.',
            roles: [
                {
                    position: 'Junior Developer',
                    startDate: '15/02/2020',
                    endDate: '01/01/2021',
                },
                {
                    position: 'Mid Developer',
                    startDate: '02/01/2021',
                    endDate: 'Presente',
                },
            ],
            image: '/perfil.png', // Ruta de ejemplo de la imagen
            cvUrl: '/cv-example.pdf', // Ruta de ejemplo para el CV
        }

        // Simulamos un retardo como si fuera una API
        setTimeout(() => setEmployee(mockData), 1000)
    }, [])

    if (error) return <p className="text-red-500">Error al cargar datos</p>
    if (!user) {
        return <div className="text-center text-gray-600">Cargando...</div>
    }

    return (
        <div className="max-w-4xl p-6 mx-auto rounded-lg shadow-md bg-gray-50">
            {/* Header */}
            <div className="flex items-center gap-6 mb-8">
                <div className="h-28 w-28">
                    {/* Imagen de Perfil */}
                    {user.person?.photo_url && (
                        <div className="mt-4">
                            <img
                                src={user.person.photo_url}
                                alt={`${user.person.first_name} ${user.person.last_name}`}
                                className="object-cover border-2 border-gray-100 rounded-lg shadow-sm h-28 w-28"
                            />
                        </div>
                    )}
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        {user.person?.first_name} {user.person?.last_name}
                    </h1>
                    <p className="text-gray-600">{user.person?.birth_date}</p>
                    <p className="text-sm text-gray-500">
                        <span className="font-semibold">{user.email}</span>
                    </p>
                </div>
            </div>

            {/* Datos Personales */}
            <div className="p-6 mb-6 bg-white rounded-lg shadow">
                <h2 className="pb-2 mb-4 text-lg font-semibold text-gray-800 border-b">
                    Datos Personales
                </h2>
                <ul className="space-y-2">
                    <li>
                        <strong className="text-gray-700">Email:</strong>{' '}
                        {user.person.email}
                    </li>
                    <li>
                        <strong className="text-gray-700">Teléfono:</strong>{' '}
                        {user.person?.phone || 'No disponible'}
                    </li>
                    <li>
                        <strong className="text-gray-700">País:</strong>{' '}
                        {user.person?.country || 'No especificado'}
                    </li>
                    <li>
                        <strong className="text-gray-700">Género:</strong>{' '}
                        {user.person?.gender || 'No especificado'}
                    </li>
                    <li>
                        <strong className="text-gray-700">Etnia:</strong>{' '}
                        {user.person?.ethnicity || 'No especificado'}
                    </li>
                    <li>
                        <strong className="text-gray-700">Estado Civil:</strong>{' '}
                        {user.person?.marital_status || 'No especificado'}
                    </li>
                </ul>
            </div>

            {/* Resumen Profesional */}
            <div className="p-6 mb-6 bg-white rounded-lg shadow">
                <h2 className="pb-2 mb-4 text-lg font-semibold text-gray-800 border-b">
                    Resumen Profesional
                </h2>
                <p className="text-gray-600">
                    {user.person?.summary || 'Sin información'}
                </p>
            </div>
        </div>
    )
}

export default Profile
