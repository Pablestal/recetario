import { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";
import { routes } from "../../routes";

const ProtectedRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const openLoginModal = useAuthStore((state) => state.openLoginModal);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      openLoginModal(() => navigate(location.pathname, { replace: true }));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return <Navigate to={routes.recipes} replace />;

  return children;
};

export default ProtectedRoute;
