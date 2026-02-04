import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

const FileUpload = ({ onFileUpload, uploading }) => {
  const [uploadProgress, setUploadProgress] = useState({});

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach(({ file, errors }) => {
        errors.forEach(error => {
          if (error.code === 'file-too-large') {
            toast.error(`${file.name} is too large. Maximum size is 100MB.`);
          } else if (error.code === 'file-invalid-type') {
            toast.error(`${file.name} is not a supported file type.`);
          } else {
            toast.error(`Error with ${file.name}: ${error.message}`);
          }
        });
      });
    }

    // Handle accepted files
    if (acceptedFiles.length > 0) {
      // Initialize progress for each file
      const initialProgress = {};
      acceptedFiles.forEach((file, index) => {
        initialProgress[index] = 0;
      });
      setUploadProgress(initialProgress);

      onFileUpload(acceptedFiles, (fileIndex, progress) => {
        setUploadProgress(prev => ({
          ...prev,
          [fileIndex]: progress
        }));
      });
    }
  }, [onFileUpload]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    open
  } = useDropzone({
    onDrop,
    maxSize: 100 * 1024 * 1024, // 100MB
    multiple: true,
    noClick: true,
    noKeyboard: true
  });

  const dropzoneClass = `
    relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer
    ${isDragActive && !isDragReject 
      ? 'border-google-blue bg-blue-50 scale-105' 
      : isDragReject 
      ? 'border-red-500 bg-red-50' 
      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
    }
    ${uploading ? 'opacity-50 pointer-events-none' : ''}
  `;

  return (
    <div className="space-y-6">
      {/* Upload Button */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={open}
          disabled={uploading}
          className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-google-blue to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <Upload className="h-5 w-5 mr-2" />
          <span>Upload Files</span>
        </button>
        
        {uploading && (
          <div className="flex items-center space-x-3 text-sm text-gray-600 bg-blue-50 px-4 py-3 rounded-xl border border-blue-200">
            <div className="spinner w-4 h-4"></div>
            <span className="font-medium">Uploading files...</span>
          </div>
        )}
      </div>

      {/* Drag and Drop Area */}
      <div {...getRootProps()} className={dropzoneClass}>
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className={`p-4 rounded-full transition-all duration-300 ${
            isDragActive && !isDragReject 
              ? 'bg-blue-100 scale-110' 
              : isDragReject 
              ? 'bg-red-100' 
              : 'bg-gray-100'
          }`}>
            {isDragReject ? (
              <X className="h-8 w-8 text-red-500" />
            ) : (
              <Upload className={`h-8 w-8 transition-colors ${
                isDragActive ? 'text-google-blue' : 'text-gray-400'
              }`} />
            )}
          </div>
          
          <div className="text-center">
            {isDragActive && !isDragReject ? (
              <div>
                <p className="text-lg font-semibold text-google-blue mb-2">
                  Drop files here to upload
                </p>
                <p className="text-sm text-blue-600">
                  Release to start uploading
                </p>
              </div>
            ) : isDragReject ? (
              <div>
                <p className="text-lg font-semibold text-red-600 mb-2">
                  Some files are not supported
                </p>
                <p className="text-sm text-red-500">
                  Please check file types and sizes
                </p>
              </div>
            ) : (
              <div>
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  Drag and drop files here
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  or{' '}
                  <button
                    onClick={open}
                    className="text-google-blue hover:text-blue-600 font-medium underline"
                  >
                    browse files
                  </button>
                </p>
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
                  <span>Max: 100MB per file</span>
                  <span>•</span>
                  <span>Multiple files supported</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {uploading && Object.keys(uploadProgress).length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Upload className="h-5 w-5 mr-2 text-google-blue" />
            Uploading Files
          </h3>
          <div className="space-y-4">
            {Object.entries(uploadProgress).map(([fileIndex, progress]) => (
              <div key={fileIndex} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">File {parseInt(fileIndex) + 1}</span>
                  <span className="text-gray-500">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-google-blue to-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;