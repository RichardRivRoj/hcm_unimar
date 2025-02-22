'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/auth'
import { Check, FileText, IdCard, Info, Settings, Shield, UserCog, Users } from 'lucide-react'
import EmployeeProfile from './EmployeeProfile'
import AdminProfile from './AdminProfile'
import SupervisorProfile from './SupervisorProfile'

const Profile = () => {
    const { user, error } = useAuth()

    if (error) return <p className="text-red-500">Error al cargar datos</p>
    if (!user)
        return <div className="text-center text-gray-600">Cargando...</div>

    return (
        <div className="max-w-4xl p-6 mx-auto rounded-lg shadow-md bg-gray-50">
            {/* Sección de Empleado */}
            {user.roles.includes('employee') && (
                <EmployeeProfile user={user}></EmployeeProfile>
            )}

            {/* Sección Administrador */}
            {user.roles.includes('admin') && (
                <AdminProfile user={user}></AdminProfile>
            )}

            {/* Sección Supervisor */}
            {user.roles.includes('supervisor') && (
                <SupervisorProfile user={user}></SupervisorProfile>
            )}
        </div>
    )
}

export default Profile
