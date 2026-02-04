import React, { useState, useEffect } from 'react';
import { X, Folder, Plus, AlertCircle } from 'lucide-react';

const CreateFolderModal = ({ onClose, onCreateFolder }) => {
  const [folderName, setFolderName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Focus on input when modal opens
    const input = document.getElementById('folder-name-input');
    if (input) {
      input.focus();
    }
  }, []);

  const validateFolderName = (name) => {
    if (!name.trim()) {
      return 'Folder name is required';
    }
    if (name.length > 255) {
      return 'Folder name must be less than 255 characters';
    }
    if (/[<>:"/\\|?*]/.test(name)) {
      return 'Folder name contains invalid characters';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateFolderName(folderName);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      await onCreateFolder(folderName.trim());
    } catch (error) {
      console.error('Error creating folder:', error);
      setError('Failed to create folder. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleInputChange = (e) => {
    setFolderName(e.target.value);
    if (error) {
      setError('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-bounce-in"
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-google-blue to-blue-600 rounded-xl">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Create New Folder
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div>
              <label 
                htmlFor="folder-name-input" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Folder Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Folder className={`h-5 w-5 ${error ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <input
                  id="folder-name-input"
                  type="text"
                  value={folderName}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-google-blue focus:border-transparent transition-all duration-200 ${
                    error 
                      ? 'border-red-300 bg-red-50 focus:ring-red-500' 
                      : 'border-gray-300 hover:border-gray-400 focus:border-google-blue'
                  }`}
                  placeholder="Enter folder name"
                  maxLength={255}
                  disabled={isLoading}
                />
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">
                  {folderName.length}/255 characters
                </p>
                {folderName.length > 200 && (
                  <p className="text-xs text-yellow-600">
                    Name is getting long
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-google-blue to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-google-blue disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
              disabled={!folderName.trim() || isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="spinner w-4 h-4"></div>
                  <span>Creating...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Create Folder</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Click outside to close */}
      <div 
        className="absolute inset-0 -z-10" 
        onClick={onClose}
      />
    </div>
  );
};

export default CreateFolderModal;