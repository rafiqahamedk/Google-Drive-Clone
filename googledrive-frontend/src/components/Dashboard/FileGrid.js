import { 
  File, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Archive, 
  Code,
  MoreVertical,
  Download,
  Star
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const FileGrid = ({ 
  files, 
  selectedItems, 
  onSelectItem, 
  onContextMenu, 
  onDownload,
  onDelete,
  onRename,
  onToggleStar,
  onRestore,
  viewMode = 'grid',
  isTrash = false,
  showStarred = false
}) => {

  const getFileIcon = (mimeType) => {
    if (mimeType.startsWith('image/')) return Image;
    if (mimeType.startsWith('video/')) return Video;
    if (mimeType.startsWith('audio/')) return Music;
    if (mimeType.includes('text') || mimeType.includes('document')) return FileText;
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) return Archive;
    if (mimeType.includes('javascript') || mimeType.includes('json') || mimeType.includes('html')) return Code;
    return File;
  };

  const getFileIconColor = (mimeType) => {
    if (mimeType.startsWith('image/')) return 'text-green-500';
    if (mimeType.startsWith('video/')) return 'text-red-500';
    if (mimeType.startsWith('audio/')) return 'text-purple-500';
    if (mimeType.includes('text') || mimeType.includes('document')) return 'text-blue-500';
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) return 'text-yellow-500';
    if (mimeType.includes('javascript') || mimeType.includes('json') || mimeType.includes('html')) return 'text-orange-500';
    return 'text-gray-500';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSelectClick = (e, file) => {
    e.stopPropagation();
    onSelectItem(file.id, 'file');
  };

  const handleContextMenu = (e, file) => {
    e.preventDefault();
    e.stopPropagation();
    onContextMenu(e, file, 'file');
  };

  const handleDownloadClick = (e, file) => {
    e.stopPropagation();
    onDownload(file.id);
  };

  const isSelected = (fileId) => {
    return selectedItems.includes(`file-${fileId}`);
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-8 px-6 py-3">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-google-blue focus:ring-google-blue"
                  onChange={(e) => {
                    if (e.target.checked) {
                      files.forEach(file => onSelectItem(file.id, 'file'));
                    }
                  }}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Modified
              </th>
              <th className="w-8 px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {files.map((file) => {
              const FileIcon = getFileIcon(file.mimeType);
              const iconColor = getFileIconColor(file.mimeType);
              
              return (
                <tr
                  key={file.id}
                  className={`hover:bg-gray-50 cursor-pointer ${
                    isSelected(file.id) ? 'bg-blue-50' : ''
                  }`}
                  onContextMenu={(e) => handleContextMenu(e, file)}
                  onDoubleClick={(e) => handleDownloadClick(e, file)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-google-blue focus:ring-google-blue"
                      checked={isSelected(file.id)}
                      onChange={(e) => handleSelectClick(e, file)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileIcon className={`h-5 w-5 mr-3 ${iconColor}`} />
                      <span className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {file.name}
                      </span>
                      {file.isStarred && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current ml-2" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatFileSize(file.size)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDistanceToNow(new Date(file.updatedAt), { addSuffix: true })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => handleDownloadClick(e, file)}
                        className="text-gray-400 hover:text-google-blue p-1 rounded"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => handleContextMenu(e, file)}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="file-grid">
      {files.map((file) => {
        const FileIcon = getFileIcon(file.mimeType);
        const iconColor = getFileIconColor(file.mimeType);
        
        return (
          <div
            key={file.id}
            className={`file-item group ${isSelected(file.id) ? 'selected' : ''}`}
            onContextMenu={(e) => handleContextMenu(e, file)}
            onDoubleClick={(e) => handleDownloadClick(e, file)}
          >
            {/* Selection Checkbox */}
            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-google-blue focus:ring-google-blue"
                checked={isSelected(file.id)}
                onChange={(e) => handleSelectClick(e, file)}
              />
            </div>

            {/* More Options */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => handleContextMenu(e, file)}
                className="p-1 rounded hover:bg-gray-200"
              >
                <MoreVertical className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            {/* Star Indicator */}
            {file.isStarred && (
              <div className="absolute top-2 right-10">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
              </div>
            )}

            {/* Download Button */}
            <div className={`absolute top-2 opacity-0 group-hover:opacity-100 transition-opacity ${
              file.isStarred ? 'right-16' : 'right-10'
            }`}>
              <button
                onClick={(e) => handleDownloadClick(e, file)}
                className="p-1 rounded hover:bg-gray-200"
                title="Download"
              >
                <Download className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            {/* File Icon */}
            <div className="flex justify-center mb-3">
              <FileIcon className={`h-12 w-12 ${iconColor}`} />
            </div>

            {/* File Info */}
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-900 truncate" title={file.name}>
                {file.name}
              </h3>
              <div className="text-xs text-gray-500 mt-1 space-y-1">
                <p>{formatFileSize(file.size)}</p>
                <p>{formatDistanceToNow(new Date(file.updatedAt), { addSuffix: true })}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FileGrid;