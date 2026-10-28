import { getSupabaseClient, isSupabaseConfigured } from './supabase/client';
import { MaterialAttachment } from '@/types';

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function detectFileType(fileName: string): 'pdf' | 'doc' | 'image' | 'video' | 'other' {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return 'pdf';
  if (['doc', 'docx', 'odt', 'rtf', 'txt', 'pages'].includes(ext || '')) return 'doc';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext || '')) return 'image';
  if (['mp4', 'mkv', 'avi', 'mov', 'webm'].includes(ext || '')) return 'video';
  return 'other';
}

export interface UploadResult {
  url: string;
  name: string;
  fileSize: string;
  fileType: 'pdf' | 'doc' | 'image' | 'video' | 'other';
  storagePath?: string;
}

/**
 * Upload a single file to Supabase Storage 'materials' bucket.
 * Falls back to DataURL if Supabase is unavailable.
 */
export async function uploadFileToStorage(
  file: File,
  folder: 'documents' | 'covers' | 'assignments' = 'documents'
): Promise<UploadResult> {
  const fileType = detectFileType(file.name);
  const fileSize = formatBytes(file.size);
  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${folder}/${Date.now()}-${cleanName}`;

  const supabase = getSupabaseClient();

  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.storage
        .from('materials')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type || undefined,
        });

      if (error) {
        console.warn('Supabase storage upload failed, falling back:', error.message);
      } else if (data) {
        const { data: publicData } = supabase.storage
          .from('materials')
          .getPublicUrl(data.path);

        return {
          url: publicData.publicUrl,
          name: file.name,
          fileSize,
          fileType,
          storagePath: data.path,
        };
      }
    } catch (err) {
      console.error('Exception during Supabase storage upload:', err);
    }
  }

  // Fallback: Read as base64 DataURL (for small files) or ObjectURL
  return new Promise((resolve, reject) => {
    // If file is > 2MB and Supabase failed, warn about local storage quota
    if (file.size > 2 * 1024 * 1024) {
      // Create ObjectURL for session download
      const objUrl = URL.createObjectURL(file);
      resolve({
        url: objUrl,
        name: file.name,
        fileSize,
        fileType,
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      resolve({
        url: (e.target?.result as string) || '',
        name: file.name,
        fileSize,
        fileType,
      });
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Upload multiple files with progress reporting.
 */
export async function uploadMultipleFiles(
  files: File[] | FileList,
  folder: 'documents' | 'covers' | 'assignments' = 'documents',
  onProgress?: (processed: number, total: number) => void
): Promise<MaterialAttachment[]> {
  const fileArray = Array.from(files);
  const attachments: MaterialAttachment[] = [];

  for (let i = 0; i < fileArray.length; i++) {
    const file = fileArray[i];
    try {
      const result = await uploadFileToStorage(file, folder);
      attachments.push({
        id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: result.name,
        fileUrl: result.url,
        fileSize: result.fileSize,
        fileType: result.fileType,
      });
    } catch (err) {
      console.error(`Gagal mengunggah file ${file.name}:`, err);
    }

    if (onProgress) {
      onProgress(i + 1, fileArray.length);
    }
  }

  return attachments;
}
