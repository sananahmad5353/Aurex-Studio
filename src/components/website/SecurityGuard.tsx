'use client';

import { useEffect } from 'react';

/**
 * SecurityGuard - Client-side content protection component.
 * Renders nothing visible but attaches event listeners to prevent:
 * - Text selection (CSS + JS)
 * - Right-click context menu
 * - Drag and drop
 * - Common copy shortcuts (Ctrl+C, Ctrl+U, Ctrl+S, Ctrl+A, Ctrl+Shift+I, etc.)
 * - Image downloads (via drag and right-click)
 * - DevTools shortcuts
 */
export default function SecurityGuard() {
  useEffect(() => {
    // Prevent right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Prevent drag operations
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Prevent drop operations
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Prevent keyboard shortcuts for copying, viewing source, dev tools
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+C (copy), Ctrl+U (view source), Ctrl+S (save)
      // Ctrl+A (select all), Ctrl+P (print)
      // Ctrl+Shift+I (dev tools), Ctrl+Shift+J (console)
      // Ctrl+Shift+C (element inspector)
      // F12 (dev tools)
      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;

      if (ctrl && !shift) {
        if (['c', 'u', 's', 'a', 'p'].includes(e.key.toLowerCase())) {
          e.preventDefault();
          return false;
        }
      }

      if (ctrl && shift) {
        if (['i', 'j', 'c'].includes(e.key.toLowerCase())) {
          e.preventDefault();
          return false;
        }
      }

      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
    };

    // Prevent copy event
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };

    // Prevent cut event
    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };

    // Apply CSS to disable text selection globally
    document.documentElement.style.userSelect = 'none';
    document.documentElement.style.webkitUserSelect = 'none';
    document.documentElement.style.MozUserSelect = 'none';
    document.documentElement.style.msUserSelect = 'none';
    document.documentElement.style.webkitTouchCallout = 'none';

    // Prevent image drag by default
    document.documentElement.style.webkitDrag = 'none';

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('dragstart', handleDragStart, true);
    document.addEventListener('drop', handleDrop, true);
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('copy', handleCopy, true);
    document.addEventListener('cut', handleCut, true);

    // Add draggable="false" to all images
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      img.setAttribute('draggable', 'false');
      img.setAttribute('oncontextmenu', 'return false');
    });

    // MutationObserver to handle dynamically added images
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of Array.from(mutation.addedNodes)) {
          if (node instanceof HTMLImageElement) {
            node.setAttribute('draggable', 'false');
            node.setAttribute('oncontextmenu', 'return false');
          }
          if (node instanceof HTMLElement) {
            const imgs = node.querySelectorAll('img');
            imgs.forEach((img) => {
              img.setAttribute('draggable', 'false');
              img.setAttribute('oncontextmenu', 'return false');
            });
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('dragstart', handleDragStart, true);
      document.removeEventListener('drop', handleDrop, true);
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('copy', handleCopy, true);
      document.removeEventListener('cut', handleCut, true);
      observer.disconnect();

      document.documentElement.style.userSelect = '';
      document.documentElement.style.webkitUserSelect = '';
      document.documentElement.style.MozUserSelect = '';
      document.documentElement.style.msUserSelect = '';
      document.documentElement.style.webkitTouchCallout = '';
    };
  }, []);

  return null;
}