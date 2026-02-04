import React, { useState, useEffect, useCallback } from 'react';
import { X, Folder, Calendar, User, HardDrive, FileText, FolderOpen } from 'lucide-react';
import folderService from '../../services/folderService';
import { formatDistanceToNow } from 'date-fns';

const FolderInfoModal = ({ isOpen, onClose, folder }) => {
  const [folderStats, setFolderStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadFolderStats = useCallback(async () => {
    try {
      setLoading(true);
      const stats = await folderService.getFolderStats(folder.id);
      setFolderStats(stats.data);
    } catch (error) {
      console.error('Error loading folder stats:', error);
      setFolderStats({
        totalItems: 0,
        totalFolders: 0,
        totalFiles: 0,
        totalSize: 0
      });
    } finally {
      setLoading(false);
    }
  }, [folder]);

  useEffect(() => {
    if (isOpen && folder) {
      loadFolderStats();
    }
  }, [isOpen, folder, loadFolderStats]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen || !folder) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Folder className="h-6 w-6 mr-2 text-blue-500" />
            Folder Information
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Folder Icon and Name */}
          <div className="flex items-center mb-6">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <Folder className="h-8 w-8 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{folder.name}</h3>
              <p className="text-sm text-gray-500">{folder.path}</p>
            </div>
          </div>

          {/* Folder Details */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-700">Created</p>
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(folder.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-700">Modified</p>
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(folder.updatedAt), { addSuffix: true })}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-700">Owner</p>
                <p className="text-sm text-gray-500">You</p>
              </div>
            </div>

            {/* Folder Statistics */}
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <div className="spinner w-5 h-5"></div>
                <span className="ml-2 text-sm text-gray-600">Loading statistics...</span>
              </div>
            ) : folderStats && (
              <>
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Contents</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <FolderOpen className="h-4 w-4 text-blue-500 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">{folderStats.totalFolders}</p>
                        <p className="text-xs text-gray-500">Folders</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-green-500 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">{folderStats.totalFiles}</p>
                        <p className="text-xs text-gray-500">Files</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <HardDrive className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Total Size</p>
                    <p className="text-sm text-gray-500">{formatFileSize(folderStats.totalSize)}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">
                    This folder contains <span className="font-medium">{folderStats.totalItems}</span> items
                    {folderStats.totalSize > 0 && (
                      <span> using <span className="font-medium">{formatFileSize(folderStats.totalSize)}</span> of storage</span>
                    )}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-google-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FolderInfoModal;