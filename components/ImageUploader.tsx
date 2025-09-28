
import React, { useState, useRef, useCallback } from 'react';

interface ImageUploaderProps {
  onScan: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onScan }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScanClick = () => {
    if (selectedFile) {
      onScan(selectedFile);
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-brand-secondary mb-2">Check Your Product's Safety</h2>
      <p className="text-gray-600 mb-6">Upload an image of the ingredients list to get an instant analysis.</p>
      
      <div 
        className="w-full max-w-lg mx-auto border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-brand-primary hover:bg-gray-50 transition-colors"
        onClick={openFilePicker}
      >
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        {imagePreview ? (
          <img src={imagePreview} alt="Ingredient list preview" className="mx-auto max-h-64 rounded-lg shadow-md" />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="font-semibold">Click to upload an image</p>
            <p className="text-sm">PNG, JPG, WEBP up to 10MB</p>
          </div>
        )}
      </div>

      {selectedFile && (
        <div className="mt-6">
          <p className="text-sm text-gray-600 mb-4">File: {selectedFile.name}</p>
          <button
            onClick={handleScanClick}
            className="w-full max-w-xs bg-brand-primary text-white font-bold py-3 px-6 rounded-full text-lg hover:bg-brand-secondary transition-transform transform hover:scale-105"
          >
            Scan Ingredients
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
