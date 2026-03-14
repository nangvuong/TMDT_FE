import { useLayoutEffect } from 'react';

/**
 * Custom hook to reset scroll position to top when component mounts
 * Runs synchronously before paint to prevent visual jump
 * @param deps Optional dependency array (defaults to empty = run on mount only)
 */
export const useScrollReset = (deps: any[] = []) => {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, deps);
};
