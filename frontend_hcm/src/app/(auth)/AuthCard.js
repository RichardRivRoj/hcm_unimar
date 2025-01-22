const AuthCard = ({ children }) => (
    <div className="flex flex-col items-center pt-6 bg-white min-h-[100vh] sm:justify-center sm:pt-0">
        {/* Contenedor Azul y el Icono */}
        <div className=" w-full sm:max-w-md h-28 rounded-t-lg bg-[#30669a]">
            {/* Imagen centrada en la parte azul */}
            <div className="absolute transform -translate-x-1/2 -translate-y-1/2 left-1/2">
                <img
                    src="/user.png"
                    alt="User Icon"
                    className="border-4 border-white rounded-full h-28 w-28"
                />
            </div>
            {/* Título debajo de la imagen */}
            <div className="items-baseline pt-20 pb-10 text-center">
                <h2 className="text-xl font-extrabold text-white">
                    Inicio de sesión
                </h2>
            </div>
        </div>

        <div className="w-full px-6 py-4 overflow-hidden bg-white shadow-md sm:max-w-md sm:rounded-b-lg">
            {children}
        </div>
    </div>
)

export default AuthCard
