import React, { useState, useEffect, useCallback } from 'react';
import { X, Folder, ChevronRight, Home, Copy } from 'lucide-react';
import folderService from '../../services/folderService';
import toast from 'react-hot-toast';

const CopyModal = ({ isOpen, onClose, item, type, onCopy }) => {
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [newName, setNewName] = useState('');

  const loadFolders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await folderService.getFolders(currentFolder?.id, 1, 100);
      setFolders(response.data.folders);
      
      if (currentFolder) {
        const breadcrumbResponse = await folderService.getBreadcrumb(currentFolder.id);
        setBreadcrumb(breadcrumbResponse.data.breadcrumb);
      } else {
        setBreadcrumb([{ id: null, name: 'My Drive', path: '/' }]);
      }
    } catch (error) {
      console.error('Error loading folders:', error);
      toast.error('Failed to load folders');
    } finally {
      setLoading(false);
    }
  }, [currentFolder]);

  useEffect(() => {
    if (isOpen) {
      setNewName(`Copy of ${item.name}`);
      loadFolders();
    }
  }, [isOpen, loadFolders, item.name]);

  const handleFolderClick = (folder) => {
    setCurrentFolder(folder);
    setSelectedFolder(null);
  };

  const handleBreadcrumbClick = (breadcrumbItem) => {
    if (breadcrumbItem.id) {
      setCurrentFolder({ id: breadcrumbItem.id, name: breadcrumbItem.name });
    } else {
      setCurrentFolder(null);
    }
    setSelectedFolder(null);
  };

  const handleCopy = async () => {
    if (!newName.trim()) {
      toast.error('Please enter a name for the copy');
      return;
    }

    try {
      const targetFolderId = selectedFolder?.id || currentFolder?.id || null;
      await onCopy(item.id, targetFolderId, newName.trim());
      onClose();
      toast.success(`${type === 'file' ? 'File' : 'Folder'} copied successfully`);
    } catch (error) {
      console.error('Error copying item:', error);
      toast.error(`Failed to copy ${type}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Copy className="h-5 w-5 mr-2 text-google-blue" />
            Copy "{item.name}"
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Name input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue focus:border-transparent"
              placeholder="Enter name for the copy"
            />
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 mb-4 text-sm text-gray-600">
            <span className="font-medium">Copy to:</span>
            {breadcrumb.map((item, index) => (
              <React.Fragment key={item.id || 'root'}>
                <button
                  onClick={() => handleBreadcrumbClick(item)}
                  className="flex items-center hover:text-google-blue transition-colors"
                >
                  {index === 0 ? <Home className="h-4 w-4 mr-1" /> : null}
                  {item.name}
                </button>
                {index < breadcrumb.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Current location option */}
          <div className="mb-4">
            <button
              onClick={() => setSelectedFolder(null)}
              className={`w-full flex items-center p-3 rounded-lg border-2 transition-all ${
                selectedFolder === null
                  ? 'border-google-blue bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Home className="h-5 w-5 mr-3 text-gray-500" />
              <span className="font-medium">
                {currentFolder ? `Copy to "${currentFolder.name}"` : 'Copy to My Drive'}
              </span>
            </button>
          </div>

          {/* Folder list */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="spinner w-6 h-6"></div>
                <span className="ml-2 text-gray-600">Loading folders...</span>
              </div>
            ) : folders.length > 0 ? (
              folders.map((folder) => (
                <div key={folder.id} className="flex items-center">
                  <button
                    onClick={() => setSelectedFolder(folder)}
                    className={`flex-1 flex items-center p-3 rounded-lg border-2 transition-all ${
                      selectedFolder?.id === folder.id
                        ? 'border-google-blue bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Folder className="h-5 w-5 mr-3 text-blue-500" />
                    <span className="font-medium">{folder.name}</span>
                  </button>
                  <button
                    onClick={() => handleFolderClick(folder)}
                    className="ml-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Open folder"
                  >
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No folders in this location
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCopy}
            disabled={!newName.trim()}
            className="px-6 py-2 bg-google-blue text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
};

export default CopyModal;