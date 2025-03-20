import React from 'react'
import cn from 'classnames'

const Badge = ({ variant = 'default', className, children }) => {
    const variants = {
        default: 'bg-gray-100 text-gray-800',
        success: 'bg-green-100 text-green-800',
        secondary: 'bg-blue-100 text-blue-800',
    }

    return (
        <span
            className={cn(
                'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                variants[variant],
                className
            )}
        >
            {children}
        </span>
    )
}

export default Badge