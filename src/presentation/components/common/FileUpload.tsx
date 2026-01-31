import React, { useRef } from "react";

interface FileUploadProps {
  label?: string;
  accept?: string;
  onChange: (file: File | null) => void;
  preview?: string | null;
  error?: string;
  maxSize?: number; // en MB
  className?: string;
}

export default function FileUpload({
  label = "Subir archivo",
  accept,
  onChange,
  preview,
  error,
  maxSize = 10,
  className = "",
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      onChange(null);
      return;
    }

    // Validar tamaño
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      alert(`El archivo debe ser menor a ${maxSize}MB`);
      onChange(null);
      return;
    }

    onChange(file);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onChange(null);
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div className="flex flex-col gap-2">
        {/* Preview */}
        {preview && (
          <div className="relative inline-block">
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg border border-gray-300"
            />
            <button
              type="button"
              onClick={handleClear}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
            >
              ×
            </button>
          </div>
        )}

        {/* Input oculto */}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Botón de carga */}
        <button
          type="button"
          onClick={handleClick}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-fit"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          {preview ? "Cambiar archivo" : "Seleccionar archivo"}
        </button>

        {/* Texto de ayuda */}
        <p className="text-xs text-gray-500">
          Tamaño máximo: {maxSize}MB
          {accept && ` | Formatos: ${accept}`}
        </p>

        {/* Error */}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
