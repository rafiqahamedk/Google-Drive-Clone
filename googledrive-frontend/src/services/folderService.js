import api from './api';

class FolderService {
  // Create folder
  async createFolder(name, parentId = null) {
    const response = await api.post('/folders', { name, parentId });
    return response.data;
  }

  // Get folders
  async getFolders(parentId = null, page = 1, limit = 20, search = '') {
    const params = { page, limit };
    if (parentId) params.parentId = parentId;
    if (search) params.search = search;

    const response = await api.get('/folders', { params });
    return response.data;
  }

  // Get folder details with contents
  async getFolderDetails(folderId) {
    const response = await api.get(`/folders/${folderId}`);
    return response.data;
  }

  // Delete folder
  async deleteFolder(folderId) {
    const response = await api.delete(`/folders/${folderId}`);
    return response.data;
  }

  // Rename folder
  async renameFolder(folderId, name) {
    const response = await api.put(`/folders/${folderId}/rename`, { name });
    return response.data;
  }

  // Move folder
  async moveFolder(folderId, parentId) {
    const response = await api.put(`/folders/${folderId}/move`, { parentId });
    return response.data;
  }

  // Get breadcrumb path
  async getBreadcrumb(folderId) {
    const response = await api.get(`/folders/breadcrumb/${folderId}`);
    return response.data;
  }

  // Get folder tree (for navigation)
  async getFolderTree(parentId = null) {
    const response = await api.get('/folders', { 
      params: { parentId, limit: 1000 } // Get all folders for tree
    });
    return response.data;
  }

  // Search folders
  async searchFolders(query, parentId = null) {
    const params = { search: query };
    if (parentId) params.parentId = parentId;

    const response = await api.get('/folders', { params });
    return response.data;
  }

  // Star/unstar folder
  async toggleStarFolder(folderId) {
    const response = await api.put(`/folders/${folderId}/star`);
    return response.data;
  }

  // Get starred folders
  async getStarredFolders(page = 1, limit = 20, search = '') {
    const params = { page, limit };
    if (search) params.search = search;

    const response = await api.get('/folders/starred', { params });
    return response.data;
  }

  // Get trash folders
  async getTrashFolders(page = 1, limit = 20, search = '') {
    const params = { page, limit };
    if (search) params.search = search;

    const response = await api.get('/folders/trash', { params });
    return response.data;
  }

  // Restore folder from trash
  async restoreFolder(folderId) {
    const response = await api.put(`/folders/${folderId}/restore`);
    return response.data;
  }

  // Permanently delete folder
  async permanentDeleteFolder(folderId) {
    const response = await api.delete(`/folders/${folderId}/permanent`);
    return response.data;
  }

  // Copy folder
  async copyFolder(folderId, parentId = null, name = null) {
    const response = await api.post(`/folders/${folderId}/copy`, { parentId, name });
    return response.data;
  }

  // Get folder statistics
  async getFolderStats(folderId) {
    try {
      const response = await api.get(`/folders/${folderId}/stats`);
      return response.data;
    } catch (error) {
      // If stats endpoint doesn't exist, calculate from folder contents
      const folderData = await this.getFolderDetails(folderId);
      const { folders, files } = folderData.data.contents;
      
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      const totalItems = folders.length + files.length;
      
      return {
        success: true,
        data: {
          totalItems,
          totalFolders: folders.length,
          totalFiles: files.length,
          totalSize
        }
      };
    }
  }

  // Check if folder name exists in parent
  async checkFolderNameExists(name, parentId = null) {
    try {
      const response = await api.get('/folders', {
        params: { parentId, search: name, limit: 1 }
      });
      
      const folders = response.data.data.folders;
      return folders.some(folder => 
        folder.name.toLowerCase() === name.toLowerCase()
      );
    } catch (error) {
      return false;
    }
  }
}

const folderService = new FolderService();
export default folderService;