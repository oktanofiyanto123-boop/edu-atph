import { getSupabaseClient, isSupabaseConfigured } from './supabase/client';
import { MaterialAttachment } from '@/types';

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export type SupportedFileType = 'pdf' | 'doc' | 'sheet' | 'slide' | 'image' | 'video' | 'archive' | 'other';

export function detectFileType(fileName: string): SupportedFileType {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return 'pdf';
  if (['doc', 'docx', 'odt', 'rtf', 'txt', 'pages'].includes(ext || '')) return 'doc';
  if (['xls', 'xlsx', 'csv', 'ods', 'numbers'].includes(ext || '')) return 'sheet';
  if (['ppt', 'pptx', 'odp', 'key'].includes(ext || '')) return 'slide';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'heic'].includes(ext || '')) return 'image';
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext || '')) return 'archive';
  if (['mp4', 'mkv', 'avi', 'mov', 'webm'].includes(ext || '')) return 'video';
  return 'other';
}

export interface UploadResult {
  url: string;
  name: string;
  fileSize: string;
  fileType: SupportedFileType;
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
        console.warn('Supabase storage upload error:', error);
        // If it's a specific bucket/policy error, we will still fallback to local
        // but log it clearly
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
      console.warn('Supabase storage exception, falling back to local storage:', err);
    }
  }

  // Fallback: Read as base64 DataURL (for small files) or ObjectURL
  return new Promise((resolve, reject) => {
    // If file is > 1MB and Supabase failed, use ObjectURL or blob so it doesn't break localStorage
    if (file.size > 1024 * 1024) {
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
  let lastError: string | null = null;

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
      lastError = err instanceof Error ? err.message : String(err);
    }

    if (onProgress) {
      onProgress(i + 1, fileArray.length);
    }
  }

  if (attachments.length === 0 && fileArray.length > 0 && lastError) {
    throw new Error(lastError);
  }

  return attachments;
}
