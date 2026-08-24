import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Fixes mobile scroll position bug:
// Without this, navigating to a new page keeps the previous page's scroll position.
// This component listens to every route change and scrolls back to the top.
export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};