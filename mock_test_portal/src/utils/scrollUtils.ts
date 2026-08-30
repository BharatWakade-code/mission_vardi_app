import { useEffect, useRef } from 'react';

/**
 * Universal Horizontal Scroll Enhancer
 * - Converts vertical mouse wheel to horizontal scrolling when cursor is over horizontal list
 * - Enables click-and-drag horizontal panning on desktop
 * - Preserves native touch swiping on mobile devices
 */
export function enableHorizontalScroll(el: HTMLElement | null): () => void {
  if (!el) return () => {};

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;
  let isDragging = false;

  // 1. Mouse Wheel Handler
  const onWheel = (e: WheelEvent) => {
    // If element is scrollable horizontally
    if (el.scrollWidth > el.clientWidth) {
      // If mostly vertical wheel scroll and not holding shift
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && !e.shiftKey) {
        // Check if there is room to scroll horizontally
        const canScrollLeft = el.scrollLeft > 0;
        const canScrollRight = el.scrollLeft < el.scrollWidth - el.clientWidth - 1;

        if ((e.deltaY > 0 && canScrollRight) || (e.deltaY < 0 && canScrollLeft)) {
          e.preventDefault();
          el.scrollLeft += e.deltaY * 0.95;
        }
      }
    }
  };

  // 2. Drag-to-Scroll Handlers
  const onMouseDown = (e: MouseEvent) => {
    // Only primary button
    if (e.button !== 0) return;
    // Don't intercept button/input clicks
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA') {
      return;
    }

    isDown = true;
    isDragging = false;
    startX = e.pageX - el.offsetLeft;
    scrollLeft = el.scrollLeft;
    el.style.cursor = 'grabbing';
    el.style.userSelect = 'none';
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDown) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag speed multiplier
    if (Math.abs(walk) > 5) {
      isDragging = true;
    }
    el.scrollLeft = scrollLeft - walk;
  };

  const onMouseUp = (e: MouseEvent) => {
    if (isDown) {
      isDown = false;
      el.style.cursor = 'grab';
      el.style.removeProperty('user-select');
    }
  };

  const onMouseLeave = () => {
    if (isDown) {
      isDown = false;
      el.style.cursor = '';
      el.style.removeProperty('user-select');
    }
  };

  // Set initial cursor style if overflowed
  if (el.scrollWidth > el.clientWidth) {
    el.style.cursor = 'grab';
  }

  el.addEventListener('wheel', onWheel, { passive: false });
  el.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
  el.addEventListener('mouseleave', onMouseLeave);

  return () => {
    el.removeEventListener('wheel', onWheel);
    el.removeEventListener('mousedown', onMouseDown);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
    el.removeEventListener('mouseleave', onMouseLeave);
  };
}

/**
 * Custom React Hook for Horizontal Scrollable containers
 */
export function useHorizontalScroll<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cleanup = enableHorizontalScroll(el);
    return cleanup;
  }, []);

  const scrollByDirection = (direction: 'left' | 'right', amount: number = 280) => {
    if (ref.current) {
      const scrollAmt = direction === 'left' ? -amount : amount;
      ref.current.scrollBy({ left: scrollAmt, behavior: 'smooth' });
    }
  };

  return { ref, scrollByDirection };
}
