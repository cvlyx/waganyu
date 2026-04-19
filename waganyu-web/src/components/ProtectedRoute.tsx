import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireProfileComplete?: boolean;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireProfileComplete = false, requireAdmin = false }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#191414] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#1DB954] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to landing page if not authenticated
    return <Navigate to="/landing" state={{ from: location }} replace />;
  }

  if (requireProfileComplete && !user.profileComplete) {
    // Redirect to setup if profile is not complete
    return <Navigate to="/setup" state={{ from: location }} replace />;
  }

  if (requireAdmin && user.role !== "admin") {
    // Redirect to dashboard if not admin
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
