import { Outlet, useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "../components/Header";

export default function PrivateLayout({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[320px_1fr] bg-gray-50 text-slate-900 overflow-x-hidden">
      <Sidebar onLogout={onLogout} />

      <div className="flex flex-col overflow-x-hidden">
        <header className="border-b border-gray-200 bg-white px-6 py-4">
          <div className="max-w-6xl mx-auto relative flex items-center justify-between">
            <div />

            <div className="absolute left-1/2 transform -translate-x-1/2">
              <SearchControl />
            </div>

            <div>
              <Header onLogout={onLogout} />
            </div>
          </div>
        </header>

        <main className="p-6 flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
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
        className="border border-gray-200 rounded px-3 py-1 w-72 md:w-96"
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
