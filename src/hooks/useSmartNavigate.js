import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

// List of protected routes
const PROTECTED_ROUTES = ["/recipe-creation"];

/**
 * Smart navigate hook that automatically handles protected routes.
 * Works like regular useNavigate but intercepts navigation to protected routes
 * when user is not authenticated.
 */
export const useSmartNavigate = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const setRedirectPath = useAuthStore((state) => state.setRedirectPath);
  const openLoginModal = useAuthStore((state) => state.openLoginModal);

  const smartNavigate = (path, options) => {
    // Check if path is protected
    const isProtected = PROTECTED_ROUTES.some(
      (route) => path === route || path.startsWith(route + "/")
    );

    if (isProtected && !user) {
      // User not authenticated - save path and open modal
      setRedirectPath(path);
      openLoginModal();
    } else {
      // User authenticated or route not protected - navigate normally
      navigate(path, options);
    }
  };

  return smartNavigate;
};
