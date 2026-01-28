import { Outlet } from "react-router-dom";

export default function CursosHomeLayout({ onLogout }: { onLogout?: () => void }) {
  return (
    <div>
      <div className="w-full p-6">
        <Outlet />
      </div>
    </div>
  );
}
