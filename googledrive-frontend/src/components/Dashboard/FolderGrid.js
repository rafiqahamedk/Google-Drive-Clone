import { useNavigate } from 'react-router-dom';
import { Folder, MoreVertical, Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const FolderGrid = ({ 
  folders, 
  selectedItems, 
  onSelectItem, 
  onContextMenu, 
  onDelete,
  onRename,
  onToggleStar,
  onRestore,
  viewMode = 'grid',
  isTrash = false,
  showStarred = false
}) => {
  const navigate = useNavigate();

  const handleFolderClick = (folder) => {
    if (!isTrash) {
      navigate(`/dashboard/folder/${folder.id}`);
    }
  };

  const handleSelectClick = (e, folder) => {
    e.stopPropagation();
    onSelectItem(folder.id, 'folder');
  };

  const handleContextMenu = (e, folder) => {
    e.preventDefault();
    e.stopPropagation();
    onContextMenu(e, folder, 'folder');
  };

  const isSelected = (folderId) => {
    return selectedItems.includes(`folder-${folderId}`);
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
                      folders.forEach(folder => onSelectItem(folder.id, 'folder'));
                    } else {
                      // This would need to be handled by parent component
                    }
                  }}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Modified
              </th>
              <th className="w-8 px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {folders.map((folder) => (
              <tr
                key={folder.id}
                className={`hover:bg-gray-50 cursor-pointer ${
                  isSelected(folder.id) ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleFolderClick(folder)}
                onContextMenu={(e) => handleContextMenu(e, folder)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-google-blue focus:ring-google-blue"
                    checked={isSelected(folder.id)}
                    onChange={(e) => handleSelectClick(e, folder)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Folder className="h-5 w-5 text-blue-500 mr-3" />
                    <span className="text-sm font-medium text-gray-900">
                      {folder.name}
                    </span>
                    {folder.isStarred && (
                      <Star className="h-4 w-4 text-yellow-500 fill-current ml-2" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDistanceToNow(new Date(folder.updatedAt), { addSuffix: true })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={(e) => handleContextMenu(e, folder)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="file-grid">
      {folders.map((folder) => (
        <div
          key={folder.id}
          className={`file-item group ${isSelected(folder.id) ? 'selected' : ''}`}
          onClick={() => handleFolderClick(folder)}
          onContextMenu={(e) => handleContextMenu(e, folder)}
        >
          {/* Selection Checkbox */}
          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-google-blue focus:ring-google-blue"
              checked={isSelected(folder.id)}
              onChange={(e) => handleSelectClick(e, folder)}
            />
          </div>

          {/* More Options */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => handleContextMenu(e, folder)}
              className="p-1 rounded hover:bg-gray-200"
            >
              <MoreVertical className="h-4 w-4 text-gray-500" />
            </button>
          </div>

          {/* Star Indicator */}
          {folder.isStarred && (
            <div className="absolute top-2 right-10">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
            </div>
          )}

          {/* Folder Icon */}
          <div className="flex justify-center mb-3 relative">
            <Folder className="h-12 w-12 text-blue-500" />
          </div>

          {/* Folder Name */}
          <div className="text-center">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {folder.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {formatDistanceToNow(new Date(folder.updatedAt), { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FolderGrid;