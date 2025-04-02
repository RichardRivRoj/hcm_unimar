import AuthCard from '@/app/(auth)/AuthCard'
import Header from './Header'

export const metadata = {
    title: 'Unimar',
}

const Layout = ({ children }) => {
    return (
        <div>
            <Header />
            <div className="antialiased text-gray-900">
                <AuthCard title='Inicio de Sección'>
                    {children}
                </AuthCard>
            </div>
        </div>
    )
}

export default Layout
