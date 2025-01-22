'use client'

import Button from '@/components/Button'
import { useAuth } from '@/hooks/auth'
import { useState } from 'react'

const Page = () => {
    const { logout, resendEmailVerification } = useAuth({
        middleware: 'auth',
        redirectIfAuthenticated: '/profile',
    })

    const [status, setStatus] = useState(null)

    return (
        <>
            <div className="mb-4 text-sm text-gray-600">
                Thanks for signing up! Before getting started, could you verify
                your email address by clicking on the link we just
                emailed to you? If you didn't receive the email, we will gladly
                send you another.
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    A new verification link has been sent to the email address
                    you provided during registration.
                </div>
            )}

            <div className="flex items-center justify-between mt-4">
                <Button onClick={() => resendEmailVerification({ setStatus })}>
                    Resend Verification Email
                </Button>

                <button
                    type="button"
                    className="text-sm text-gray-600 underline hover:text-gray-900"
                    onClick={logout}>
                    Logout
                </button>
            </div>
        </>
    )
}

export default Page
