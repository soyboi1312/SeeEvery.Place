/**
 * useMobileTap Hook
 * Detects tap/click gestures on both mobile and desktop.
 *
 * Replaces standard onClick and onTouch handlers to bypass issues where
 * drag/zoom libraries (like D3/react-simple-maps) swallow click events.
 */
import { useCallback, useRef } from 'react';

interface PointerState {
  startX: number;
  startY: number;
  startTime: number;
  isDown: boolean;
}

// Maximum duration (ms) for a touch/click to be considered a tap
const MAX_TAP_DURATION = 500;
// Maximum movement (px) for a touch/click to be considered a tap
// 30px accounts for "fat finger" wobble on high-DPI tablet screens
const MAX_TAP_DISTANCE = 30;

export function useMobileTap(onTap: () => void) {
  const state = useRef<PointerState>({
    startX: 0,
    startY: 0,
    startTime: 0,
    isDown: false,
  });

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    // Only process primary button (left click) or touch contact
    if (e.button !== 0) return;

    state.current = {
      startX: e.clientX,
      startY: e.clientY,
      startTime: Date.now(),
      isDown: true,
    };
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    // If we weren't tracking a down event, ignore
    if (!state.current.isDown) return;

    // Reset state
    state.current.isDown = false;

    const { startX, startY, startTime } = state.current;
    const duration = Date.now() - startTime;
    const dist = Math.sqrt(
      Math.pow(e.clientX - startX, 2) +
      Math.pow(e.clientY - startY, 2)
    );

    // If it was a quick tap without much movement
    if (duration < MAX_TAP_DURATION && dist < MAX_TAP_DISTANCE) {
      // REMOVED: e.preventDefault()
      // We must allow the event to bubble so d3-zoom receives the 'up' signal
      // and terminates the drag gesture. This fixes "sticky cursor" on iPad
      // Magic Keyboard where the map gets stuck to the cursor after a click.
      // We rely on 'touch-action: none' in CSS to prevent browser gestures.

      onTap();
    }
  }, [onTap]);

  // We also need to handle cases where the pointer leaves or is cancelled
  // to prevent "stuck" down states
  const onPointerLeave = useCallback(() => {
    if (state.current.isDown) {
      state.current.isDown = false;
    }
  }, []);

  return {
    onPointerDown,
    onPointerUp,
    onPointerLeave,
    // Map pointercancel to leave to handle interruptions (e.g. system gestures)
    onPointerCancel: onPointerLeave
  };
}
