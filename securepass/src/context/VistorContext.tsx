import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Visitor, DashboardStats, AuditLog } from '../types';

interface VisitorContextType {
  visitors: Visitor[];
  auditLogs: AuditLog[];
  addVisitor: (visitor: Omit<Visitor, 'id' | 'timeIn' | 'timeOut' | 'status'>) => Visitor;
  checkoutVisitor: (id: string) => void;
  updateVisitor: (id: string, data: Partial<Visitor>) => void;
  deleteVisitor: (id: string) => void;
  getActiveVisitors: () => Visitor[];
  getTodayVisitors: () => Visitor[];
  getStats: () => DashboardStats;
  getVisitorById: (id: string) => Visitor | undefined;
}

const VisitorContext = createContext<VisitorContextType | undefined>(undefined);

const STORAGE_KEY = 'securepass_visitors';
const AUDIT_KEY = 'securepass_audit';

const loadVisitors = (): Visitor[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
};

const loadAudit = (): AuditLog[] => {
  const saved = localStorage.getItem(AUDIT_KEY);
  return saved ? JSON.parse(saved) : [];
};

export const VisitorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [visitors, setVisitors] = useState<Visitor[]>(loadVisitors);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(loadAudit);

  const saveVisitors = (v: Visitor[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(v));
  };

  const addAuditLog = (action: string, performedBy: string, details: string) => {
    const log: AuditLog = {
      id: uuidv4(),
      action,
      performedBy,
      timestamp: new Date().toISOString(),
      details,
    };
    const updated = [log, ...auditLogs];
    setAuditLogs(updated);
    localStorage.setItem(AUDIT_KEY, JSON.stringify(updated));
  };

  const addVisitor = useCallback(
    (data: Omit<Visitor, 'id' | 'timeIn' | 'timeOut' | 'status'>): Visitor => {
      const visitor: Visitor = {
        ...data,
        id: uuidv4(),
        timeIn: new Date().toISOString(),
        timeOut: null,
        status: 'checked-in',
      };
      const updated = [visitor, ...visitors];
      setVisitors(updated);
      saveVisitors(updated);
      addAuditLog('CHECK_IN', data.registeredBy, `${data.fullName} checked in`);
      return visitor;
    },
    [visitors]
  );

  const checkoutVisitor = useCallback(
    (id: string) => {
      const updated = visitors.map((v) =>
        v.id === id ? { ...v, timeOut: new Date().toISOString(), status: 'checked-out' as const } : v
      );
      setVisitors(updated);
      saveVisitors(updated);
      const visitor = visitors.find((v) => v.id === id);
      if (visitor) {
        addAuditLog('CHECK_OUT', 'System', `${visitor.fullName} checked out`);
      }
    },
    [visitors]
  );

  const updateVisitor = useCallback(
    (id: string, data: Partial<Visitor>) => {
      const updated = visitors.map((v) => (v.id === id ? { ...v, ...data } : v));
      setVisitors(updated);
      saveVisitors(updated);
      addAuditLog('UPDATE', 'Admin', `Record ${id} updated`);
    },
    [visitors]
  );

  const deleteVisitor = useCallback(
    (id: string) => {
      const visitor = visitors.find((v) => v.id === id);
      const updated = visitors.filter((v) => v.id !== id);
      setVisitors(updated);
      saveVisitors(updated);
      addAuditLog('DELETE', 'Admin', `Record for ${visitor?.fullName || id} deleted`);
    },
    [visitors]
  );

  const getActiveVisitors = useCallback(
    () => visitors.filter((v) => v.status === 'checked-in'),
    [visitors]
  );

  const getTodayVisitors = useCallback(() => {
    const today = new Date().toDateString();
    return visitors.filter((v) => new Date(v.timeIn).toDateString() === today);
  }, [visitors]);

  const getStats = useCallback((): DashboardStats => {
    const today = getTodayVisitors();
    const active = getActiveVisitors();
    return {
      totalToday: today.length,
      currentlyIn: active.length,
      checkedOut: today.filter((v) => v.status === 'checked-out').length,
      contractors: active.filter((v) => v.category === 'contractor').length,
      visitors: active.filter((v) => v.category === 'visitor').length,
      deliveries: active.filter((v) => v.category === 'delivery').length,
      staff: active.filter((v) => v.category === 'staff').length,
      technicians: active.filter((v) => v.category === 'technician').length,
    };
  }, [visitors]);

  const getVisitorById = useCallback(
    (id: string) => visitors.find((v) => v.id === id),
    [visitors]
  );

  return (
    <VisitorContext.Provider
      value={{
        visitors,
        auditLogs,
        addVisitor,
        checkoutVisitor,
        updateVisitor,
        deleteVisitor,
        getActiveVisitors,
        getTodayVisitors,
        getStats,
        getVisitorById,
      }}
    >
      {children}
    </VisitorContext.Provider>
  );
};

export const useVisitors = (): VisitorContextType => {
  const ctx = useContext(VisitorContext);
  if (!ctx) throw new Error('useVisitors must be used within VisitorProvider');
  return ctx;
};