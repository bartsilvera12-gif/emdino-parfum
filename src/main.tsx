import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./styles/global.css";
import "./styles/layout.css";
import "./styles/components.css";
import "./styles/admin.css";

import PublicApp from "./PublicApp";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminCombos from "./pages/admin/AdminCombos";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminSettings from "./pages/admin/AdminSettings";
import ProtectedRoute from "./components/admin/ProtectedRoute";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/productos"
          element={
            <ProtectedRoute>
              <AdminProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categorias"
          element={
            <ProtectedRoute>
              <AdminCategories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/combos"
          element={
            <ProtectedRoute>
              <AdminCombos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/pedidos"
          element={
            <ProtectedRoute>
              <AdminOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/clientes"
          element={
            <ProtectedRoute>
              <AdminCustomers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/configuracion"
          element={
            <ProtectedRoute>
              <AdminSettings />
            </ProtectedRoute>
          }
        />
        <Route path="/*" element={<PublicApp />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
