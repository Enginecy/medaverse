import React from "react";

interface ErrorComponentProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorComponent: React.FC<ErrorComponentProps> = ({ message = "Something went wrong.", onRetry , className}) => {
  return (

    <div className={`flex flex-col items-center justify-center p-8  rounded-lg  animate-fade-in m-auto ${className ?? ""}`}>
      <svg className="w-12 h-12 text-red-400 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
      </svg>
      <h2 className="text-xl font-semibold text-primary-700 mb-2">Error</h2>
      <p className="text-primary-600 mb-4 text-center">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-primary-600 text-white rounded-2xl hover:bg-primary-400 transition-colors shadow"
        >
          Retry
        </button>
      )}
    </div>
  );
};
