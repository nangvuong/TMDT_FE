import { useEffect } from 'react';

/**
 * Custom hook to update the page title
 * @param title - The title to set for the page
 */
export const usePageTitle = (title: string) => {
  useEffect(() => {
    document.title = title;
    
    // Cleanup: restore default title on unmount (optional)
    return () => {
      // This could be set to a default app title if needed
    };
  }, [title]);
};

export default usePageTitle;
