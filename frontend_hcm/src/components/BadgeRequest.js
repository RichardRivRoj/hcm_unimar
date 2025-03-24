import React from 'react'
import cn from 'classnames'

const BadgeRequest = ({ variant = 'default', className, children }) => {
    const variants = {
        default: 'bg-gray-100 text-gray-800',
        pending: 'bg-orange-100 text-orange-800',
        review: 'bg-blue-100 text-blue-800',
        success: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
        processing: 'bg-purple-100 text-purple-800',
        completed: 'bg-teal-100 text-teal-800',
        canceled: 'bg-gray-300 text-gray-800',
        info_required: 'bg-yellow-100 text-yellow-800',
        reopened: 'bg-pink-100 text-pink-800',
        documentation_pending: 'bg-indigo-100 text-indigo-800'
    }

    // Mapeo de estados a variantes
    const statusMap = {
        'Pendiente': 'pending',
        'En Revisión': 'review',
        'Aprobado': 'success',
        'Rechazado': 'rejected',
        'En Proceso': 'processing',
        'Completado': 'completed',
        'Cancelado': 'canceled',
        'Requiere más información': 'info_required',
        'Reabierto': 'reopened',
        'En Espera de Documentación': 'documentation_pending'
    }

    const selectedVariant = statusMap[children] || variants[variant]

    return (
        <span
            className={cn(
                'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                variants[selectedVariant] || variants[variant],
                className
            )}
        >
            {children}
        </span>
    )
}

export default BadgeRequest