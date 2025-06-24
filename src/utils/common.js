import { useMediaQuery } from "@mui/material";

/**
 * Custom breakpoint for recipe app
 * Simple two-tier responsive system: Mobile/Tablet vs Desktop
 */
export const BREAKPOINT_DESKTOP = 1024;

/**
 * Hook to detect mobile/tablet devices (< 1024px)
 * Includes phones and tablets
 */
export const useIsMobile = () => {
  return useMediaQuery(`(max-width: ${BREAKPOINT_DESKTOP - 1}px)`);
};

/**
 * Hook to detect desktop devices (>= 1024px)
 * Includes laptops, desktops, and large screens
 */
export const useIsDesktop = () => {
  return useMediaQuery(`(min-width: ${BREAKPOINT_DESKTOP}px)`);
};

/**
 * Hook for screen orientation detection
 * Useful for mobile devices in different orientations
 */
export const useOrientation = () => {
  const isPortrait = useMediaQuery("(orientation: portrait)");
  const isLandscape = useMediaQuery("(orientation: landscape)");

  return {
    isPortrait,
    isLandscape,
  };
};

/**
 * Hook to detect Safari browser
 * Useful for Safari-specific styling or behavior adjustments
 */
export const useIsSafari = () => {
  if (typeof window === "undefined") return false;

  const userAgent = window.navigator.userAgent;
  const isSafari =
    /Safari/.test(userAgent) &&
    !/Chrome/.test(userAgent) &&
    !/Chromium/.test(userAgent);

  return isSafari;
};
