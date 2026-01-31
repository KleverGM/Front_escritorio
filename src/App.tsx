import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAuth } from "./application/auth/useAuth";

import PublicLayout from "./presentation/layouts/PublicLayout";
import AuthLayout from "./presentation/layouts/AuthLayout";
import PrivateLayout from "./presentation/layouts/PrivateLayout";
import CursosHomeLayout from "./presentation/layouts/CursosHomeLayout";
import RequireAuth from "./presentation/routing/RequireAuth";

// Páginas públicas
import Home from "./presentation/pages/public/Home";
import Login from "./presentation/pages/public/Login";
import Register from "./presentation/pages/public/Register";
import Acerca from "./presentation/pages/public/Acerca";
import Precios from "./presentation/pages/public/Precios";
import Contacto from "./presentation/pages/public/Contacto";
import Faq from "./presentation/pages/public/Faq";

// Páginas privadas generales
import Dashboard from "./presentation/pages/private/Dashboard";
import Profile from "./presentation/pages/private/Profile";
import EditProfile from "./presentation/pages/private/EditProfile";
import Notificaciones from "./presentation/pages/private/Notificaciones";
import CrearNotificacion from "./presentation/pages/private/CrearNotificacion";
import Avisos from "./presentation/pages/private/Avisos";
import CrearAviso from "./presentation/pages/private/CrearAviso";
import CursosHome from "./presentation/pages/private/CursosHome";
import CrearCursosLayouts from "./presentation/layouts/CrearCursosLayouts";
import CatalogoCursos from "./presentation/pages/private/CatalogoCursos";
import DetalleCurso from "./presentation/pages/private/DetalleCurso";
import CursoContenido from "./presentation/pages/private/CursoContenido";
import CursoResenas from "./presentation/pages/private/CursoResenas";
import MisCursos from "./presentation/pages/private/MisCursos";
import ProgresoSecciones from "./presentation/pages/private/ProgresoSecciones";
import MisCompras from "./presentation/pages/private/MisCompras";

// Páginas de admin
import AdminDashboard from "./presentation/pages/private/AdminDashboard";
import {
  GestionUsuarios,
  EditarUsuario,
  CrearUsuario,
  GestionCursos,
  EditarCurso,
  CrearCurso,
  DetalleCursoAdmin,
  GestionInscripciones,
  EditarInscripcion,
  GestionResenas,
  GestionModulos,
  GestionAvisos,
  EstadisticasGlobales,
  EstadisticasCurso,
  AnalyticsDashboard,
} from "./presentation/pages/private/admin";

// Páginas de instructor
import {
  InstructorDashboard,
  GestionMisCursos,
  MisResenas,
  MisEstudiantes,
  EstadisticasCurso as EstadisticasCursoInstructor,
} from "./presentation/pages/private/instructor";

export default function App() {
  const auth = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/acerca" element={<Acerca />} />
          <Route path="/precios" element={<Precios />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/faq" element={<Faq />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login onLogin={auth.login} />} />
          <Route
            path="/register"
            element={
              <Register
                onRegister={(u, e, p, f, l, t) =>
                  auth.register({
                    username: u,
                    email: e,
                    password: p,
                    first_name: f,
                    last_name: l,
                    tipo_usuario: t,
                  })
                }
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

          {/* Rutas de admin */}
          <Route path="admin">
            <Route index element={<AdminDashboard />} />

            {/* Gestión de usuarios */}
            <Route path="usuarios" element={<GestionUsuarios />} />
            <Route path="usuarios/crear" element={<CrearUsuario />} />
            <Route path="usuarios/:id" element={<EditarUsuario />} />

            {/* Gestión de cursos */}
            <Route path="cursos" element={<GestionCursos />} />
            <Route path="cursos/crear" element={<CrearCurso />} />
            <Route path="cursos/:id" element={<DetalleCursoAdmin />} />
            <Route path="cursos/:id/editar" element={<EditarCurso />} />
            <Route path="cursos/:id/modulos" element={<GestionModulos />} />

            {/* Gestión de inscripciones */}
            <Route path="inscripciones" element={<GestionInscripciones />} />
            <Route path="inscripciones/:id" element={<EditarInscripcion />} />

            {/* Gestión de reseñas */}
            <Route path="resenas" element={<GestionResenas />} />

            {/* Gestión de avisos */}
            <Route path="avisos" element={<GestionAvisos />} />

            {/* Estadísticas */}
            <Route path="estadisticas" element={<EstadisticasGlobales />} />
            <Route
              path="estadisticas/curso/:id"
              element={<EstadisticasCurso />}
            />
            <Route path="analytics" element={<AnalyticsDashboard />} />
          </Route>

          {/* Rutas de instructor */}
          <Route path="instructor">
            <Route index element={<InstructorDashboard />} />
            <Route path="cursos" element={<GestionMisCursos />} />
            <Route path="cursos/crear" element={<CrearCurso />} />
            <Route path="cursos/:id/editar" element={<EditarCurso />} />
            <Route path="cursos/:id/modulos" element={<GestionModulos />} />
            <Route
              path="cursos/:id/estadisticas"
              element={<EstadisticasCursoInstructor />}
            />
            <Route path="estudiantes" element={<MisEstudiantes />} />
            <Route path="resenas" element={<MisResenas />} />
          </Route>

          {/* Rutas de cursos */}
          <Route path="cursos">
            <Route index element={<CatalogoCursos />} />
            <Route path="mis-cursos" element={<MisCursos />} />
            <Route path=":id" element={<DetalleCurso />} />
            <Route path=":id/contenido" element={<CursoContenido />} />
            <Route path=":id/resenas" element={<CursoResenas />} />
          </Route>

          {/* Ruta legacy de cursos home */}
          <Route
            path="cursos-home"
            element={
              <RequireAuth isAuthenticated={auth.isAuthenticated}>
                <CursosHomeLayout onLogout={auth.logout} />
              </RequireAuth>
            }
          >
            <Route index element={<CursosHome />} />
            <Route path="create" element={<CrearCursosLayouts />} />
          </Route>

          {/* Notificaciones */}
          <Route path="notificaciones">
            <Route index element={<Notificaciones />} />
            <Route path="crear" element={<CrearNotificacion />} />
          </Route>

          {/* Avisos */}
          <Route path="avisos">
            <Route index element={<Avisos />} />
            <Route path="crear" element={<CrearAviso />} />
          </Route>

          {/* Perfil */}
          <Route path="profile">
            <Route index element={<Profile />} />
            <Route path="edit" element={<EditProfile />} />
          </Route>

          {/* Progreso por sección */}
          <Route path="progreso-secciones" element={<ProgresoSecciones />} />

          {/* Mis compras */}
          <Route path="purchases" element={<MisCompras />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
