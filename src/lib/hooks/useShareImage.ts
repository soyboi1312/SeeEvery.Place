/**
 * useShareImage hook
 * Handles image generation, downloading, and sharing logic for ShareCard
 */
'use client';

import { useState, useCallback, RefObject } from 'react';

interface UseShareImageOptions {
  cardRef: RefObject<HTMLDivElement | null>;
  category: string;
}

interface UseShareImageReturn {
  isDownloading: boolean;
  downloadImage: () => Promise<void>;
  shareOrCopyImage: () => Promise<void>;
}

export function useShareImage({ cardRef, category }: UseShareImageOptions): UseShareImageReturn {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadImage = useCallback(async () => {
    if (!cardRef.current) return;

    setIsDownloading(true);

    try {
      // Dynamically import html-to-image
      const { toPng } = await import('html-to-image');

      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });

      const link = document.createElement('a');
      link.download = `my-${category}-map.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to generate image:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  }, [cardRef, category]);

  const shareOrCopyImage = useCallback(async () => {
    if (!cardRef.current) return;

    setIsDownloading(true);

    try {
      const { toBlob } = await import('html-to-image');

      const blob = await toBlob(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });

      if (!blob) {
        throw new Error('Failed to generate image');
      }

      // Try Web Share API first (works well on iOS/mobile)
      if (navigator.share && navigator.canShare) {
        const file = new File([blob], `my-${category}-map.png`, { type: 'image/png' });
        const shareData = { files: [file] };

        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          return;
        }
      }

      // Fall back to clipboard API (desktop browsers)
      if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        alert('Image copied to clipboard!');
        return;
      }

      // If neither works, suggest download
      alert('Sharing not supported on this device. Please use Download instead.');
    } catch (error) {
      // User cancelled share dialog - not an error
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      console.error('Failed to copy/share image:', error);
      alert('Failed to share. Try downloading instead.');
    } finally {
      setIsDownloading(false);
    }
  }, [cardRef, category]);

  return {
    isDownloading,
    downloadImage,
    shareOrCopyImage,
  };
}
