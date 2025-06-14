'use client';
import { useState, useRef, useEffect } from 'react';

const DEFAULT_OPTIONS = {
  events: ["keydown", "mousemove", "touchmove", "click", "scroll", "wheel"],
  initialState: true
};
function useIdle(timeout, options) {
  const { events, initialState } = { ...DEFAULT_OPTIONS, ...options };
  const [idle, setIdle] = useState(initialState);
  const timer = useRef(-1);
  useEffect(() => {
    const handleEvents = () => {
      setIdle(false);
      if (timer.current) {
        window.clearTimeout(timer.current);
      }
      timer.current = window.setTimeout(() => {
        setIdle(true);
      }, timeout);
    };
    events.forEach((event) => document.addEventListener(event, handleEvents));
    timer.current = window.setTimeout(() => {
      setIdle(true);
    }, timeout);
    return () => {
      events.forEach((event) => document.removeEventListener(event, handleEvents));
      window.clearTimeout(timer.current);
      timer.current = -1;
    };
  }, [timeout]);
  return idle;
}

export { useIdle };
//# sourceMappingURL=use-idle.mjs.map
