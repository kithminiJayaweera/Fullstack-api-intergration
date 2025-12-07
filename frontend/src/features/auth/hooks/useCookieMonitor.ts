import { useEffect, useRef } from 'react';

interface UseCookieMonitorOptions {
  cookieName: string;
  onCookieCleared: () => void;
  checkInterval?: number; // in milliseconds
  enabled?: boolean;
}

/**
 * Hook to monitor if a specific cookie exists
 * Calls onCookieCleared if the cookie is removed
 */
export const useCookieMonitor = ({
  cookieName,
  onCookieCleared,
  checkInterval = 5000,
  enabled = true,
}: UseCookieMonitorOptions) => {
  const previousCookieExists = useRef<boolean>(false);

  useEffect(() => {
    if (!enabled) return;

    // Check if cookie exists
    const cookieExists = () => {
      return document.cookie.split(';').some((cookie) => {
        return cookie.trim().startsWith(`${cookieName}=`);
      });
    };

    // Initialize the previous state
    previousCookieExists.current = cookieExists();

    const checkCookie = () => {
      const currentExists = cookieExists();

      // If cookie existed before but doesn't exist now, it was cleared
      if (previousCookieExists.current && !currentExists) {
        onCookieCleared();
      }

      previousCookieExists.current = currentExists;
    };

    // Check periodically
    const interval = setInterval(checkCookie, checkInterval);

    return () => clearInterval(interval);
  }, [cookieName, onCookieCleared, checkInterval, enabled]);
};
