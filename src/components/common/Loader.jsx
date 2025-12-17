// ============================================
// 5. Loader.jsx - Loading Spinner
// ============================================
const Loader = ({ size = 'md', fullScreen = false, text = '' }) => {
  const sizes = {
    sm: 'h-8 w-8 border-2',
    md: 'h-12 w-12 border-3',
    lg: 'h-16 w-16 border-4',
  };

  const loader = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizes[size]} border-red-600 border-t-transparent rounded-full animate-spin`}
      ></div>
      {text && <p className="text-gray-600 text-sm font-medium">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        {loader}
      </div>
    );
  }

  return loader;
};

export default Loader;