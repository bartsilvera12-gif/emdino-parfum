import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Package, Tags, Boxes, ShoppingBag, Users, Settings, LogOut, Menu, X,
} from "lucide-react";
import { signOut, useAdminSession } from "../../lib/adminSession";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/productos", label: "Perfumes", icon: Package },
  { to: "/admin/categorias", label: "Categorías", icon: Tags },
  { to: "/admin/combos", label: "Combos", icon: Boxes },
  { to: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  { to: "/admin/clientes", label: "Clientes", icon: Users },
  { to: "/admin/configuracion", label: "Configuración", icon: Settings },
];

interface Props {
  title?: string;
  eyebrow?: string;
  children: React.ReactNode;
}

export default function AdminLayout({ title, eyebrow, children }: Props) {
  const [openMobile, setOpenMobile] = useState(false);
  const { profile } = useAdminSession();
  const navigate = useNavigate();

  const onLogout = async () => {
    await signOut();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="admin-root">
      <aside className={"admin-sidebar" + (openMobile ? " open" : "")}>
        <div className="admin-sidebar-head">
          <Link to="/admin" className="admin-brand">
            <span className="admin-brand-mark">E</span>
            <span className="admin-brand-text">
              <strong>Emdino</strong>
              <span>Admin</span>
            </span>
          </Link>
          <button className="admin-close" onClick={() => setOpenMobile(false)} aria-label="Cerrar menú">
            <X size={20} />
          </button>
        </div>

        <nav className="admin-nav">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => "admin-nav-link" + (isActive ? " active" : "")}
              onClick={() => setOpenMobile(false)}
            >
              <l.icon size={17} />
              <span>{l.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-foot">
          {profile && (
            <div className="admin-user">
              <div className="admin-user-avatar">{(profile.email || "?").slice(0, 1).toUpperCase()}</div>
              <div className="admin-user-info">
                <span className="admin-user-email" title={profile.email || ""}>{profile.email || "—"}</span>
                <span className="admin-user-role">{profile.role}</span>
              </div>
            </div>
          )}
          <button className="admin-logout" onClick={onLogout}>
            <LogOut size={16} /> Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="admin-shell">
        <header className="admin-topbar">
          <button className="admin-hamburger" onClick={() => setOpenMobile(true)} aria-label="Abrir menú">
            <Menu size={22} />
          </button>
          <div className="admin-topbar-titles">
            {eyebrow && <p className="admin-eyebrow">{eyebrow}</p>}
            {title && <h1 className="admin-h1">{title}</h1>}
          </div>
          <a href="/" className="admin-view-store" target="_blank" rel="noopener">Ver tienda →</a>
        </header>
        <main className="admin-main">{children}</main>
      </div>

      {openMobile && <div className="admin-backdrop" onClick={() => setOpenMobile(false)} />}
    </div>
  );
}
