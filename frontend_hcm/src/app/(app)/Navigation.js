import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
    LayoutDashboard,
    Users,
    ClipboardList,
    Settings,
    Bell,
    Home,
    FileText,
    Calendar,
    Briefcase,
    Eye,
    ChevronDown,
    ChevronRight,
    Folder,
    Star,
} from 'lucide-react'

const Navigation = () => {
    const { user } = useAuth({ middleware: 'auth' })
    const pathname = usePathname()
    const [openSections, setOpenSections] = useState({})

    if (!user) return null

    const adminLinks = [
        {
            name: 'Dashboard',
            href: '/profile/admin/dashboard',
            icon: LayoutDashboard,
        },
        {
            name: 'Reclutamiento',
            href: '#',
            icon: Users,
            subLinks: [
                {
                    name: 'Publicar Vacantes',
                    href: '/profile/admin/recruitment/job-postings',
                    icon: Folder,
                },
                {
                    name: 'Postulaciones',
                    href: '/profile/admin/recruitment/applications-re',
                    icon: FileText,
                },
                {
                    name: 'Entrevistas',
                    href: '/profile/admin/recruitment/interviews',
                    icon: Calendar,
                },
                {
                    name: 'Evaluaciones',
                    href: '/profile/admin/recruitment/evaluations',
                    icon: Star,
                },
                {
                    name: 'Selección Final',
                    href: '/profile/admin/recruitment/selection',
                    icon: Briefcase,
                },
            ],
        },
        {
            name: 'Capacitación',
            href: '/profile/admin/training',
            icon: ClipboardList,
        },
        { name: 'Evaluación', href: '/profile/admin/evaluate', icon: Eye },
        { name: 'Personal', href: '/profile/admin/personnel', icon: Briefcase },
    ]

    const supervisorLinks = [
        {
            name: 'Reclutamiento',
            href: '#',
            icon: Users,
            subLinks: [
                {
                    name: 'Recomendar Candidatos',
                    href: '/profile/supervisor/recruitment/job-recommendations',
                    icon: Folder,
                },
                {
                    name: 'Revisar Postulaciones',
                    href: '/profile/supervisor/recruitment/review-applications',
                    icon: FileText,
                },
                {
                    name: 'Retroalimentación',
                    href: '/profile/supervisor/recruitment/feedback',
                    icon: Star,
                },
                {
                    name: 'Seguimiento',
                    href: '/profile/supervisor/recruitment/tracking',
                    icon: Calendar,
                },
            ],
        },
        {
            name: 'Supervisión',
            href: '/profile/supervisor/supervision',
            icon: Eye,
        },
        {
            name: 'Evaluaciones',
            href: '/profile/supervisor/evaluations',
            icon: FileText,
        },
    ]

    const employeeLinks = [
        {
            name: 'Tareas',
            href: '/profile/employee/tasks',
            icon: ClipboardList,
        },
    ]

    const accountLinks = [
        { name: 'Inicio', href: '/', icon: Home },
        { name: 'Perfil', href: '/profile', icon: Users },
        { name: 'Configuración', href: '/profile/settings', icon: Settings },
        { name: 'Notificaciones', href: '/profile/notifications', icon: Bell },
    ]

    const sections = [
        {
            name: 'Administrador',
            links: user.roles.includes('admin') ? adminLinks : [],
        },
        {
            name: 'Supervisor',
            links: user.roles.includes('supervisor') ? supervisorLinks : [],
        },
        {
            name: 'Empleado',
            links: user.roles.includes('employee') ? employeeLinks : [],
        },
        {
            name: 'Cuenta',
            links: accountLinks,
        },
    ]

    const toggleSection = sectionName => {
        setOpenSections(prev => ({
            ...prev,
            [sectionName]: !prev[sectionName],
        }))
    }

    return (
        <aside className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-16 group hover:w-64 bg-white shadow-sm transition-all duration-300 z-20 overflow-y-auto scrollbar-none">
            <nav className="flex-1 px-2 mt-8 space-y-6">
                {sections.map((section) => {
                    if (!section.links.length) return null;

                    const isSectionOpen = openSections[section.name] || false;

                    return (
                        <div key={section.name}>
                            {/* Encabezado de la Sección */}
                            <button
                                onClick={() => toggleSection(section.name)}
                                className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50">
                                <span className="flex items-center">
                                    <LayoutDashboard className="w-6 h-6 text-gray-400" />
                                    <span className="ml-4 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                                        {section.name}
                                    </span>
                                </span>
                                <span className="transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                                    {isSectionOpen ? (
                                        <ChevronDown className="w-5 h-5" />
                                    ) : (
                                        <ChevronRight className="w-5 h-5" />
                                    )}
                                </span>
                            </button>

                            {/* Subopciones de la Sección */}
                            {isSectionOpen && (
                                <div className="pl-1 mt-2 space-y-2">
                                    {section.links.map((item) => {
                                        if (item.subLinks) {
                                            return (
                                                <div key={item.name}>
                                                    <button
                                                        onClick={() => toggleSection(item.name)}
                                                        className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50">
                                                        <item.icon className="w-5 h-5 min-w-[1.25rem]" />
                                                        <span className="ml-4 transition-opacity opacity-0 group-hover:opacity-100">
                                                            {item.name}
                                                        </span>
                                                        <ChevronDown className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100" />
                                                    </button>
                                                    {openSections[item.name] && (
                                                        <div className="mt-2 space-y-2">
                                                            {item.subLinks.map((subItem) => {
                                                                const isActive = pathname === subItem.href;
                                                                return (
                                                                    <Link
                                                                        key={subItem.name}
                                                                        href={subItem.href}
                                                                        className={`${
                                                                            isActive
                                                                                ? 'bg-blue-600 text-white'
                                                                                : 'text-gray-600 hover:bg-gray-50'
                                                                        } flex items-center px-3 py-2 text-sm font-medium rounded-md`}>
                                                                        <subItem.icon
                                                                            className={`${
                                                                                isActive
                                                                                    ? 'text-white'
                                                                                    : 'text-gray-400'
                                                                            } w-5 h-5 min-w-[1.25rem]`}
                                                                        />
                                                                        <span className="ml-4 transition-opacity opacity-0 group-hover:opacity-100">
                                                                            {subItem.name}
                                                                        </span>
                                                                    </Link>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        }

                                        const isActive = pathname === item.href;

                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={`${
                                                    isActive
                                                        ? 'bg-blue-600 text-white'
                                                        : 'text-gray-600 hover:bg-gray-50'
                                                } flex items-center px-3 py-2 text-sm font-medium rounded-md`}>
                                                <item.icon
                                                    className={`${
                                                        isActive
                                                            ? 'text-white'
                                                            : 'text-gray-400'
                                                    } w-5 h-5 min-w-[1.25rem]`}
                                                />
                                                <span className="ml-4 transition-opacity opacity-0 group-hover:opacity-100">
                                                    {item.name}
                                                </span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>
        </aside>
    );
}

export default Navigation
