'use client'

import Dropdown from '@/components/Dropdown'
import { DropdownButton } from '@/components/DropdownLink'
import { ResponsiveNavButton } from '@/components/ResponsiveNavLink'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import { Bell } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns'
import axios from '@/lib/axios'
import Loader from '@/components/Loader'

const Header = ({ user }) => {
    const { logout } = useAuth()

    const [openNotifications, setOpenNotifications] = useState(false)
    const router = useRouter()
    const [notifications, setNotifications] = useState([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [hasMorePages, setHasMorePages] = useState(true)
    const [notificationsLoading, setNotificationsLoading] = useState(false)
    const [notificationsError, setNotificationsError] = useState(null)

    // Cargar notificaciones
    const fetchNotifications = async (page = 1) => {
        try {
            setNotificationsLoading(true)
            const response = await axios.get(`/api/notifications?page=${page}`)

            setNotifications(prev =>
                page === 1
                    ? response.data.data
                    : [...prev, ...response.data.data],
            )
            setUnreadCount(response.data.unread_count)
            setHasMorePages(
                response.data.meta.current_page < response.data.meta.last_page,
            )
            setCurrentPage(response.data.meta.current_page)
        } catch (error) {
            setNotificationsError(error.message)
        } finally {
            setNotificationsLoading(false)
        }
    }

    // Marcar como leída
    const markAsRead = async notificationId => {
        try {
            await axios.put(`/api/notifications/${notificationId}/read`)
            setNotifications(prev =>
                prev.map(n =>
                    n.id === notificationId
                        ? { ...n, read_at: new Date().toISOString() }
                        : n,
                ),
            )
            setUnreadCount(prev => prev - 1)
        } catch (error) {
            console.error('Error marking as read:', error)
        }
    }

    // Manejar clic en notificación
    const handleNotificationClick = notification => {
        if (!notification.read_at) {
            markAsRead(notification.id)
        }
        // Lógica adicional para redirección
        if (notification.metadata?.request_id) {
            router.push(`/requests/${notification.metadata.request_id}`)
        }
    }

    // Cargar más notificaciones
    const loadMoreNotifications = () => {
        fetchNotifications(currentPage + 1)
    }

    useEffect(() => {
        if (openNotifications) {
            fetchNotifications()
        }
    }, [openNotifications])

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
                                        {user.roles.includes('supervisor') &&
                                        user.department ? (
                                            <div>{user.department.name}</div>
                                        ) : (
                                            <div>
                                                {user.person?.first_name}{' '}
                                                {user.person?.last_name}
                                            </div>
                                        )}

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
                                <Link href="/profile">
                                    <DropdownButton onClick={'/profile'}>
                                        Perfil
                                    </DropdownButton>
                                </Link>
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
                <aside className="fixed top-0 right-0 z-50 h-full max-h-screen overflow-y-auto bg-white shadow-lg w-80 scrollbar-none">
                    <div className="flex items-center justify-between p-4 border-b">
                        <h2 className="text-lg font-semibold text-gray-700">
                            Notificaciones
                            {unreadCount > 0 && (
                                <span className="px-2 py-1 ml-2 text-xs font-medium text-white bg-red-500 rounded-full">
                                    {unreadCount}
                                </span>
                            )}
                        </h2>
                        <button
                            onClick={() => setOpenNotifications(false)}
                            className="text-gray-500 hover:text-gray-700">
                            ✕
                        </button>
                    </div>

                    <div className="p-4 space-y-4">
                        {notificationsLoading ? (
                            <div className="flex justify-center">
                                <Loader className="w-6 h-6 animate-spin" />
                            </div>
                        ) : notificationsError ? (
                            <div className="p-2 text-center text-red-500">
                                Error cargando notificaciones
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-2 text-center text-gray-500">
                                No hay notificaciones nuevas
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className={`p-3 rounded-md shadow cursor-pointer transition-colors ${
                                        !notification.read_at
                                            ? 'bg-blue-50 border-l-4 border-blue-500'
                                            : 'bg-gray-50'
                                    }`}
                                    onClick={() =>
                                        handleNotificationClick(notification)
                                    }>
                                    <div className="flex items-start gap-2">
                                        <div
                                            className={`mt-1 w-2 h-2 rounded-full ${
                                                !notification.read_at
                                                    ? 'bg-blue-500'
                                                    : 'bg-transparent'
                                            }`}
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span
                                                    className={`text-sm ${
                                                        notification.type ===
                                                        'success'
                                                            ? 'text-green-600'
                                                            : notification.type ===
                                                                'warning'
                                                              ? 'text-yellow-600'
                                                              : notification.type ===
                                                                  'danger'
                                                                ? 'text-red-600'
                                                                : 'text-gray-600'
                                                    }`}>
                                                    {notification.type ===
                                                        'success' && '✅'}
                                                    {notification.type ===
                                                        'danger' && '❌'}
                                                    {notification.type ===
                                                        'warning' && '⚠️'}
                                                </span>
                                                <p className="text-sm font-medium text-gray-700">
                                                    {notification.title}
                                                </p>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                {notification.message}
                                            </p>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-xs text-gray-400">
                                                    {formatDistanceToNow(
                                                        new Date(
                                                            notification.created_at,
                                                        ),
                                                        {
                                                            addSuffix: true,
                                                            locale: es,
                                                        },
                                                    )}
                                                </span>
                                                {notification.metadata
                                                    ?.request_id && (
                                                    <button
                                                        className="text-xs text-blue-600 hover:underline"
                                                        onClick={e => {
                                                            e.stopPropagation()
                                                            router.push(
                                                                `/requests/${notification.metadata.request_id}`,
                                                            )
                                                        }}>
                                                        Ver solicitud
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {hasMorePages && (
                        <div className="p-4 border-t">
                            <button
                                onClick={loadMoreNotifications}
                                className="w-full px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                                disabled={notificationsLoading}>
                                Cargar más notificaciones
                            </button>
                        </div>
                    )}
                </aside>
            )}

            {/* Responsive Navigation Menu */}
            {open && (
                <div className="block sm:hidden">
                    <div className="pt-2 pb-3 space-y-1"></div>

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
                                    {user.person?.first_name}
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
