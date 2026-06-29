import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const scrollPageToTop = (behavior = 'auto') => {
  window.scrollTo({ top: 0, left: 0, behavior });
};

export default function ScrollToTop() {
  const navigate = useNavigate();
  const { pathname, search, hash } = useLocation();
  const navigationTimer = useRef(null);

  useLayoutEffect(() => {
    scrollPageToTop();
  }, [pathname, search, hash]);

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';

    const handleLinkClick = (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const link = event.target.closest('a[href]');
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return;

      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin) return;

      event.preventDefault();
      window.clearTimeout(navigationTimer.current);

      const nextLocation = `${destination.pathname}${destination.search}${destination.hash}`;
      const currentLocation = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      const shouldAnimate = window.scrollY > 8;

      scrollPageToTop(shouldAnimate ? 'smooth' : 'auto');

      navigationTimer.current = window.setTimeout(() => {
        if (nextLocation !== currentLocation) navigate(nextLocation);
        else scrollPageToTop();
      }, shouldAnimate ? 500 : 0);
    };

    document.addEventListener('click', handleLinkClick, true);
    return () => {
      document.removeEventListener('click', handleLinkClick, true);
      window.clearTimeout(navigationTimer.current);
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, [navigate]);

  return null;
}
