import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'crypto-js/core';
import { useToast } from '@/components/ui/use-toast';

interface UseSupabaseFileUploadResult {
  uploadFile: (file: File, bucket: string, path?: string) => Promise<string | null>;
  isUploading: boolean;
  progress: number;
  error: string | null;
}

export function useSupabaseFileUpload(): UseSupabaseFileUploadResult {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const uploadFile = async (file: File, bucket: string, path = ''): Promise<string | null> => {
    if (!file) return null;
    
    setIsUploading(true);
    setProgress(0);
    setError(null);
    
    try {
      // Generate a unique filename to prevent collisions
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = path ? `${path}/${fileName}` : fileName;
      
      // Upload the file to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          onUploadProgress: (progress) => {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            setProgress(percent);
          },
        });
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);
      
      return publicUrl;
    } catch (err: any) {
      console.error('Error uploading file:', err);
      setError(err.message || 'Failed to upload file');
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: err.message || 'Failed to upload file',
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };
  
  return { uploadFile, isUploading, progress, error };
}