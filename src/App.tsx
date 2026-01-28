import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAuth } from "./application/auth/useAuth";

import PublicLayout from "./presentation/layouts/PublicLayout";
import AuthLayout from "./presentation/layouts/AuthLayout";
import PrivateLayout from "./presentation/layouts/PrivateLayout";
import CursosHomeLayout from "./presentation/layouts/CursosHomeLayout";
import RequireAuth from "./presentation/routing/RequireAuth";

import Home from "./presentation/pages/public/Home";
import Login from "./presentation/pages/public/Login";
import Register from "./presentation/pages/public/Register";
import Dashboard from "./presentation/pages/private/Dashboard";
import CursosHome from "./presentation/pages/private/CursosHome";
import CrearCursosLayouts from "./presentation/layouts/CrearCursosLayouts";
import CrearNotificacion from "./presentation/pages/private/CrearNotificacion";
import Notificaciones from "./presentation/pages/private/Notificaciones";

export default function App() {
  const auth = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login onLogin={auth.login} />} />
          <Route
            path="/register"
            element={
              <Register
                onRegister={(u, e, p, f, l, t) => auth.register({ username: u, email: e, password: p, first_name: f, last_name: l, tipo_usuario: t })}
              />
            }
          />
        </Route>

        <Route
          path="/app"
          element={
            <RequireAuth isAuthenticated={auth.isAuthenticated}>
              <PrivateLayout onLogout={auth.logout} />
            </RequireAuth>
          }
        >
          <Route index element={<Dashboard />} />

          <Route
            path="cursos"
            element={
              <RequireAuth isAuthenticated={auth.isAuthenticated}>
                <CursosHomeLayout onLogout={auth.logout} />
              </RequireAuth>
            }
          >
            <Route index element={<CursosHome />} />
            <Route path="create" element={<CrearCursosLayouts />} />
          </Route>
            <Route path="notificaciones">
              <Route index element={<Notificaciones />} />
              <Route path="create" element={<CrearNotificacion />} />
            </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
