
const DetailCard = ({ 
    title, 
    value, 
    items, 
    highlight = false, 
    color = '#004b9a', 
    icon 
  }) => {
    return (
      <div 
        className={`p-4 bg-white rounded-xl transition-all duration-200 ${
          highlight 
            ? 'border-2 shadow-lg' 
            : 'border border-gray-100 shadow-sm hover:shadow-md'
        }`}
        style={{
          borderColor: highlight ? color : '#e5e7eb',
          backgroundColor: highlight ? `${color}10` : 'white'
        }}
      >
        <div className="flex items-start gap-3">
          {icon && (
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${color}15` }}
            >
              {React.cloneElement(icon, {
                className: 'w-5 h-5',
                style: { color: color }
              })}
            </div>
          )}
          
          <div className="flex-1">
            <h3 
              className="mb-2 text-sm font-semibold tracking-wide uppercase"
              style={{ color: highlight ? color : '#6b7280' }}
            >
              {title}
            </h3>
            
            {items ? (
              <div className="space-y-1.5">
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between gap-2">
                    <span className="text-sm text-gray-500">{item.label}</span>
                    <span className="text-sm font-medium text-gray-700">
                      {item.value || '-'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p 
                className={`text-base ${
                  highlight ? 'font-semibold' : 'font-medium'
                }`}
                style={{ color: highlight ? color : '#1f2937' }}
              >
                {value || '-'}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };
  

  
  export default DetailCard;