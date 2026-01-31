import { Outlet, useNavigate } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "../components/Header";

export default function PrivateLayout({ onLogout }: { onLogout: () => void }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 overflow-x-hidden">
      <div className="md:grid md:grid-cols-[320px_1fr] min-h-screen">
        {/* Desktop sidebar */}
        <aside className="hidden md:block">
          <Sidebar onLogout={onLogout} />
        </aside>

        <div className="flex flex-col">
          <header className="border-b border-gray-200 bg-white px-4 py-3">
            <div className="max-w-6xl mx-auto relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button className="md:hidden p-2 rounded hover:bg-gray-100" onClick={() => setSidebarOpen(true)} aria-label="Abrir menú">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div className="font-extrabold text-[#f59e0b]">Cursos Online</div>
              </div>

              <div className="absolute left-1/2 transform -translate-x-1/2 hidden sm:block">
                <SearchControl />
              </div>

              <div>
                <Header onLogout={onLogout} />
              </div>
            </div>
          </header>

          <main className="p-4 md:p-6 flex-1 overflow-x-hidden">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white p-4 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="font-extrabold text-[#f59e0b]">Cursos Online</div>
              <button className="p-2 rounded hover:bg-gray-100" onClick={() => setSidebarOpen(false)} aria-label="Cerrar menú">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <Sidebar onLogout={() => { setSidebarOpen(false); if (onLogout) onLogout(); }} />
          </div>
        </div>
      )}
    </div>
  );
}

function SearchControl() {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  function submitSearch(e?: React.FormEvent) {
    e?.preventDefault();
    const query = q.trim();
    if (query.length > 0) {
      navigate(`/app/cursos?q=${encodeURIComponent(query)}`);
      setQ("");
    }
  }

  return (
    <form onSubmit={submitSearch} className="flex items-center">
      <label htmlFor="header-search" className="sr-only">
        Buscar cursos
      </label>
      <input
        id="header-search"
        ref={inputRef}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar cursos..."
        className="border border-gray-200 rounded px-3 py-1 w-44 sm:w-72 md:w-96"
      />
      <button
        type="submit"
        className="ml-2 px-3 py-1 bg-[#f8b31d] rounded text-black font-medium"
      >
        Buscar
      </button>
      <button
        type="button"
        onClick={() => setQ("")}
        className="ml-2 text-sm text-slate-600"
      >
        Cancelar
      </button>
    </form>
  );
}
