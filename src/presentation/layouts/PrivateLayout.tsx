import { Outlet, useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "../components/Header";

export default function PrivateLayout({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[320px_1fr] bg-gray-50 text-slate-900 overflow-x-hidden dark:bg-slate-900 dark:text-slate-100">
      <Sidebar onLogout={onLogout} />

      <div className="flex flex-col overflow-x-hidden">
        <header className="border-b border-gray-200 bg-white px-6 py-4 dark:bg-slate-900 dark:border-slate-700">
          <div className="max-w-6xl mx-auto w-full grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto] md:items-center">
            <div className="flex justify-center md:justify-center">
              <SearchControl />
            </div>
            <div className="flex justify-end">
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
    <form
      onSubmit={submitSearch}
      className="flex items-center justify-center gap-2 flex-wrap md:flex-nowrap w-full"
    >
      <label htmlFor="header-search" className="sr-only">
        Buscar cursos
      </label>
      <input
        id="header-search"
        ref={inputRef}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar cursos..."
        className="border border-gray-200 rounded px-3 py-1 w-full max-w-md md:w-96 bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700"
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
        className="text-sm text-slate-600 dark:text-slate-300"
      >
        Cancelar
      </button>
    </form>
  );
}
