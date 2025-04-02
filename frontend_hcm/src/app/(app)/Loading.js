const Loading = () => {
    return (
      <div className="flex items-center justify-center w-full min-h-screen bg-gradient-to-br from-blue-400 to-blue-800">
        <div className="text-center">
          {/* Spinner */}
          <div className="w-16 h-16 mx-auto border-4 border-white rounded-full border-t-gray-400 animate-spin" />
          
          {/* Loading text */}
          <h1 className="mt-6 text-2xl font-semibold text-white animate-pulse">
            Cargando...
          </h1>
          
          {/* Subtitle */}
          <p className="mt-2 text-sm text-gray-100">
            Por favor, espera unos segundos
          </p>
        </div>
      </div>
    )
  }
  
  export default Loading
