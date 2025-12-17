// ============================================
// 1. Button.jsx - Reusable Button Component
// ============================================
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false, 
  type = 'button',
  className = '',
  icon: Icon = null,
  loading = false,
  fullWidth = false
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100',
    outline: 'border-2 border-red-600 text-red-600 hover:bg-red-50 disabled:border-red-300',
    danger: 'bg-red-100 text-red-700 hover:bg-red-200 disabled:bg-red-50',
    success: 'bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400',
    ghost: 'text-gray-700 hover:bg-gray-100 disabled:text-gray-400',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className} disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {loading ? (
        <>
          <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full"></div>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && <Icon size={20} />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;