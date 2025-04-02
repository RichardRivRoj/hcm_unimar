export const Skeleton = ({ className, lines = 1, ...props }) => {
    if (lines > 1) {
      return (
        <div className={`space-y-2 ${className}`}>
          {[...Array(lines)].map((_, i) => (
            <div
              key={i}
              className="h-4 bg-gray-200 rounded-full animate-pulse"
              style={{ width: `${100 - i * 10}%` }}
            />
          ))}
        </div>
      )
    }
    
    return (
      <div
        className={`animate-pulse bg-gray-200 rounded-lg ${className}`}
        {...props}
      />
    )
  }