import { useState, useCallback } from 'react';
import type { UploadResponse, UploadMultipleResponse } from '../services/uploadService';
import uploadService from '../services/uploadService';

export const useUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadResponse[]>([]);

  const uploadSingle = useCallback(async (file: File) => {
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      // Validate file
      const validationError = uploadService.validateFile(file);
      if (validationError) {
        setError(validationError);
        return null;
      }

      const response = await uploadService.uploadSingle(file);
      setProgress(100);
      setUploadedFiles([...uploadedFiles, response]);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  }, [uploadedFiles]);

  const uploadMultiple = useCallback(async (files: File[]) => {
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      // Validate files
      const validationError = uploadService.validateFiles(files);
      if (validationError) {
        setError(validationError);
        return null;
      }

      const response = await uploadService.uploadMultiple(files);
      setProgress(100);
      setUploadedFiles([...uploadedFiles, ...response.files]);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  }, [uploadedFiles]);

  const deleteFile = useCallback(async (publicId: string) => {
    setUploading(true);
    setError(null);

    try {
      await uploadService.deleteFile(publicId);
      setUploadedFiles(uploadedFiles.filter(f => f.publicId !== publicId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
      return false;
    } finally {
      setUploading(false);
    }
  }, [uploadedFiles]);

  const clearUploadedFiles = useCallback(() => {
    setUploadedFiles([]);
    setError(null);
  }, []);

  return {
    uploading,
    progress,
    error,
    uploadedFiles,
    uploadSingle,
    uploadMultiple,
    deleteFile,
    clearUploadedFiles,
  };
};
