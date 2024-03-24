import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function useScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error while scrolling to top:', error);
    }
  }, [pathname]);

  useEffect(() => {
    let isMounted = true;

    const scrollToTop = () => {
      if (isMounted) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    scrollToTop();

    return () => {
      isMounted = false;
    };
  }, []);

  return null;
}

export default useScrollToTop;