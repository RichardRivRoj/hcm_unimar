'use client'

const Filters = ({ filters = [] }) => { // Valor por defecto como array vacío
  return (
    <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3 lg:grid-cols-4">
      {filters.map((filter, index) => (
        <select 
          key={index}
          className="input-filter"
          value={filter.value}
          onChange={filter.onChange}
        >
          {filter.clearable && <option value="">{filter.label}</option>}
          {filter.options?.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ))}
    </div>
  )
}

export default Filters
