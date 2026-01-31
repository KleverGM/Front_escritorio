import React, { useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";

export default function AuthLayout() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      setIsDark(true);
    } else if (stored === "light") {
      setIsDark(false);
    } else if (window.matchMedia) {
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white dark:bg-slate-950 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <div className="font-extrabold text-brand">Cursos Online</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Área pública
            </div>
          </div>

          <nav className="flex gap-4 text-sm items-center">
            <Link
              to="/"
              className="text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              Inicio
            </Link>
            <Link to="/register" className="text-brand hover:opacity-90">
              Registrarse
            </Link>
            <Link to="/login" className="text-brand hover:opacity-90">
              Iniciar sesión
            </Link>
            <button
              onClick={() => setIsDark((prev) => !prev)}
              className="ml-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800"
              aria-label={
                isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
              }
            >
              {isDark ? (
                <svg
                  className="h-5 w-5 text-yellow-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364-1.414 1.414M7.05 16.95l-1.414 1.414M16.95 16.95l1.414 1.414M7.05 7.05 5.636 5.636M12 8a4 4 0 100 8 4 4 0 000-8z"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5 text-slate-600 dark:text-slate-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                  />
                </svg>
              )}
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
