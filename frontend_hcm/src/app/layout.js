import { Montserrat } from 'next/font/google'
import '@/app/global.css'
import { NavigationProvider } from '@/providers/NavigationProvider'

const montserratFont = Montserrat({
    subsets: ['latin'],
    display: 'swap',
})

const RootLayout = ({ children }) => {
    return (
        <html lang="es" className={montserratFont.className}>
            <body className="antialiased">
                <NavigationProvider>{children}</NavigationProvider>
            </body>
        </html>
    )
}

export const metadata = {
    title: 'Inicio',
}

export default RootLayout
