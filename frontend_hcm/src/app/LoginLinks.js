'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import Image from 'next/image'

const LoginLinks = () => {
    const { user } = useAuth({ middleware: 'guest' })

    return (
        <div className="flex items-center justify-between w-full px-4 py-4 bg-white">
            {/* Social Media Links */}
            <div className="flex justify-center flex-1 space-x-2">
                <Link href="#" className="flex items-center">
                    <Image
                        src="/email.png"
                        alt="Email"
                        width={24}
                        height={24}
                        className="object-contain"
                    />
                </Link>
                <Link href="#" className="flex items-center">
                    <Image
                        src="/facebook.png"
                        alt="Facebook"
                        width={24}
                        height={24}
                        className="object-contain"
                    />
                </Link>
                <Link href="#" className="flex items-center">
                    <Image
                        src="/instagram.png"
                        alt="Instagram"
                        width={24}
                        height={24}
                        className="object-contain"
                    />
                </Link>
                <Link href="#" className="flex items-center">
                    <Image
                        src="/youtube-03.png"
                        alt="YouTube"
                        width={24}
                        height={24}
                        className="object-contain"
                    />
                </Link>
                <Link href="#" className="flex items-center">
                    <Image
                        src="/gorjeo.png"
                        alt="Twitter"
                        width={24}
                        height={24}
                        className="object-contain"
                    />
                </Link>
                <Link href="#" className="flex items-center">
                    <Image
                        src="/linkedin.png"
                        alt="LinkedIn"
                        width={24}
                        height={24}
                        className="object-contain"
                    />
                </Link>
                <Link href="#" className="flex items-center">
                    <Image
                        src="/bank-onlineb.png"
                        alt="Bank"
                        width={24}
                        height={24}
                        className="object-contain"
                    />
                </Link>
            </div>

            {/* User Login/Links */}
            <div className="text-right">
                {user ? (
                    <Link
                        href="/profile"
                        className="ml-4 text-sm text-gray-700 underline dark:text-gray-300">
                        {user.roles.includes('supervisor') &&
                        user.department ? (
                            <div>{user.department.name}</div>
                        ) : (
                            <div>
                                {user.person?.first_name}{' '}
                                {user.person?.last_name}
                            </div>
                        )}
                    </Link>
                ) : (
                    <>
                        <Link
                            href="/login"
                            className="text-sm text-gray-700 underline dark:text-gray-300">
                            Iniciar Sesión
                        </Link>
                    </>
                )}
            </div>
        </div>
    )
}

export default LoginLinks
