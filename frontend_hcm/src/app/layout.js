import { Montserrat } from 'next/font/google'
import '@/app/global.css'

const montserratFont = Montserrat({
    subsets: ['latin'],
    display: 'swap',
})

const RootLayout = ({ children }) => {
    return (
        <html lang="es" className={montserratFont.className}>
            <body className="antialiased">
                {children}
            </body>
        </html>
    )
}

export const metadata = {
    title: 'Laravel',
}

export default RootLayout
