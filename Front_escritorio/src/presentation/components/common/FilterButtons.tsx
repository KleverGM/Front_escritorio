import React from "react";

interface FilterButtonsProps {
  filter: "todos" | "leidos" | "no_leidos";
  onFilterChange: (filter: "todos" | "leidos" | "no_leidos") => void;
  unreadCount?: number;
}

export default function FilterButtons({
  filter,
  onFilterChange,
  unreadCount = 0,
}: FilterButtonsProps) {
  return (
    <div className="flex gap-2 mb-6">
      <button
        onClick={() => onFilterChange("todos")}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          filter === "todos"
            ? "bg-[#f8b31d] text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        Todas
      </button>
      <button
        onClick={() => onFilterChange("no_leidos")}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          filter === "no_leidos"
            ? "bg-[#f8b31d] text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        No leídas {unreadCount > 0 && `(${unreadCount})`}
      </button>
      <button
        onClick={() => onFilterChange("leidos")}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          filter === "leidos"
            ? "bg-[#f8b31d] text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        Leídas
      </button>
    </div>
  );
}
