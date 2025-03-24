

const EmptyState = ({ title, message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl shadow-sm border border-[#004b9a]/20">
      
      <h3 className="text-xl font-semibold text-[#004b9a] mb-2">{title}</h3>
      <p className="max-w-md mx-auto text-gray-600">{message}</p>
    </div>
  )
}

export default EmptyState