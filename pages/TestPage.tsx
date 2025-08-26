import React from 'react';

const TestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
          🎉 App is Working!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
          Your "Together Apart" app is successfully running!
        </p>
        <div className="space-y-4">
          <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 dark:text-green-200">✅ React is working</h3>
            <p className="text-green-700 dark:text-green-300 text-sm">Components are rendering correctly</p>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200">✅ Tailwind CSS is working</h3>
            <p className="text-blue-700 dark:text-blue-300 text-sm">Styling is applied correctly</p>
          </div>
          <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-800 dark:text-purple-200">✅ Vite is working</h3>
            <p className="text-purple-700 dark:text-purple-300 text-sm">Development server is running</p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <a 
            href="#/" 
            className="inline-block px-6 py-2 bg-green text-black font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Go to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default TestPage;





