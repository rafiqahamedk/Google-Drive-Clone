import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';

// Components
import Header from '../components/Dashboard/Header';
import Sidebar from '../components/Dashboard/Sidebar';
import FileUpload from '../components/Dashboard/FileUpload';
import FileGrid from '../components/Dashboard/FileGrid';
import FolderGrid from '../components/Dashboard/FolderGrid';
import Breadcrumb from '../components/Dashboard/Breadcrumb';
import CreateFolderModal from '../components/Dashboard/CreateFolderModal';
import ContextMenu from '../components/Dashboard/ContextMenu';
import MoveModal from '../components/Dashboard/MoveModal';
import CopyModal from '../components/Dashboard/CopyModal';
import FolderInfoModal from '../components/Dashboard/FolderInfoModal';

// Services
import fileService from '../services/fileService';
import folderService from '../services/folderService';

const Dashboard = () => {
  const { folderId } = useParams();
  
  // State
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [showFolderInfo, setShowFolderInfo] = useState(false);
  const [selectedItemForAction, setSelectedItemForAction] = useState(null);

  // Load data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load files and folders in parallel
      const [filesResponse, foldersResponse] = await Promise.all([
        fileService.getFiles(folderId, 1, 100, searchQuery),
        folderService.getFolders(folderId, 1, 100, searchQuery)
      ]);

      setFiles(filesResponse.data.files);
      setFolders(foldersResponse.data.folders);

      // If we're in a specific folder, get its details
      if (folderId) {
        const folderResponse = await folderService.getFolderDetails(folderId);
        setCurrentFolder(folderResponse.data.folder);
      } else {
        setCurrentFolder(null);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load files and folders');
    } finally {
      setLoading(false);
    }
  }, [folderId, searchQuery]);

  const loadBreadcrumb = useCallback(async () => {
    try {
      const response = await folderService.getBreadcrumb(folderId);
      setBreadcrumb(response.data.breadcrumb);
    } catch (error) {
      console.error('Error loading breadcrumb:', error);
    }
  }, [folderId]);

  useEffect(() => {
    loadData();
    if (folderId) {
      loadBreadcrumb();
    } else {
      setBreadcrumb([{ id: null, name: 'My Drive', path: '/' }]);
    }
  }, [loadData, loadBreadcrumb, folderId]);

  // File upload handlers
  const handleFileUpload = async (uploadedFiles, onProgress) => {
    setUploading(true);
    
    try {
      const uploadPromises = uploadedFiles.map((file, index) => 
        fileService.uploadFile(file, folderId, (progress) => {
          if (onProgress) {
            onProgress(index, progress);
          }
        })
      );
      
      const results = await Promise.allSettled(uploadPromises);
      
      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.filter(result => result.status === 'rejected').length;
      
      if (successful > 0) {
        toast.success(`${successful} file(s) uploaded successfully`);
        loadData(); // Refresh the file list
      }
      
      if (failed > 0) {
        toast.error(`${failed} file(s) failed to upload`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // Folder operations
  const handleCreateFolder = async (name) => {
    try {
      await folderService.createFolder(name, folderId);
      toast.success('Folder created successfully');
      loadData();
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
      loadData();
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast.error('Failed to delete folder');
    }
  };

  const handleRenameFolder = async (folderId, newName) => {
    try {
      await folderService.renameFolder(folderId, newName);
      toast.success('Folder renamed successfully');
      loadData();
    } catch (error) {
      console.error('Error renaming folder:', error);
      toast.error('Failed to rename folder');
    }
  };

  // File operations
  const handleDeleteFile = async (fileId) => {
    try {
      await fileService.deleteFile(fileId);
      toast.success('File deleted successfully');
      loadData();
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
    }
  };

  const handleRenameFile = async (fileId, newName) => {
    try {
      await fileService.renameFile(fileId, newName);
      toast.success('File renamed successfully');
      loadData();
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
      loadData();
    } catch (error) {
      console.error('Error updating file:', error);
      toast.error('Failed to update file');
    }
  };

  const handleToggleStarFolder = async (folderId) => {
    try {
      await folderService.toggleStarFolder(folderId);
      toast.success('Folder updated successfully');
      loadData();
    } catch (error) {
      console.error('Error updating folder:', error);
      toast.error('Failed to update folder');
    }
  };

  // Move and Copy handlers
  const handleMoveFile = async (fileId, targetFolderId) => {
    try {
      await fileService.moveFile(fileId, targetFolderId);
      toast.success('File moved successfully');
      loadData();
    } catch (error) {
      console.error('Error moving file:', error);
      toast.error('Failed to move file');
    }
  };

  const handleMoveFolder = async (folderId, targetParentId) => {
    try {
      await folderService.moveFolder(folderId, targetParentId);
      toast.success('Folder moved successfully');
      loadData();
    } catch (error) {
      console.error('Error moving folder:', error);
      toast.error('Failed to move folder');
    }
  };

  const handleCopyFile = async (fileId, targetFolderId, name) => {
    try {
      await fileService.copyFile(fileId, targetFolderId, name);
      toast.success('File copied successfully');
      loadData();
    } catch (error) {
      console.error('Error copying file:', error);
      toast.error('Failed to copy file');
    }
  };

  const handleCopyFolder = async (folderId, targetParentId, name) => {
    try {
      await folderService.copyFolder(folderId, targetParentId, name);
      toast.success('Folder copied successfully');
      loadData();
    } catch (error) {
      console.error('Error copying folder:', error);
      toast.error('Failed to copy folder');
    }
  };

  // Modal handlers
  const handleShowMoveModal = (item) => {
    setSelectedItemForAction(item);
    setShowMoveModal(true);
  };

  const handleShowCopyModal = (item) => {
    setSelectedItemForAction(item);
    setShowCopyModal(true);
  };

  const handleShowFolderInfo = (folder) => {
    setSelectedItemForAction(folder);
    setShowFolderInfo(true);
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

  const pageTitle = currentFolder ? `${currentFolder.name} - Google Drive Clone` : 'My Drive - Google Drive Clone';

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content="Manage your files and folders in Google Drive Clone" />
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
              {/* Breadcrumb */}
              <Breadcrumb breadcrumb={breadcrumb} />
              
              {/* File Upload Area */}
              <FileUpload 
                onFileUpload={handleFileUpload}
                uploading={uploading}
              />
              
              {/* Content */}
              <div className="mt-6">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="spinner w-8 h-8"></div>
                    <span className="ml-2 text-gray-600">Loading...</span>
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
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Folders</h3>
                        <FolderGrid
                          folders={folders}
                          selectedItems={selectedItems}
                          onSelectItem={handleSelectItem}
                          onContextMenu={handleContextMenu}
                          onDelete={handleDeleteFolder}
                          onRename={handleRenameFolder}
                          onToggleStar={handleToggleStarFolder}
                          viewMode={viewMode}
                        />
                      </div>
                    )}

                    {/* Files */}
                    {files.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Files</h3>
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
                        />
                      </div>
                    )}

                    {/* Empty State */}
                    {folders.length === 0 && files.length === 0 && !searchQuery && (
                      <div className="text-center py-16">
                        <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 mb-6">
                          <svg className="h-10 w-10 text-google-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                          </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Welcome to your Drive</h3>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                          Get started by uploading files or creating folders to organize your content
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                          <button
                            onClick={() => document.querySelector('input[type="file"]')?.click()}
                            className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-google-blue to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 min-w-[200px]"
                          >
                            <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Upload Files
                          </button>
                          
                          <button
                            onClick={() => setShowCreateFolder(true)}
                            className="flex items-center justify-center px-8 py-4 bg-white text-google-blue font-semibold rounded-xl border-2 border-google-blue hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 min-w-[200px]"
                          >
                            <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Create Folder
                          </button>
                        </div>
                        
                        <div className="mt-8 text-sm text-gray-500">
                          <p>You can also drag and drop files directly onto this page</p>
                        </div>
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
            onMove={handleShowMoveModal}
            onCopy={handleShowCopyModal}
            onInfo={contextMenu.type === 'folder' ? handleShowFolderInfo : null}
          />
        )}

        {/* Move Modal */}
        {showMoveModal && selectedItemForAction && (
          <MoveModal
            isOpen={showMoveModal}
            onClose={() => {
              setShowMoveModal(false);
              setSelectedItemForAction(null);
            }}
            item={selectedItemForAction}
            type={contextMenu?.type}
            onMove={contextMenu?.type === 'folder' ? handleMoveFolder : handleMoveFile}
          />
        )}

        {/* Copy Modal */}
        {showCopyModal && selectedItemForAction && (
          <CopyModal
            isOpen={showCopyModal}
            onClose={() => {
              setShowCopyModal(false);
              setSelectedItemForAction(null);
            }}
            item={selectedItemForAction}
            type={contextMenu?.type}
            onCopy={contextMenu?.type === 'folder' ? handleCopyFolder : handleCopyFile}
          />
        )}

        {/* Folder Info Modal */}
        {showFolderInfo && selectedItemForAction && (
          <FolderInfoModal
            isOpen={showFolderInfo}
            onClose={() => {
              setShowFolderInfo(false);
              setSelectedItemForAction(null);
            }}
            folder={selectedItemForAction}
          />
        )}
      </div>
    </>
  );
};

export default Dashboard;