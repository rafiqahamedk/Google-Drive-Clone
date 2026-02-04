import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Home, Star, Trash2, Cloud, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ onCreateFolder }) => {
  const navigate = useNavigate();
  const { folderId } = useParams();
  const { user } = useAuth();

  const menuItems = [
    {
      id: 'my-drive',
      label: 'My Drive',
      icon: Home,
      path: '/dashboard',
      active: !folderId && !window.location.pathname.includes('/starred') && !window.location.pathname.includes('/trash'),
      count: null
    },
    {
      id: 'starred',
      label: 'Starred',
      icon: Star,
      path: '/dashboard/starred',
      active: window.location.pathname.includes('/starred'),
      disabled: false,
      count: null
    },
    {
      id: 'trash',
      label: 'Trash',
      icon: Trash2,
      path: '/dashboard/trash',
      active: window.location.pathname.includes('/trash'),
      disabled: false,
      count: null
    }
  ];

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const storagePercentage = user ? (user.storageUsed / user.storageLimit) * 100 : 0;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col">
      <div className="p-4">
        {/* New Folder Button */}
        <button
          onClick={onCreateFolder}
          className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-google-blue to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 group transform hover:scale-105"
        >
          <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-200" />
          <span className="font-semibold">New Folder</span>
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="px-2 flex-1">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => !item.disabled && navigate(item.path)}
                  disabled={item.disabled}
                  className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                    item.active
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-google-blue border border-blue-200'
                      : item.disabled
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`h-5 w-5 mr-3 transition-colors ${
                    item.active ? 'text-google-blue' : 'text-gray-500 group-hover:text-gray-700'
                  }`} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.count !== null && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.active 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="h-10 w-10 bg-gradient-to-r from-google-blue to-blue-600 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email}
            </p>
          </div>
        </div>

        {/* Storage Info */}
        {user && (
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <Cloud className="h-4 w-4 mr-2" />
              <span>Storage</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>{formatBytes(user.storageUsed)} used</span>
                <span>{formatBytes(user.storageLimit)} total</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    storagePercentage > 90
                      ? 'bg-gradient-to-r from-red-500 to-red-600'
                      : storagePercentage > 75
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                      : 'bg-gradient-to-r from-google-blue to-blue-600'
                  }`}
                  style={{ width: `${Math.min(storagePercentage, 100)}%` }}
                />
              </div>
              
              <div className="text-xs text-gray-500">
                {storagePercentage.toFixed(1)}% of storage used
              </div>
            </div>

            {storagePercentage > 90 && (
              <div className="text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                <span className="font-medium">Storage almost full!</span>
                <br />
                Consider deleting some files.
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;