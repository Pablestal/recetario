import { useAuthStore } from "../../stores/useAuthStore";

const ProtectedRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);

  // If user is not authenticated, don't render anything
  // The RouteGuard will handle the navigation and modal
  if (!user) {
    return null;
  }

  // If user is authenticated, render the protected content
  return children;
};

export default ProtectedRoute;
