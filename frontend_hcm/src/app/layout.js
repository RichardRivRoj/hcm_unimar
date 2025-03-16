import { Montserrat } from 'next/font/google'
import '@/app/global.css'
import { NavigationProvider } from '@/providers/NavigationProvider'
import { Toaster } from 'sonner'

const montserratFont = Montserrat({
    subsets: ['latin'],
    display: 'swap',
})

const RootLayout = ({ children }) => {
    return (
        <html lang="es" className={montserratFont.className}>
            <body className="antialiased">
                <NavigationProvider>
                    <Toaster
                        position="top-right"
                        expand={true}
                        visibleToasts={3}
                        richColors
                        closeButton
                    />

                    {children}
                </NavigationProvider>
            </body>
        </html>
    )
}

export const metadata = {
    title: 'Inicio',
}

export default RootLayout
