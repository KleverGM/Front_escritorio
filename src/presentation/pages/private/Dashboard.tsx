import React, { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { publicHttp, authHttp } from "../../../infrastructure/http/httpClients";
import { useAuth } from "../../../application/auth/useAuth";
import {
  DashboardWelcome,
  DashboardGreeting,
  CoursesKpi,
  MyCoursesPanel,
  NotificationsPanel,
  DashboardActions,
} from "../../components/dashboard";
import { LoadingSpinner } from "../../components/common";

const Dashboard: React.FC = () => {
  const [totalCourses, setTotalCourses] = useState<number | null>(null);
  const [welcome, setWelcome] = useState<string | null>(null);
  const [myCourses, setMyCourses] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const location = useLocation() as any;
  const { isAuthenticated, user } = useAuth() as {
    isAuthenticated: boolean;
    user: any | null;
  };

  // fallback: try decode access token from localStorage if useAuth.user is not available
  function decodeLocalTokenName() {
    try {
      const token = localStorage.getItem("cursos_access");
      if (!token) return null;
      const parts = token.split(".");
      if (parts.length < 2) return null;
      const payload = parts[1];
      const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
      const obj = JSON.parse(decodeURIComponent(escape(json)));
      return (
        obj.user?.first_name ??
        obj.first_name ??
        obj.user?.username ??
        obj.username ??
        obj.user?.email ??
        obj.email ??
        null
      );
    } catch {
      return null;
    }
  }

  function decodeLocalTokenPayload() {
    try {
      const token = localStorage.getItem("cursos_access");
      if (!token) return null;
      const parts = token.split(".");
      if (parts.length < 2) return null;
      const payload = parts[1];
      const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
      const obj = JSON.parse(decodeURIComponent(escape(json)));
      return obj;
    } catch {
      return null;
    }
  }

  useEffect(() => {
    let mounted = true;
    publicHttp
      .get("/cursos/")
      .then((res) => {
        if (!mounted) return;
        const count = res?.data?.count ?? null;
        setTotalCourses(count);
      })
      .catch(() => {
        if (!mounted) return;
        setTotalCourses(null);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    try {
      const v = location?.state?.justLoggedIn;
      if (v) {
        setWelcome(
          "Bienvenido — ¡qué bueno verte! Empieza explorando tus cursos.",
        );
        // clear state navigation to avoid showing again if user navigates back
        if (history?.replaceState) history.replaceState({}, "");
      }
    } catch {}
  }, [location]);

  useEffect(() => {
    let mounted = true;
    if (!isAuthenticated) {
      setMyCourses([]);
      setNotifications([]);
      return;
    }

    setMyCourses([]);

    authHttp
      .get("/inscripciones/")
      .then((res) => {
        if (!mounted) return;
        const data = res?.data ?? [];
        const items = Array.isArray(data) ? data : (data.results ?? []);
        if (!Array.isArray(items) || items.length === 0) {
          setMyCourses([]);
          return;
        }

        const payload = decodeLocalTokenPayload();
        const currentUserId =
          user?.id ?? payload?.user_id ?? payload?.id ?? null;

        const filtered = items.filter((ins: any) => {
          const uid = ins.usuario?.id ?? ins.usuario ?? ins.user_id ?? null;
          if (!currentUserId) return false;
          return String(uid) === String(currentUserId);
        });

        const courses = filtered.map(
          (ins: any) =>
            ins.curso ?? { id: ins.curso_id, titulo: ins.curso_title },
        );
        setMyCourses(courses);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.warn("Failed to load inscripciones", err);
        if (!mounted) return;
        setMyCourses([]);
      });

    return () => {
      mounted = false;
    };
  }, [isAuthenticated, user]);

  // Obtener el rol del usuario
  const payload = decodeLocalTokenPayload();
  const userRole =
    user?.tipo_usuario ||
    user?.perfil ||
    user?.role ||
    user?.type ||
    payload?.tipo_usuario ||
    payload?.perfil ||
    payload?.role ||
    payload?.type;

  if (isAuthenticated && !userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Redirigir instructores y admins a sus paneles específicos
  if (userRole === "admin" || userRole === "administrador") {
    return <Navigate to="/app/admin" replace />;
  }

  if (userRole === "instructor") {
    return <Navigate to="/app/instructor" replace />;
  }

  // El resto del código es para estudiantes
  return (
    <div className="p-6">
      <DashboardWelcome message={welcome} />

      {(() => {
        const nameFromHook = user
          ? user.first_name || user.username || user.email || null
          : null;
        const name = nameFromHook ?? decodeLocalTokenName();
        return <DashboardGreeting name={name} />;
      })()}

      {/* debug panel removed */}

      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
          Resumen
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          {userRole === "instructor"
            ? "Gestiona tus cursos y revisa el progreso de tus estudiantes."
            : userRole === "admin" || userRole === "administrador"
              ? "Administra el sistema y revisa estadísticas globales."
              : "Descubre novedades y sigue avanzando en tu aprendizaje."}
        </p>
      </div>

      {/* KPI: show number of courses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        <CoursesKpi
          label={
            userRole === "instructor" ? "Mis cursos" : "Mis cursos en progreso"
          }
          count={Array.isArray(myCourses) ? myCourses.length : 0}
        />
        <CoursesKpi label="Total de cursos" count={totalCourses ?? 0} />
        <CoursesKpi label="Notificaciones" count={notifications.length} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MyCoursesPanel courses={myCourses} userRole={userRole} />

        {/* Notificaciones: render only when there is data */}
        <NotificationsPanel notifications={notifications} />
      </div>

      <DashboardActions />

      {/* debug inscripciones removed */}

      {/* admin global inscripciones removed */}
    </div>
  );
};

export default Dashboard;
