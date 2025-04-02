import Image from 'next/image'
import Link from 'next/link'

const Header = () => {
    return (
        <>
            <header className="w-full h-[90px] bg-white flex items-center px-6 border-b-2 shadow-lg">
                <nav className="flex items-center justify-between w-full">
                    {/* Imagen alineada a la izquierda */}
                    <div>
                        <Link href="/">
                            <Image
                                src="/logounimar-22.jpg"
                                alt="unimar22"
                                width={50} // Ajusta según el ancho real de tu imagen
                                height={48} // h-12 = 48px (12 * 4)
                                className="object-cover"
                                style={{
                                    width: 'auto',
                                    height: '48px',
                                }}
                            />
                        </Link>
                    </div>

                    {/* Texto alineado a la derecha */}
                    <div>
                        <ul>
                            <li>
                                <span className="text-lg font-semibold text-gray-800">
                                    Bienvenid@
                                </span>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
        </>
    )
}

export default Header
