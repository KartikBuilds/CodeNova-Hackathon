import { useState } from 'react';

// Import asset images
import img1 from '../assets/1.jpeg';
import img2 from '../assets/2.jpeg';
import img3 from '../assets/3.jpeg';
import img4 from '../assets/4.jpeg';
import img5 from '../assets/5.jpeg';
import img6 from '../assets/6.jpeg';
import img7 from '../assets/7.jpeg';
import img8 from '../assets/8.jpeg';
import img9 from '../assets/9.jpeg';

const ProfileImageSelector = ({ 
  currentImage, 
  onImageSelect, 
  onImageUpload, 
  showAssetImages = false,
  onToggleAssetImages,
  defaultLetter = 'U'
}) => {
  const [dragOver, setDragOver] = useState(false);

  const assetImages = [img1, img2, img3, img4, img5, img6, img7, img8, img9];

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageUpload(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  return (
    <div className="space-y-6">
      {/* Current Profile Image */}
      <div className="text-center">
        <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg mb-4">
          {currentImage ? (
            <img src={currentImage} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl font-bold text-white">
              {defaultLetter}
            </span>
          )}
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Profile Picture</h3>
        <p className="text-sm text-slate-500">Upload your own image or choose from our collection</p>
      </div>

      {/* Upload Options */}
      <div className="space-y-4">
        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
            dragOver 
              ? 'border-indigo-400 bg-indigo-50' 
              : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="space-y-3">
            <div className="w-12 h-12 mx-auto bg-slate-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="text-slate-600 font-medium">Drop your image here or</p>
              <label className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-indigo-700 transition-colors mt-2">
                Choose File
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-xs text-slate-400">PNG, JPG up to 5MB</p>
          </div>
        </div>

        {/* Toggle Asset Images Button */}
        <button
          type="button"
          onClick={onToggleAssetImages}
          className="w-full py-3 px-4 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
        >
          {showAssetImages ? 'Hide' : 'Choose from'} Our Collection
        </button>

        {/* Asset Images Grid */}
        {showAssetImages && (
          <div className="space-y-3">
            <h4 className="font-medium text-slate-700">Choose from our collection:</h4>
            <div className="grid grid-cols-3 gap-3">
              {assetImages.map((img, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => onImageSelect(img)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    currentImage === img
                      ? 'border-indigo-500 ring-2 ring-indigo-200'
                      : 'border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Asset ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {currentImage === img && (
                    <div className="absolute inset-0 bg-indigo-500 bg-opacity-20 flex items-center justify-center">
                      <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Remove Image Button */}
        {currentImage && (
          <button
            type="button"
            onClick={() => onImageSelect(null)}
            className="w-full py-2 px-4 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            Remove Profile Picture
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileImageSelector;