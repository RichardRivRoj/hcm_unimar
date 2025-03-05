'use client'

import { useAuth } from '@/hooks/auth'
import Navigation from '@/app/(app)/Navigation'
import Loading from '@/app/(app)/Loading'
import PageTitle from './PageTitle'
import { Inter } from 'next/font/google'
import Header from './Header'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

const AppLayout = ({ children }) => {
    const { user } = useAuth({ })

    if (!user) {
        return <Loading />
    }

    return (
        <body className={inter.className}>
            <div className="flex h-screen bg-gray-100">
                {/* Sidebar */}
                <Navigation />

                {/* Main Content Area */}
                <div className="flex flex-col flex-1">
                    {/* Header */}
                    <Header user={user} />

                    {/* Scrollable Main Section */}
                    <main className="flex-1 p-6 px-20 overflow-y-auto">
                        {children}
                    </main>
                </div>
                <Toaster position="top-right" richColors />
            </div>
        </body>
    )
}

export default AppLayout
