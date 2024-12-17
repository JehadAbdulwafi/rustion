import React, { createContext, useContext, useState } from 'react';

type NotificationsContextType = {
  hasNotifications: boolean;
  setHasNotifications: (value: boolean) => void;
};

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [hasNotifications, setHasNotifications] = useState(false);

  return (
    <NotificationsContext.Provider value={{ hasNotifications, setHasNotifications }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
}
