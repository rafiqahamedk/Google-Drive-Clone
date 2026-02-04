import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = ({ breadcrumb = [] }) => {
  const navigate = useNavigate();

  const handleNavigate = (item) => {
    if (item.id) {
      navigate(`/dashboard/folder/${item.id}`);
    } else {
      navigate('/dashboard');
    }
  };

  if (breadcrumb.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      {breadcrumb.map((item, index) => (
        <React.Fragment key={item.id || 'root'}>
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          )}
          
          <button
            onClick={() => handleNavigate(item)}
            className={`flex items-center space-x-1 hover:text-google-blue transition-colors ${
              index === breadcrumb.length - 1
                ? 'text-gray-900 font-medium cursor-default'
                : 'text-gray-600 hover:text-google-blue'
            }`}
            disabled={index === breadcrumb.length - 1}
          >
            {index === 0 && <Home className="h-4 w-4" />}
            <span>{item.name}</span>
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;