import React from 'react'
import {
    FileText,
    Info,
    Settings,
    UserCog,
    Users,
} from 'lucide-react'

const AdminProfile = () => {
    return (
        <div className="p-6 mb-6 transition-shadow bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#004b9a] flex items-center gap-2">
                    <UserCog className="w-6 h-6" /> {/* Icono de Lucide */}
                    Perfil de Administrador
                </h2>
                <div className="mt-2 w-12 h-1 bg-[#004b9a] rounded-full" />
            </div>

            {/* Contenido básico y predeterminado */}
            <div className="space-y-4">
                {/* Información básica */}
                <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-[#004b9a]">
                    <h3 className="flex items-center gap-2 mb-2 text-lg font-semibold text-gray-700">
                        <Info className="w-5 h-5 text-[#004b9a]" />{' '}
                        {/* Icono de Lucide */}
                        Información Básica
                    </h3>
                    <div className="space-y-1.5 text-gray-600">
                        <p>
                            <strong>Nombre:</strong> Administrador del Sistema
                        </p>
                        <p>
                            <strong>Rol:</strong> Administrador Global
                        </p>
                        <p>
                            <strong>Descripción:</strong> Encargado de gestionar
                            y supervisar todos los aspectos del sistema.
                        </p>
                    </div>
                </div>

              

                {/* Acciones rápidas (opcional) */}
                <div className="p-4 rounded-lg bg-gray-50">
                    <h3 className="flex items-center gap-2 mb-3 text-lg font-semibold text-gray-700">
                        <Settings className="w-5 h-5 text-[#004b9a]" />{' '}
                        {/* Icono de Lucide */}
                        Acciones Rápidas
                    </h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <button className="p-3 bg-white rounded-lg border border-gray-200 hover:border-[#004b9a] hover:shadow-md transition-all flex items-center gap-2">
                            <Users className="w-5 h-5 text-[#004b9a]" />{' '}
                            {/* Icono de Lucide */}
                            <span className="text-gray-700">
                                Gestionar Usuarios
                            </span>
                        </button>
                        <button className="p-3 bg-white rounded-lg border border-gray-200 hover:border-[#004b9a] hover:shadow-md transition-all flex items-center gap-2">
                            <FileText className="w-5 h-5 text-[#004b9a]" />{' '}
                            {/* Icono de Lucide */}
                            <span className="text-gray-700">Ver Reportes</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminProfile
