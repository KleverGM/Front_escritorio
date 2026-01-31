import React from "react";

type NotificationItem = {
  message?: string;
  titulo?: string;
};

type NotificationsPanelProps = {
  notifications: NotificationItem[];
};

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  notifications,
}) => {
  if (!Array.isArray(notifications) || notifications.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm rounded-xl p-5">
      <h2 className="font-semibold text-slate-900 dark:text-white mb-3">
        Notificaciones recientes
      </h2>
      <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
        {notifications.map((n, idx) => (
          <li
            key={idx}
            className="border-b border-gray-100 dark:border-slate-800 pb-2"
          >
            {n.message ?? n.titulo ?? "Notificación"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsPanel;
