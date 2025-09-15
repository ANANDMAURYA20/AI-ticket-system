import React from 'react'

function Loader({ size = "w-6 h-6", text }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <div
        className={`animate-spin rounded-full border-2 border-t-transparent border-blue-500 ${size}`}
      ></div>
      {text && <span>{text}</span>}
    </div>
  );
}

export default Loader;