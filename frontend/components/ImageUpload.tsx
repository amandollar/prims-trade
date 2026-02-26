'use client';

import { useRef, useState } from 'react';
import { uploadImage, isUploadConfigured } from '@/lib/upload';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string | undefined) => void;
  disabled?: boolean;
  className?: string;
}

export default function ImageUpload({ value, onChange, disabled, className = '' }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const configured = isUploadConfigured();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange(undefined);
    setError('');
  };

  if (!configured) {
    return (
      <div className={`rounded-md border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-800 ${className}`}>
        Set <code className="rounded bg-amber-100 px-1 font-mono text-xs">NEXT_PUBLIC_API_URL</code> to enable uploads.
      </div>
    );
  }

  return (
    <div className={className}>
      <label className="label">Chart / image (optional)</label>
      <p className="label-hint">JPEG, PNG, GIF or WebP, max 5MB</p>
      <div className="mt-2 flex flex-wrap items-start gap-3">
        {value ? (
          <div className="relative">
            <img
              src={value}
              alt="Signal chart"
              className="max-h-40 rounded border border-zinc-200 object-cover"
            />
            {!disabled && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute right-2 top-2 rounded bg-zinc-900/80 px-2 py-1 text-xs font-medium text-white hover:bg-zinc-900"
              >
                Remove
              </button>
            )}
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-zinc-300 bg-zinc-50/50 px-6 py-4 text-sm text-zinc-500 hover:border-zinc-400 hover:bg-zinc-50">
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              disabled={disabled || uploading}
              onChange={handleFile}
            />
            {uploading ? (
              <span className="flex items-center gap-2 text-indigo-600">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-300 border-t-indigo-600" />
                Uploading…
              </span>
            ) : (
              'Choose image'
            )}
          </label>
        )}
      </div>
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}
