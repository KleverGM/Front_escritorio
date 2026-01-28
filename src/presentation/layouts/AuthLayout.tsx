import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <div className="font-extrabold text-brand">Cursos Online</div>
            <div className="text-xs text-slate-500">Área pública</div>
          </div>

          <nav className="flex gap-4 text-sm">
            <Link to="/" className="text-slate-700 hover:text-slate-900">Inicio</Link>
            <Link to="/register" className="text-brand hover:opacity-90">Registrarse</Link>
            <Link to="/login" className="text-brand hover:opacity-90">Iniciar sesión</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
