import React, { useState, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useSupabaseFileUpload } from '@/hooks/useSupabaseFileUpload';
import { Image, X, Upload, Loader2 } from 'lucide-react';

interface ImageUploadFieldProps {
  id: string;
  label: string;
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
}

export function ImageUploadField({ 
  id, 
  label, 
  value = '', 
  onChange,
  accept = 'image/*'
}: ImageUploadFieldProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(value);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, isUploading, progress } = useSupabaseFileUpload();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create a preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Upload the file immediately
      handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    const publicUrl = await uploadFile(file, 'diamond-images', 'uploads');
    if (publicUrl) {
      onChange(publicUrl);
    }
  };

  const handleClear = () => {
    setPreviewUrl('');
    setSelectedFile(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      
      <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
        {previewUrl ? (
          <div className="space-y-3">
            <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-gray-100 dark:bg-gray-700 dark:border-gray-600">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="h-full w-full object-contain"
                onError={() => {
                  // If image fails to load, show a placeholder
                  setPreviewUrl('');
                }}
              />
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="text-center text-white">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                    <p className="text-sm">{progress}%</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleClear}
                disabled={isUploading}
                className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        ) : (
          <div 
            className="flex flex-col items-center justify-center gap-2 py-8 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-10 w-10 text-gray-400 animate-spin" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Uploading... {progress}%</p>
              </>
            ) : (
              <>
                <Image className="h-10 w-10 text-gray-400" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Click to upload an image</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">PNG, JPG or GIF</p>
              </>
            )}
          </div>
        )}
        
        <input
          ref={fileInputRef}
          id={id}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
      </div>
    </div>
  );
}