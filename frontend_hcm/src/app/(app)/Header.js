'use client'

import Dropdown from '@/components/Dropdown'
import { DropdownButton } from '@/components/DropdownLink'
import { ResponsiveNavButton } from '@/components/ResponsiveNavLink'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import { useState } from 'react'
import { Bell } from 'lucide-react'

const Header = ({ user }) => {
    const { logout } = useAuth()

    const [openNotifications, setOpenNotifications] = useState(false)

    return (
        <header className="bg-white border-b border-gray-100">
            {/* Primary Navigation Menu */}
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        {/* Logo */}
                        <div className="flex items-center flex-shrink-0">
                            <Link href="/">
                                <img
                                    src="/logounimar-22.jpg"
                                    alt="unimar"
                                    className="object-contain w-auto h-10"
                                />
                            </Link>
                        </div>
                    </div>

                    {/* Settings Dropdown and Notifications */}
                    <div className="flex items-center space-x-4">
                        {/* Notifications Icon */}
                        <button
                            onClick={() =>
                                setOpenNotifications(!openNotifications)
                            }
                            className="relative flex items-center p-2 text-gray-500 transition duration-150 ease-in-out rounded-full hover:bg-gray-100 focus:outline-none">
                            <Bell className="w-6 h-6" />
                            {/* Notification Badge (Example) */}
                            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full ring-2 ring-white"></span>
                        </button>

                        {/* Settings Dropdown */}
                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            <Dropdown
                                align="right"
                                width="48"
                                trigger={
                                    <button className="flex items-center text-sm font-medium text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none">
                                        <div>{user?.name}</div>

                                        <div className="ml-1">
                                            <svg
                                                className="w-4 h-4 fill-current"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    </button>
                                }>
                                {/* Authentication */}
                                <DropdownButton onClick={'/profile'}>
                                    Perfil
                                </DropdownButton>
                                <DropdownButton onClick={logout}>
                                    Cerrar Sesión
                                </DropdownButton>
                            </Dropdown>
                        </div>

                        {/* Hamburger */}
                        <div className="flex items-center -mr-2 sm:hidden">
                            <button
                                onClick={() => setOpen(open => !open)}
                                className="inline-flex items-center justify-center p-2 text-gray-400 transition duration-150 ease-in-out rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500">
                                <svg
                                    className="w-6 h-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24">
                                    {open ? (
                                        <path
                                            className="inline-flex"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    ) : (
                                        <path
                                            className="inline-flex"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notifications Sidebar */}
            {openNotifications && (
                <aside className="fixed top-0 right-0 z-50 h-full bg-white shadow-lg w-80">
                    <div className="flex items-center justify-between p-4 border-b">
                        <h2 className="text-lg font-semibold text-gray-700">
                            Notificaciones
                        </h2>
                        <button
                            onClick={() => setOpenNotifications(false)}
                            className="text-gray-500 hover:text-gray-700">
                            ✕
                        </button>
                    </div>
                    <div className="p-4 space-y-4">
                        {/* Example notifications */}
                        <div className="p-3 rounded-md shadow bg-gray-50">
                            <p className="text-sm text-gray-600">
                                🎉 Has recibido un nuevo mensaje.
                            </p>
                            <span className="text-xs text-gray-400">
                                Hace 5 minutos
                            </span>
                        </div>
                        <div className="p-3 rounded-md shadow bg-gray-50">
                            <p className="text-sm text-gray-600">
                                📢 Se ha actualizado el sistema.
                            </p>
                            <span className="text-xs text-gray-400">
                                Hace 2 horas
                            </span>
                        </div>
                        <div className="p-3 rounded-md shadow bg-gray-50">
                            <p className="text-sm text-gray-600">
                                ✅ Tu tarea ha sido aprobada.
                            </p>
                            <span className="text-xs text-gray-400">
                                Hace 1 día
                            </span>
                        </div>
                    </div>
                </aside>
            )}

            {/* Responsive Navigation Menu */}
            {open && (
                <div className="block sm:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                    </div>

                    {/* Responsive Settings Options */}
                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="flex items-center px-4">
                            <div className="flex-shrink-0">
                                <svg
                                    className="w-10 h-10 text-gray-400 fill-current"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                            </div>

                            <div className="ml-3">
                                <div className="text-base font-medium text-gray-800">
                                    {user?.name}
                                </div>
                                <div className="text-sm font-medium text-gray-500">
                                    {user?.email}
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            {/* Authentication */}
                            <ResponsiveNavButton onClick={'/profile'}>
                                Perfil
                            </ResponsiveNavButton>
                            <ResponsiveNavButton onClick={logout}>
                                Cerrar Sesión
                            </ResponsiveNavButton>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}

export default Header
