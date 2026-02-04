import React, { useState, useEffect } from 'react';
import { Download, Edit, Trash2, Move, Copy, Star, RotateCcw, XCircle, Info } from 'lucide-react';

const ContextMenu = ({ 
  x, 
  y, 
  item, 
  type, 
  onClose, 
  onDelete, 
  onRename, 
  onDownload,
  onMove,
  onCopy,
  onToggleStar,
  onRestore,
  onPermanentDelete,
  onInfo,
  isTrash = false,
  showStarred = false
}) => {
  const [showRenameInput, setShowRenameInput] = useState(false);
  const [newName, setNewName] = useState(item?.name || '');

  useEffect(() => {
    const handleClickOutside = (e) => {
      onClose();
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleRename = () => {
    if (newName.trim() && newName.trim() !== item.name) {
      onRename(item.id, newName.trim());
    }
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      onDelete(item.id);
    }
    onClose();
  };

  const handleRestore = () => {
    onRestore(item.id);
    onClose();
  };

  const handleToggleStar = () => {
    onToggleStar(item.id);
    onClose();
  };

  const handleMove = () => {
    onMove(item);
    onClose();
  };

  const handleCopy = () => {
    onCopy(item);
    onClose();
  };

  const handlePermanentDelete = () => {
    if (window.confirm(`Are you sure you want to permanently delete "${item.name}"? This action cannot be undone.`)) {
      onPermanentDelete(item.id);
    }
    onClose();
  };

  const handleInfo = () => {
    onInfo(item);
    onClose();
  };

  const handleDownload = () => {
    onDownload(item.id);
    onClose();
  };

  const menuItems = [
    ...(type === 'file' && onDownload ? [{
      icon: Download,
      label: 'Download',
      action: handleDownload
    }] : []),
    ...(isTrash ? [
      {
        icon: RotateCcw,
        label: 'Restore',
        action: handleRestore
      },
      {
        icon: XCircle,
        label: 'Delete permanently',
        action: handlePermanentDelete,
        danger: true
      }
    ] : [
      {
        icon: Edit,
        label: 'Rename',
        action: () => setShowRenameInput(true)
      },
      ...(onMove ? [{
        icon: Move,
        label: 'Move',
        action: handleMove
      }] : []),
      ...(onCopy ? [{
        icon: Copy,
        label: 'Make a copy',
        action: handleCopy
      }] : []),
      ...(onToggleStar ? [{
        icon: Star,
        label: item.isStarred || showStarred ? 'Remove from starred' : 'Add to starred',
        action: handleToggleStar
      }] : []),
      ...(type === 'folder' && onInfo ? [{
        icon: Info,
        label: 'Folder information',
        action: handleInfo
      }] : []),
      {
        icon: Trash2,
        label: 'Delete',
        action: handleDelete,
        danger: true
      }
    ])
  ];

  // Position the menu to stay within viewport
  const menuStyle = {
    position: 'fixed',
    left: Math.min(x, window.innerWidth - 200),
    top: Math.min(y, window.innerHeight - (menuItems.length * 40 + 20)),
    zIndex: 1000
  };

  if (showRenameInput) {
    return (
      <div 
        className="context-menu" 
        style={menuStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleRename();
              } else if (e.key === 'Escape') {
                setShowRenameInput(false);
              }
            }}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-google-blue"
            autoFocus
            onFocus={(e) => e.target.select()}
          />
          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={() => setShowRenameInput(false)}
              className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleRename}
              className="px-2 py-1 text-xs bg-google-blue text-white rounded hover:bg-blue-600"
            >
              Rename
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="context-menu" 
      style={menuStyle}
      onClick={(e) => e.stopPropagation()}
    >
      {menuItems.map((menuItem, index) => {
        const Icon = menuItem.icon;
        return (
          <button
            key={index}
            onClick={menuItem.action}
            disabled={menuItem.disabled}
            className={`context-menu-item ${
              menuItem.danger ? 'danger' : ''
            } ${
              menuItem.disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{menuItem.label}</span>
            {menuItem.disabled && (
              <span className="ml-auto text-xs text-gray-400">Soon</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ContextMenu;