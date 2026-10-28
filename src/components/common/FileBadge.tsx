import React from 'react';
import {
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  FileArchive,
  Presentation,
  Video,
  Paperclip,
} from 'lucide-react';
import { detectFileType, SupportedFileType } from '@/lib/storage';

interface FileBadgeProps {
  fileName: string;
  fileSize?: string;
  fileType?: string;
  className?: string;
}

export function getFileStyle(type: SupportedFileType | string) {
  switch (type) {
    case 'pdf':
      return {
        icon: FileText,
        colorClass: 'text-rose-600 dark:text-rose-400',
        bgClass: 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900/60',
        tag: 'PDF',
      };
    case 'doc':
      return {
        icon: FileText,
        colorClass: 'text-blue-600 dark:text-blue-400',
        bgClass: 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900/60',
        tag: 'DOCX',
      };
    case 'sheet':
      return {
        icon: FileSpreadsheet,
        colorClass: 'text-emerald-600 dark:text-emerald-400',
        bgClass: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900/60',
        tag: 'EXCEL',
      };
    case 'slide':
      return {
        icon: Presentation,
        colorClass: 'text-amber-600 dark:text-amber-400',
        bgClass: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900/60',
        tag: 'PPT',
      };
    case 'image':
      return {
        icon: ImageIcon,
        colorClass: 'text-purple-600 dark:text-purple-400',
        bgClass: 'bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-900/60',
        tag: 'FOTO',
      };
    case 'archive':
      return {
        icon: FileArchive,
        colorClass: 'text-yellow-600 dark:text-yellow-400',
        bgClass: 'bg-yellow-50 dark:bg-yellow-950/50 border-yellow-200 dark:border-yellow-900/60',
        tag: 'ZIP',
      };
    case 'video':
      return {
        icon: Video,
        colorClass: 'text-pink-600 dark:text-pink-400',
        bgClass: 'bg-pink-50 dark:bg-pink-950/50 border-pink-200 dark:border-pink-900/60',
        tag: 'VIDEO',
      };
    default:
      return {
        icon: Paperclip,
        colorClass: 'text-slate-600 dark:text-slate-400',
        bgClass: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
        tag: 'FILE',
      };
  }
}

export default function FileBadge({ fileName, fileSize, fileType, className = '' }: FileBadgeProps) {
  const resolvedType = fileType || detectFileType(fileName);
  const style = getFileStyle(resolvedType);
  const Icon = style.icon;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${style.bgClass} text-xs font-semibold ${className}`}
    >
      <Icon className={`w-4 h-4 shrink-0 ${style.colorClass}`} />
      <span className="truncate max-w-[180px] text-slate-800 dark:text-slate-200">
        {fileName}
      </span>
      <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${style.colorClass} bg-white dark:bg-slate-900 border border-current/20`}>
        {style.tag}
      </span>
      {fileSize && (
        <span className="text-[10px] text-slate-400 font-normal">
          ({fileSize})
        </span>
      )}
    </div>
  );
}
