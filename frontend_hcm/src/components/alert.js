export const Alert = ({ variant = 'default', children, ...props }) => {
    const variants = {
      default: 'bg-blue-100 text-blue-800',
      destructive: 'bg-red-100 text-red-800'
    };
  
    return (
      <div
        className={`p-4 rounded-lg ${variants[variant]}`}
        {...props}
      >
        {children}
      </div>
    );
  };
  
  export const AlertDescription = ({ children, className, ...props }) => (
    <p className={`text-sm ${className}`} {...props}>
      {children}
    </p>
  );