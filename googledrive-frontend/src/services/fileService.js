import api from './api';
import fileDownload from 'js-file-download';

class FileService {
  // Upload file
  async uploadFile(file, folderId = null, onProgress = null) {
    const formData = new FormData();
    formData.append('file', file);
    if (folderId) {
      formData.append('folderId', folderId);
    }

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    if (onProgress) {
      config.onUploadProgress = (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      };
    }

    const response = await api.post('/files/upload', formData, config);
    return response.data;
  }

  // Get files
  async getFiles(folderId = null, page = 1, limit = 20, search = '') {
    const params = { page, limit };
    if (folderId) params.folderId = folderId;
    if (search) params.search = search;

    const response = await api.get('/files', { params });
    return response.data;
  }

  // Download file
  async downloadFile(fileId) {
    const response = await api.get(`/files/${fileId}/download`);
    const { downloadUrl, fileName } = response.data.data;
    
    // Download file using the signed URL
    const fileResponse = await fetch(downloadUrl);
    const blob = await fileResponse.blob();
    fileDownload(blob, fileName);
    
    return response.data;
  }

  // Delete file
  async deleteFile(fileId) {
    const response = await api.delete(`/files/${fileId}`);
    return response.data;
  }

  // Rename file
  async renameFile(fileId, name) {
    const response = await api.put(`/files/${fileId}/rename`, { name });
    return response.data;
  }

  // Move file
  async moveFile(fileId, folderId) {
    const response = await api.put(`/files/${fileId}/move`, { folderId });
    return response.data;
  }

  // Get file info
  async getFileInfo(fileId) {
    const response = await api.get(`/files/${fileId}`);
    return response.data;
  }

  // Batch upload files
  async uploadMultipleFiles(files, folderId = null, onProgress = null) {
    const uploadPromises = files.map((file, index) => {
      return this.uploadFile(file, folderId, (progress) => {
        if (onProgress) {
          onProgress(index, progress);
        }
      });
    });

    return Promise.allSettled(uploadPromises);
  }

  // Get file preview URL (for images, videos, etc.)
  async getFilePreview(fileId) {
    const response = await api.get(`/files/${fileId}/preview`);
    return response.data;
  }

  // Search files
  async searchFiles(query, folderId = null) {
    const params = { search: query };
    if (folderId) params.folderId = folderId;

    const response = await api.get('/files', { params });
    return response.data;
  }

  // Star/unstar file
  async toggleStarFile(fileId) {
    const response = await api.put(`/files/${fileId}/star`);
    return response.data;
  }

  // Get starred files
  async getStarredFiles(page = 1, limit = 20, search = '') {
    const params = { page, limit };
    if (search) params.search = search;

    const response = await api.get('/files/starred', { params });
    return response.data;
  }

  // Get trash files
  async getTrashFiles(page = 1, limit = 20, search = '') {
    const params = { page, limit };
    if (search) params.search = search;

    const response = await api.get('/files/trash', { params });
    return response.data;
  }

  // Restore file from trash
  async restoreFile(fileId) {
    const response = await api.put(`/files/${fileId}/restore`);
    return response.data;
  }

  // Permanently delete file
  async permanentDeleteFile(fileId) {
    const response = await api.delete(`/files/${fileId}/permanent`);
    return response.data;
  }

  // Copy file
  async copyFile(fileId, folderId = null, name = null) {
    const response = await api.post(`/files/${fileId}/copy`, { folderId, name });
    return response.data;
  }
}

const fileService = new FileService();
export default fileService;