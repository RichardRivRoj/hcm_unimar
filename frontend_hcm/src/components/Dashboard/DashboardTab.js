import cx from 'classnames'

const DashboardTab = ({ children, isActive, onClick, icon }) => {
  return (
    <button
      onClick={onClick}
      className={cx(
        'flex items-center px-4 py-2 text-sm font-medium border-b-2 transition-colors',
        {
          'border-[#004b9a] text-[#004b9a]': isActive,
          'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': !isActive
        }
      )}
    >
      <span className="mr-2">{icon}</span>
      {children}
    </button>
  )
}

export default DashboardTab