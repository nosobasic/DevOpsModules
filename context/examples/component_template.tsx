import React from 'react';
import { motion } from 'framer-motion';

/**
 * Example Component Template
 * 
 * This file demonstrates the pattern for creating new React components in the system.
 * Components should be functional, use hooks for state, and follow the existing styling patterns.
 */

interface ExampleComponentProps {
  title: string;
  data?: any;
  onAction?: (data: any) => void;
  isLoading?: boolean;
}

export const ExampleComponent: React.FC<ExampleComponentProps> = ({
  title,
  data,
  onAction,
  isLoading = false
}) => {
  // Example state management
  const [localState, setLocalState] = React.useState<string>('');

  // Example effect
  React.useEffect(() => {
    if (data) {
      setLocalState(data.someProperty || '');
    }
  }, [data]);

  // Example handler
  const handleClick = () => {
    if (onAction) {
      onAction({ action: 'clicked', timestamp: new Date() });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center space-x-2">
          {/* Example status indicator */}
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Example data display */}
            <div className="bg-gray-50 rounded-md p-4">
              <p className="text-sm text-gray-600 mb-2">Current State:</p>
              <p className="text-gray-900 font-medium">{localState || 'No data'}</p>
            </div>

            {/* Example action button */}
            <button
              onClick={handleClick}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
            >
              Perform Action
            </button>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </motion.div>
  );
};

// Example usage:
// <ExampleComponent
//   title="Example Component"
//   data={{ someProperty: "example value" }}
//   onAction={(data) => console.log('Action performed:', data)}
//   isLoading={false}
// /> 