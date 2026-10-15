"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ScreenshotGalleryProps {
  screenshots: string[];
  onRemove?: (index: number) => void;
}

export function ScreenshotGallery({ screenshots, onRemove }: ScreenshotGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (screenshots.length === 0) {
    return null;
  }

  const handlePrev = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null && selectedIndex < screenshots.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {screenshots.map((url, index) => (
          <div
            key={index}
            className="group relative cursor-pointer overflow-hidden rounded-lg"
            style={{ background: "var(--surface-raised)" }}
            onClick={() => setSelectedIndex(index)}
          >
            <img
              src={url}
              alt={`Screenshot ${index + 1}`}
              className="h-24 w-full object-cover transition-transform group-hover:scale-105"
            />
            {onRemove && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(index);
                }}
                className="absolute right-1 top-1 rounded-full p-1 opacity-0 transition-opacity group-hover:opacity-100"
                style={{ background: "var(--surface-page)", color: "var(--text-primary)" }}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0, 0, 0, 0.8)" }}
          onClick={() => setSelectedIndex(null)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            disabled={selectedIndex === 0}
            className="absolute left-4 rounded-full p-2 transition-colors disabled:opacity-50"
            style={{ background: "var(--surface-card)", color: "var(--text-primary)" }}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <img
            src={screenshots[selectedIndex]}
            alt={`Screenshot ${selectedIndex + 1}`}
            className="max-h-[80vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            disabled={selectedIndex === screenshots.length - 1}
            className="absolute right-4 rounded-full p-2 transition-colors disabled:opacity-50"
            style={{ background: "var(--surface-card)", color: "var(--text-primary)" }}
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div
            className="absolute bottom-4 text-[12px]"
            style={{ color: "var(--text-muted)" }}
          >
            {selectedIndex + 1} / {screenshots.length}
          </div>
        </div>
      )}
    </>
  );
}
