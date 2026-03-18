"use client";

import { useState, useRef } from "react";

const MAX_SIZE = 3 * 1024 * 1024; // 3MB - safe under Vercel's 4.5MB limit
const MAX_DIMENSION = 2048;

function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    if (file.size <= MAX_SIZE && !file.type.startsWith("image/")) {
      resolve(file);
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("No canvas context")); return; }
      ctx.drawImage(img, 0, 0, width, height);

      // Start at 0.85 quality, reduce if still too large
      let quality = 0.85;
      const tryCompress = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) { reject(new Error("Compression failed")); return; }
            if (blob.size > MAX_SIZE && quality > 0.3) {
              quality -= 0.15;
              tryCompress();
              return;
            }
            resolve(new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" }));
          },
          "image/jpeg",
          quality,
        );
      };
      tryCompress();
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("No se pudo leer la imagen")); };
    img.src = url;
  });
}

interface ImageUploaderProps {
  images: string[];
  entityType: "lotes" | "equipamiento";
  entityId: string | number;
  multiple?: boolean;
  onUploadComplete: (newImages: string[]) => void;
}

export default function ImageUploader({
  images,
  entityType,
  entityId,
  multiple = false,
  onUploadComplete,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const compressed = await compressImage(files[0]);

      const formData = new FormData();
      formData.append("file", compressed);
      formData.append("entityType", entityType);
      formData.append("entityId", String(entityId));

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Error al subir imagen");
        return;
      }

      const data = await res.json();
      onUploadComplete(data.images);
    } catch {
      alert("Error de conexión al subir imagen");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (imageUrl: string) => {
    if (!confirm("¿Eliminar esta imagen?")) return;

    setDeleting(imageUrl);
    try {
      const res = await fetch("/api/admin/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entityType, entityId: String(entityId), imageUrl }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Error al eliminar imagen");
        return;
      }

      const data = await res.json();
      onUploadComplete(data.images);
    } catch {
      alert("Error de conexión al eliminar imagen");
    } finally {
      setDeleting(null);
    }
  };

  const canUpload = multiple || images.length === 0;

  return (
    <div className="space-y-3">
      {/* Current images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {images.map((url) => (
            <div key={url} className="relative group">
              <img
                src={url}
                alt=""
                className="w-full h-24 object-cover border border-neutral-200"
              />
              <button
                onClick={() => handleDelete(url)}
                disabled={deleting === url}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
                aria-label="Eliminar imagen"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {deleting === url && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                  <span className="text-[10px] text-neutral-500">Eliminando...</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {canUpload && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
            id={`upload-${entityType}-${entityId}`}
          />
          <label
            htmlFor={`upload-${entityType}-${entityId}`}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-neutral-300 text-xs text-neutral-500 hover:text-neutral-900 hover:border-neutral-900 transition-colors cursor-pointer ${uploading ? "opacity-50 pointer-events-none" : ""}`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {uploading ? "Subiendo..." : "Subir imagen"}
          </label>
        </div>
      )}
    </div>
  );
}
