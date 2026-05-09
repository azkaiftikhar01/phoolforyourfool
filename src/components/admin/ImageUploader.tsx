"use client";

import { useRef, useState } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { CloudinaryImage } from "@/components/shared/CloudinaryImage";

interface ImageUploaderProps {
  /** Current Cloudinary public ID (single-image mode). */
  value?: string;
  /** Multi-image array of public IDs. */
  values?: string[];
  /** Callback when single value changes. */
  onChange?: (publicId: string) => void;
  /** Callback when multi values change. */
  onChangeMulti?: (publicIds: string[]) => void;
  /** Sub-folder under the configured Cloudinary upload folder. */
  folder?: string;
  /** Allow multiple images. */
  multiple?: boolean;
  /** Visible label. */
  label?: string;
  /** Aspect ratio class for the preview tile. Defaults to 4:5. */
  aspect?: string;
}

interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  format: string;
  bytes: number;
  width: number;
  height: number;
}

export function ImageUploader({
  value,
  values = [],
  onChange,
  onChangeMulti,
  folder,
  multiple = false,
  label,
  aspect = "aspect-[4/5]",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function uploadOne(file: File): Promise<string | null> {
    const sigRes = await fetch("/api/admin/upload-signature", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folder }),
    });
    if (!sigRes.ok) throw new Error("Could not get upload signature");
    const sig = (await sigRes.json()) as {
      timestamp: number;
      folder: string;
      signature: string;
      apiKey: string;
      cloudName: string;
    };

    const fd = new FormData();
    fd.append("file", file);
    fd.append("api_key", sig.apiKey);
    fd.append("timestamp", String(sig.timestamp));
    fd.append("signature", sig.signature);
    fd.append("folder", sig.folder);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
      { method: "POST", body: fd },
    );
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.error?.message ?? "Cloudinary upload failed");
    }
    const data = (await res.json()) as CloudinaryUploadResponse;
    return data.public_id;
  }

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      const files = Array.from(fileList);
      if (multiple) {
        const ids: string[] = [];
        for (const f of files) {
          const id = await uploadOne(f);
          if (id) ids.push(id);
        }
        onChangeMulti?.([...values, ...ids]);
      } else {
        const id = await uploadOne(files[0]!);
        if (id) onChange?.(id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeAt(index: number) {
    onChangeMulti?.(values.filter((_, i) => i !== index));
  }

  function clearSingle() {
    onChange?.("");
  }

  return (
    <div className="space-y-3">
      {label ? (
        <label className="block text-xs font-medium uppercase tracking-widest text-brand-ink/70">
          {label}
        </label>
      ) : null}

      {multiple ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {values.map((id, idx) => (
            <div key={`${id}-${idx}`} className={`relative ${aspect} overflow-hidden rounded-xl bg-brand-pink/30`}>
              <CloudinaryImage
                publicId={id}
                fallbackSrc="/images/placeholder.svg"
                alt="Uploaded"
                width={400}
                height={500}
                transform={{ width: 400, height: 500, crop: "fill", gravity: "auto" }}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeAt(idx)}
                className="absolute right-1.5 top-1.5 rounded-full bg-white/90 p-1 text-brand-deep shadow-soft hover:bg-white"
                aria-label="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className={`flex ${aspect} items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border text-sm text-brand-ink/70 transition hover:border-brand-coral hover:bg-white`}
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Upload className="h-4 w-4" /> Add
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div
            className={`relative ${aspect} w-full overflow-hidden rounded-xl bg-brand-pink/30 sm:w-44`}
          >
            {value ? (
              <>
                <CloudinaryImage
                  publicId={value}
                  fallbackSrc="/images/placeholder.svg"
                  alt="Uploaded"
                  width={400}
                  height={500}
                  transform={{ width: 400, height: 500, crop: "fill", gravity: "auto" }}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={clearSingle}
                  className="absolute right-1.5 top-1.5 rounded-full bg-white/90 p-1 text-brand-deep shadow-soft hover:bg-white"
                  aria-label="Remove image"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-brand-ink/40">
                <ImageIcon className="h-8 w-8" />
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="btn-secondary w-full justify-center sm:w-auto"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" /> {value ? "Replace image" : "Upload image"}
                </>
              )}
            </button>
            {value ? (
              <p className="break-all text-xs text-brand-ink/60">
                <span className="font-medium text-brand-deep">Public ID:</span> {value}
              </p>
            ) : (
              <p className="text-xs text-brand-ink/60">
                JPG, PNG or WebP. Uploaded to Cloudinary and optimized automatically.
              </p>
            )}
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error ? (
        <p className="rounded-xl bg-brand-coral/10 px-3 py-2 text-sm text-brand-coral">{error}</p>
      ) : null}
    </div>
  );
}
