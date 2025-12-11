/**
 * useMobileTap Hook
 * Detects tap gestures on mobile devices that would otherwise be blocked by drag handlers.
 *
 * On mobile, the ZoomableGroup's D3 drag handling can intercept touch events,
 * preventing onClick handlers from firing. This hook provides onTouchStart/onTouchEnd
 * handlers that detect quick taps (short duration, minimal movement) and trigger a callback.
 */
import { useCallback, useRef } from 'react';

interface TouchState {
  startX: number;
  startY: number;
  startTime: number;
}

// Maximum duration (ms) for a touch to be considered a tap
// Increased to 500ms to be more forgiving
const MAX_TAP_DURATION = 500;
// Maximum movement (px) for a touch to be considered a tap
// Increased to 30px to account for "fat finger" wobble on high-DPI screens
const MAX_TAP_DISTANCE = 30;

export function useMobileTap(onTap: () => void) {
  const touchState = useRef<TouchState | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      touchState.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        startTime: Date.now(),
      };
    }
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchState.current) return;

    const state = touchState.current;
    // We don't nullify immediately if we want to debug, but strictly logic-wise:
    touchState.current = null;

    // Only process single-touch gestures
    if (e.changedTouches.length !== 1) return;

    const touch = e.changedTouches[0];
    const duration = Date.now() - state.startTime;
    const distanceX = Math.abs(touch.clientX - state.startX);
    const distanceY = Math.abs(touch.clientY - state.startY);
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    // If it was a quick tap without much movement, trigger the callback
    if (duration < MAX_TAP_DURATION && distance < MAX_TAP_DISTANCE) {
      // Prevent default to stop the browser from firing simulated mouse events
      // (mouseenter, click) which causes double-tap issues and sticky tooltips.
      if (e.cancelable) e.preventDefault();

      // Stop propagation to prevent parent zoom handlers from reacting if needed
      e.stopPropagation();

      onTap();
    }
  }, [onTap]);

  return { onTouchStart, onTouchEnd };
}
