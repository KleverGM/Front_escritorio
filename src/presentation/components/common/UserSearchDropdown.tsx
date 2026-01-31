import React, { useState, useEffect } from "react";
import { authHttp } from "../../../infrastructure/http/httpClients";

export interface Usuario {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar?: string;
}

interface UserSearchDropdownProps {
  onSelectUser: (user: Usuario) => void;
  selectedUser: Usuario | null;
  onClearUser: () => void;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
}

export default function UserSearchDropdown({
  onSelectUser,
  selectedUser,
  onClearUser,
  disabled = false,
  placeholder = "Buscar por nombre, apellido o username...",
  label,
}: UserSearchDropdownProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Usuario[]>([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!searchTerm.trim() || disabled) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(() => {
      searchUsers(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, disabled]);

  const searchUsers = async (term: string) => {
    setSearching(true);
    try {
      const res = await authHttp.get(
        `/users/?search=${encodeURIComponent(term)}`,
      );
      const users = res.data?.results ?? res.data ?? [];
      setSearchResults(Array.isArray(users) ? users : []);
      setShowDropdown(true);
    } catch (e) {
      console.error("Error buscando usuarios:", e);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const selectUser = (user: Usuario) => {
    onSelectUser(user);
    setSearchTerm(`${user.first_name} ${user.last_name} (@${user.username})`);
    setShowDropdown(false);
  };

  const getUserInitials = (user: Usuario) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return user.username.substring(0, 2).toUpperCase();
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label || "Buscar usuario *"}
      </label>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f8b31d] focus:border-transparent disabled:bg-gray-100"
      />
      {searching && (
        <div className="absolute right-3 top-10 text-gray-400">
          <div className="animate-spin h-5 w-5 border-2 border-[#f8b31d] border-t-transparent rounded-full"></div>
        </div>
      )}

      {/* Dropdown de resultados */}
      {showDropdown && searchResults.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {searchResults.map((user) => (
            <div
              key={user.id}
              onClick={() => selectUser(user)}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
            >
              <div className="w-10 h-10 rounded-full bg-[#f8b31d] flex items-center justify-center text-white font-semibold">
                {getUserInitials(user)}
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {user.first_name} {user.last_name}
                </div>
                <div className="text-sm text-gray-500">@{user.username}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Usuario seleccionado */}
      {selectedUser && (
        <div className="mt-2 flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="w-10 h-10 rounded-full bg-[#f8b31d] flex items-center justify-center text-white font-semibold">
            {getUserInitials(selectedUser)}
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-900">
              {selectedUser.first_name} {selectedUser.last_name}
            </div>
            <div className="text-sm text-gray-500">
              @{selectedUser.username}
            </div>
          </div>
          <button
            type="button"
            onClick={onClearUser}
            className="text-red-600 hover:text-red-800"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
