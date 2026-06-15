import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAdminSession } from "../../lib/adminSession";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const { loading, profile, error } = useAdminSession();
  const location = useLocation();

  if (loading) {
    return (
      <div className="admin-bootstrap">
        <p>Verificando sesión…</p>
      </div>
    );
  }
  if (!profile) {
    if (error) {
      return (
        <div className="admin-bootstrap">
          <div className="admin-bootstrap-card">
            <h2>Acceso restringido</h2>
            <p>{error}</p>
            <a href="/admin/login" className="admin-btn">Volver al login</a>
          </div>
        </div>
      );
    }
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }
  return <>{children}</>;
}
