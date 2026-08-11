import { Navigate } from "react-router-dom";

const ProtectedRoute = ({
  children,
  user,
  role,
}) => {
  if (!user) {
    return <Navigate to="/" />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;