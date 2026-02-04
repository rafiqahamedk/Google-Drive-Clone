import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { Star } from 'lucide-react';

// Components
import Header from '../components/Dashboard/Header';
import Sidebar from '../components/Dashboard/Sidebar';
import FileGrid from '../components/Dashboard/FileGrid';
import FolderGrid from '../components/Dashboard/FolderGrid';
import CreateFolderModal from '../components/Dashboard/CreateFolderModal';
import ContextMenu from '../components/Dashboard/ContextMenu';

// Services
import fileService from '../services/fileService';
import folderService from '../services/folderService';

const Starred = () => {
  // State
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);

  // Load starred data
  const loadStarredData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load starred files and folders in parallel
      const [filesResponse, foldersResponse] = await Promise.all([
        fileService.getStarredFiles(1, 100, searchQuery),
        folderService.getStarredFolders(1, 100, searchQuery)
      ]);

      setFiles(filesResponse.data.files);
      setFolders(foldersResponse.data.folders);
    } catch (error) {
      console.error('Error loading starred data:', error);
      toast.error('Failed to load starred items');
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    loadStarredData();
  }, [loadStarredData]);

  // Folder operations
  const handleCreateFolder = async (name) => {
    try {
      await folderService.createFolder(name, null);
      toast.success('Folder created successfully');
      loadStarredData();
      setShowCreateFolder(false);
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('Failed to create folder');
    }
  };

  const handleDeleteFolder = async (folderId) => {
    try {
      await folderService.deleteFolder(folderId);
      toast.success('Folder deleted successfully');
      loadStarredData();
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast.error('Failed to delete folder');
    }
  };

  const handleRenameFolder = async (folderId, newName) => {
    try {
      await folderService.renameFolder(folderId, newName);
      toast.success('Folder renamed successfully');
      loadStarredData();
    } catch (error) {
      console.error('Error renaming folder:', error);
      toast.error('Failed to rename folder');
    }
  };

  const handleToggleStarFolder = async (folderId) => {
    try {
      await folderService.toggleStarFolder(folderId);
      toast.success('Folder updated successfully');
      loadStarredData();
    } catch (error) {
      console.error('Error updating folder:', error);
      toast.error('Failed to update folder');
    }
  };

  // File operations
  const handleDeleteFile = async (fileId) => {
    try {
      await fileService.deleteFile(fileId);
      toast.success('File deleted successfully');
      loadStarredData();
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
    }
  };

  const handleRenameFile = async (fileId, newName) => {
    try {
      await fileService.renameFile(fileId, newName);
      toast.success('File renamed successfully');
      loadStarredData();
    } catch (error) {
      console.error('Error renaming file:', error);
      toast.error('Failed to rename file');
    }
  };

  const handleDownloadFile = async (fileId) => {
    try {
      await fileService.downloadFile(fileId);
      toast.success('Download started');
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };

  const handleToggleStarFile = async (fileId) => {
    try {
      await fileService.toggleStarFile(fileId);
      toast.success('File updated successfully');
      loadStarredData();
    } catch (error) {
      console.error('Error updating file:', error);
      toast.error('Failed to update file');
    }
  };

  // Selection handlers
  const handleSelectItem = (id, type) => {
    const itemId = `${type}-${id}`;
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(item => item !== itemId)
        : [...prev, itemId]
    );
  };

  const handleClearSelection = () => {
    setSelectedItems([]);
  };

  // Context menu handlers
  const handleContextMenu = (e, item, type) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item,
      type
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  // Search handler
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <>
      <Helmet>
        <title>Starred - Google Drive Clone</title>
        <meta name="description" content="View your starred files and folders" />
      </Helmet>

      <div className="min-h-screen bg-gray-50" onClick={handleCloseContextMenu}>
        <Header 
          onSearch={handleSearch}
          searchQuery={searchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
        
        <div className="flex">
          <Sidebar 
            onCreateFolder={() => setShowCreateFolder(true)}
          />
          
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              {/* Page Header */}
              <div className="mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Starred</h1>
                    <p className="text-gray-600">Items you've starred for quick access</p>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="mt-6">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="spinner w-8 h-8"></div>
                    <span className="ml-2 text-gray-600">Loading starred items...</span>
                  </div>
                ) : (
                  <>
                    {/* Selection Info */}
                    {selectedItems.length > 0 && (
                      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                        <span className="text-sm text-blue-700">
                          {selectedItems.length} item(s) selected
                        </span>
                        <button
                          onClick={handleClearSelection}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Clear selection
                        </button>
                      </div>
                    )}

                    {/* Folders */}
                    {folders.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Starred Folders</h3>
                        <FolderGrid
                          folders={folders}
                          selectedItems={selectedItems}
                          onSelectItem={handleSelectItem}
                          onContextMenu={handleContextMenu}
                          onDelete={handleDeleteFolder}
                          onRename={handleRenameFolder}
                          onToggleStar={handleToggleStarFolder}
                          viewMode={viewMode}
                          showStarred={true}
                        />
                      </div>
                    )}

                    {/* Files */}
                    {files.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Starred Files</h3>
                        <FileGrid
                          files={files}
                          selectedItems={selectedItems}
                          onSelectItem={handleSelectItem}
                          onContextMenu={handleContextMenu}
                          onDelete={handleDeleteFile}
                          onRename={handleRenameFile}
                          onDownload={handleDownloadFile}
                          onToggleStar={handleToggleStarFile}
                          viewMode={viewMode}
                          showStarred={true}
                        />
                      </div>
                    )}

                    {/* Empty State */}
                    {folders.length === 0 && files.length === 0 && !searchQuery && (
                      <div className="text-center py-16">
                        <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 mb-6">
                          <Star className="h-10 w-10 text-yellow-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">No starred items yet</h3>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                          Star files and folders to find them quickly here. Just right-click on any item and select "Add to starred".
                        </p>
                        
                        <button
                          onClick={() => window.history.back()}
                          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-google-blue to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                        >
                          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                          </svg>
                          Go Back to My Drive
                        </button>
                      </div>
                    )}

                    {/* Search Empty State */}
                    {folders.length === 0 && files.length === 0 && searchQuery && (
                      <div className="text-center py-12">
                        <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                          <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                        <p className="text-gray-500">Try adjusting your search terms</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </main>
        </div>

        {/* Modals */}
        {showCreateFolder && (
          <CreateFolderModal
            onClose={() => setShowCreateFolder(false)}
            onCreateFolder={handleCreateFolder}
          />
        )}

        {/* Context Menu */}
        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            item={contextMenu.item}
            type={contextMenu.type}
            onClose={handleCloseContextMenu}
            onDelete={contextMenu.type === 'folder' ? handleDeleteFolder : handleDeleteFile}
            onRename={contextMenu.type === 'folder' ? handleRenameFolder : handleRenameFile}
            onDownload={contextMenu.type === 'file' ? handleDownloadFile : null}
            onToggleStar={contextMenu.type === 'folder' ? handleToggleStarFolder : handleToggleStarFile}
            showStarred={true}
          />
        )}
      </div>
    </>
  );
};

export default Starred;