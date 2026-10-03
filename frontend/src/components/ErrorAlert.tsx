import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onDismiss }) => {
  return (
    <div className="flex items-start justify-between gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-sm shadow-md">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-red-300 block">Operation Failed</span>
          <span className="text-xs md:text-sm text-red-200/90">{message}</span>
        </div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-red-300 p-1 rounded-lg hover:bg-red-500/20 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
