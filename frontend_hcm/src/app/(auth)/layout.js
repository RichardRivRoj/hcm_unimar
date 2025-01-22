import Link from 'next/link'
import AuthCard from '@/app/(auth)/AuthCard'
import ApplicationLogo from '@/components/ApplicationLogo'
import Header from './Header'

export const metadata = {
    title: 'Unimar',
}

const Layout = ({ children }) => {
    return (
        <div>
            <Header />
            <div className="antialiased text-gray-900">
                <AuthCard>
                    {children}
                </AuthCard>
            </div>
        </div>
    )
}

export default Layout
