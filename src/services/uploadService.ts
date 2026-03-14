import axiosClient from './axiosClient';
import { UPLOAD_ENDPOINTS, UPLOAD_CONFIG } from '../constants/api';

export interface UploadResponse {
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  width?: number;
  height?: number;
}

export interface UploadMultipleResponse {
  files: UploadResponse[];
  count: number;
}

const uploadService = {
  // Upload single file (Authenticated 🔒)
  uploadSingle: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    return axiosClient.post<any, UploadResponse>(
      UPLOAD_ENDPOINTS.SINGLE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },

  // Upload multiple files - max 10 files (Authenticated 🔒)
  uploadMultiple: (files: File[]) => {
    if (files.length > UPLOAD_CONFIG.MAX_FILES) {
      throw new Error(`Maximum ${UPLOAD_CONFIG.MAX_FILES} files allowed`);
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append(`files`, file);
    });

    return axiosClient.post<any, UploadMultipleResponse>(
      UPLOAD_ENDPOINTS.MULTIPLE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },

  // Delete file from Cloudinary (Authenticated 🔒)
  deleteFile: (publicId: string) =>
    axiosClient.delete(UPLOAD_ENDPOINTS.DELETE.replace(':publicId', publicId)),

  // Validate file before upload
  validateFile: (file: File): string | null => {
    if (!UPLOAD_CONFIG.ACCEPTED_TYPES.includes(file.type as any)) {
      return `Invalid file type. Accepted: ${UPLOAD_CONFIG.ACCEPTED_TYPES.join(', ')}`;
    }

    if (file.size > UPLOAD_CONFIG.MAX_FILE_SIZE) {
      return `File size exceeds ${UPLOAD_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`;
    }

    return null;
  },

  // Validate multiple files
  validateFiles: (files: File[]): string | null => {
    if (files.length > UPLOAD_CONFIG.MAX_FILES) {
      return `Maximum ${UPLOAD_CONFIG.MAX_FILES} files allowed`;
    }

    for (const file of files) {
      const error = uploadService.validateFile(file);
      if (error) return error;
    }

    return null;
  },
};

export default uploadService;
