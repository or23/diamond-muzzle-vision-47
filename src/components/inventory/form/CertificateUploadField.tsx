import React, { useState, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useSupabaseFileUpload } from '@/hooks/useSupabaseFileUpload';
import { FileText, X, Upload, Loader2 } from 'lucide-react';

interface CertificateUploadFieldProps {
  id: string;
  label: string;
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
}

export function CertificateUploadField({ 
  id, 
  label, 
  value = '', 
  onChange,
  accept = 'application/pdf,image/*'
}: CertificateUploadFieldProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(value);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, isUploading, progress } = useSupabaseFileUpload();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // For PDFs, we don't create a preview URL
      if (file.type.includes('pdf')) {
        setPreviewUrl('pdf');
      } else {
        // For images, create a preview URL
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
      }
      
      // Upload the file immediately
      handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    const publicUrl = await uploadFile(file, 'diamond-certificates', 'certificates');
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

  const renderPreview = () => {
    if (!previewUrl) return null;
    
    if (previewUrl === 'pdf' || previewUrl.endsWith('.pdf')) {
      return (
        <div className="flex items-center justify-center p-4 bg-gray-100 rounded-md">
          <FileText className="h-12 w-12 text-blue-500" />
          <div className="ml-3">
            <p className="text-sm font-medium">Certificate PDF</p>
            <p className="text-xs text-gray-500">
              {selectedFile?.name || 'Certificate document'}
            </p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-gray-100">
        <img 
          src={previewUrl} 
          alt="Certificate Preview" 
          className="h-full w-full object-contain"
          onError={() => {
            // If image fails to load, show a placeholder
            setPreviewUrl('');
          }}
        />
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      
      <div className="border rounded-md p-4 bg-gray-50">
        {previewUrl ? (
          <div className="space-y-3">
            {renderPreview()}
            
            {isUploading && (
              <div className="flex items-center justify-center p-2">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <p className="text-sm text-gray-500">Uploading... {progress}%</p>
              </div>
            )}
            
            <div className="flex justify-end">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleClear}
                disabled={isUploading}
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        ) : (
          <div 
            className="flex flex-col items-center justify-center gap-2 py-8 cursor-pointer hover:bg-gray-100 rounded-md transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-10 w-10 text-gray-400 animate-spin" />
                <p className="text-sm text-gray-500">Uploading... {progress}%</p>
              </>
            ) : (
              <>
                <FileText className="h-10 w-10 text-gray-400" />
                <p className="text-sm text-gray-500">Click to upload a certificate</p>
                <p className="text-xs text-gray-400">PDF, PNG, JPG or GIF</p>
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