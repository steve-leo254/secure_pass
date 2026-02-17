import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import type {
  Visitor,
  VisitorCategory,
  DashboardStats,
  AuditLog,
  HourlyData,
  DailyData,
  CategoryData,
} from '../types';
import { CATEGORY_CHART_COLORS, CATEGORIES } from '../types';

interface VisitorContextType {
  visitors: Visitor[];
  auditLogs: AuditLog[];
  tools: string[];
  categories: string[];
  addVisitor: (
    visitor: Omit<Visitor, 'id' | 'timeIn' | 'timeOut' | 'status'>
  ) => Visitor;
  checkoutVisitor: (id: string) => void;
  updateVisitor: (id: string, data: Partial<Visitor>) => void;
  editVisitor: (id: string, data: Partial<Visitor>, performedBy: string) => void;
  deleteVisitor: (id: string, performedBy?: string) => void;
  getActiveVisitors: () => Visitor[];
  getTodayVisitors: () => Visitor[];
  getStats: () => DashboardStats;
  getVisitorById: (id: string) => Visitor | undefined;
  getHourlyData: () => HourlyData[];
  getDailyData: (days?: number) => DailyData[];
  getCategoryData: () => CategoryData[];
  getTopUnits: () => { unit: string; count: number }[];
  getPeakHours: () => { hour: number; count: number }[];
  getGenderData: () => { name: string; value: number; color: string }[];
  getWeeklyComparison: () => { thisWeek: number; lastWeek: number; change: number };
  getAverageVisitDuration: () => string;
  getRecentActivity: (limit?: number) => AuditLog[];
  addTool: (tool: string) => void;
  removeTool: (tool: string) => void;
}

const VisitorContext = createContext<VisitorContextType | undefined>(undefined);

const STORAGE_KEY = 'securepass_visitors';
const AUDIT_KEY = 'securepass_audit';
const TOOLS_KEY = 'securepass_tools';

const loadVisitors = (): Visitor[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
};

const loadAudit = (): AuditLog[] => {
  const saved = localStorage.getItem(AUDIT_KEY);
  return saved ? JSON.parse(saved) : [];
};

const loadTools = (): string[] => {
  const saved = localStorage.getItem(TOOLS_KEY);
  return saved ? JSON.parse(saved) : [];
};

export const VisitorProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [visitors, setVisitors] = useState<Visitor[]>(loadVisitors);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(loadAudit);
  const [tools, setTools] = useState<string[]>(loadTools);

  const saveVisitors = (v: Visitor[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(v));
  };

  const saveTools = (t: string[]) => {
    localStorage.setItem(TOOLS_KEY, JSON.stringify(t));
  };

  const addAuditLog = useCallback(
    (
      action: string,
      performedBy: string,
      details: string,
      category?: VisitorCategory
    ) => {
      const log: AuditLog = {
        id: uuidv4(),
        action,
        performedBy,
        timestamp: new Date().toISOString(),
        details,
        category,
      };
      setAuditLogs((prev) => {
        const updated = [log, ...prev];
        localStorage.setItem(AUDIT_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  const addVisitor = useCallback(
    (
      data: Omit<Visitor, 'id' | 'timeIn' | 'timeOut' | 'status'>
    ): Visitor => {
      const visitor: Visitor = {
        ...data,
        id: uuidv4(),
        timeIn: new Date().toISOString(),
        timeOut: null,
        status: 'checked-in',
      };
      setVisitors((prev) => {
        const updated = [visitor, ...prev];
        saveVisitors(updated);
        return updated;
      });
      addAuditLog(
        'CHECK_IN',
        data.registeredBy,
        `${data.fullName} checked in to ${data.unitVisited}`,
        data.category
      );
      return visitor;
    },
    [addAuditLog]
  );

  const checkoutVisitor = useCallback(
    (id: string) => {
      setVisitors((prev) => {
        const updated = prev.map((v) =>
          v.id === id
            ? {
                ...v,
                timeOut: new Date().toISOString(),
                status: 'checked-out' as const,
              }
            : v
        );
        saveVisitors(updated);
        const visitor = prev.find((v) => v.id === id);
        if (visitor) {
          addAuditLog(
            'CHECK_OUT',
            'Security',
            `${visitor.fullName} checked out from ${visitor.unitVisited}`,
            visitor.category
          );
        }
        return updated;
      });
    },
    [addAuditLog]
  );

  const updateVisitor = useCallback(
    (id: string, data: Partial<Visitor>) => {
      setVisitors((prev) => {
        const updated = prev.map((v) =>
          v.id === id ? { ...v, ...data } : v
        );
        saveVisitors(updated);
        return updated;
      });
      addAuditLog('UPDATE', 'Admin', `Record ${id} updated`);
    },
    [addAuditLog]
  );

  const deleteVisitor = useCallback(
    (id: string, performedBy: string = 'Admin') => {
      setVisitors((prev) => {
        const visitor = prev.find((v) => v.id === id);
        const updated = prev.filter((v) => v.id !== id);
        saveVisitors(updated);
        addAuditLog(
          'DELETE',
          performedBy,
          `Record for ${visitor?.fullName || id} deleted`
        );
        return updated;
      });
    },
    [addAuditLog]
  );

  const editVisitor = useCallback(
    (id: string, data: Partial<Visitor>, performedBy: string = 'Admin') => {
      setVisitors((prev) => {
        const updated = prev.map((v) =>
          v.id === id ? { ...v, ...data } : v
        );
        saveVisitors(updated);
        addAuditLog('UPDATE', performedBy, `Record ${id} updated`);
        return updated;
      });
    },
    [addAuditLog]
  );

  const getActiveVisitors = useCallback(
    () => visitors.filter((v) => v.status === 'checked-in'),
    [visitors]
  );

  const getTodayVisitors = useCallback(() => {
    const today = new Date().toDateString();
    return visitors.filter(
      (v) => new Date(v.timeIn).toDateString() === today
    );
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
  }, [getTodayVisitors, getActiveVisitors]);

  const getVisitorById = useCallback(
    (id: string) => visitors.find((v) => v.id === id),
    [visitors]
  );

  const getHourlyData = useCallback((): HourlyData[] => {
    const today = getTodayVisitors();
    const hours: HourlyData[] = [];
    for (let i = 0; i < 24; i++) {
      const h = i.toString().padStart(2, '0');
      const label = `${h}:00`;
      const checkIns = today.filter(
        (v) => new Date(v.timeIn).getHours() === i
      ).length;
      const checkOuts = today.filter(
        (v) => v.timeOut && new Date(v.timeOut).getHours() === i
      ).length;
      hours.push({ hour: label, checkIns, checkOuts });
    }
    return hours;
  }, [getTodayVisitors]);

  const getDailyData = useCallback(
    (days: number = 7): DailyData[] => {
      const data: DailyData[] = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toDateString();
        const dayVisitors = visitors.filter(
          (v) => new Date(v.timeIn).toDateString() === dateStr
        );
        data.push({
          date: date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          }),
          total: dayVisitors.length,
          checkIns: dayVisitors.length,
          checkOuts: dayVisitors.filter((v) => v.status === 'checked-out')
            .length,
        });
      }
      return data;
    },
    [visitors]
  );

  const getCategoryData = useCallback((): CategoryData[] => {
    const today = getTodayVisitors();
    return CATEGORIES.map((cat) => ({
      name: cat.label,
      value: today.filter((v) => v.category === cat.value).length,
      color: CATEGORY_CHART_COLORS[cat.value],
      icon: cat.icon,
    }));
  }, [getTodayVisitors]);

  const getTopUnits = useCallback((): { unit: string; count: number }[] => {
    const unitMap: Record<string, number> = {};
    visitors.forEach((v) => {
      unitMap[v.unitVisited] = (unitMap[v.unitVisited] || 0) + 1;
    });
    return Object.entries(unitMap)
      .map(([unit, count]) => ({ unit, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [visitors]);

  const getPeakHours =
    useCallback((): { hour: number; count: number }[] => {
      const hourMap: Record<number, number> = {};
      visitors.forEach((v) => {
        const h = new Date(v.timeIn).getHours();
        hourMap[h] = (hourMap[h] || 0) + 1;
      });
      return Object.entries(hourMap)
        .map(([hour, count]) => ({ hour: Number(hour), count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    }, [visitors]);

  const getGenderData =
    useCallback((): { name: string; value: number; color: string }[] => {
      const today = getTodayVisitors();
      return [
        {
          name: 'Male',
          value: today.filter((v) => v.gender === 'male').length,
          color: '#3b82f6',
        },
        {
          name: 'Female',
          value: today.filter((v) => v.gender === 'female').length,
          color: '#ec4899',
        },
        {
          name: 'Other',
          value: today.filter((v) => v.gender === 'other').length,
          color: '#8b5cf6',
        },
      ];
    }, [getTodayVisitors]);

  const getWeeklyComparison = useCallback(() => {
    const now = new Date();
    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(now.getDate() - now.getDay());
    thisWeekStart.setHours(0, 0, 0, 0);

    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const lastWeekEnd = new Date(thisWeekStart);

    const thisWeek = visitors.filter(
      (v) => new Date(v.timeIn) >= thisWeekStart
    ).length;
    const lastWeek = visitors.filter(
      (v) =>
        new Date(v.timeIn) >= lastWeekStart &&
        new Date(v.timeIn) < lastWeekEnd
    ).length;
    const change = lastWeek > 0 ? ((thisWeek - lastWeek) / lastWeek) * 100 : 0;

    return { thisWeek, lastWeek, change };
  }, [visitors]);

  const getAverageVisitDuration = useCallback((): string => {
    const completed = visitors.filter((v) => v.timeOut);
    if (completed.length === 0) return '0m';
    const totalMs = completed.reduce((acc, v) => {
      return (
        acc +
        (new Date(v.timeOut!).getTime() - new Date(v.timeIn).getTime())
      );
    }, 0);
    const avgMs = totalMs / completed.length;
    const mins = Math.round(avgMs / 60000);
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    const remainMins = mins % 60;
    return `${hrs}h ${remainMins}m`;
  }, [visitors]);

  const getRecentActivity = useCallback(
    (limit: number = 15): AuditLog[] => {
      return auditLogs.slice(0, limit);
    },
    [auditLogs]
  );

  const addTool = useCallback(
    (tool: string) => {
      setTools((prev) => {
        const updated = [...new Set([...prev, tool])]; // Remove duplicates
        saveTools(updated);
        return updated;
      });
    },
    []
  );

  const removeTool = useCallback(
    (tool: string) => {
      setTools((prev) => {
        const updated = prev.filter((t) => t !== tool);
        saveTools(updated);
        return updated;
      });
    },
    []
  );

  const value = useMemo(
    () => ({
      visitors,
      auditLogs,
      tools,
      categories: CATEGORIES.map(c => c.label),
      addVisitor,
      checkoutVisitor,
      updateVisitor,
      editVisitor,
      deleteVisitor,
      getActiveVisitors,
      getTodayVisitors,
      getStats,
      getVisitorById,
      getHourlyData,
      getDailyData,
      getCategoryData,
      getTopUnits,
      getPeakHours,
      getGenderData,
      getWeeklyComparison,
      getAverageVisitDuration,
      getRecentActivity,
      addTool,
      removeTool,
    }),
    [
      visitors,
      auditLogs,
      tools,
      addVisitor,
      checkoutVisitor,
      updateVisitor,
      editVisitor,
      deleteVisitor,
      getActiveVisitors,
      getTodayVisitors,
      getStats,
      getVisitorById,
      getHourlyData,
      getDailyData,
      getCategoryData,
      getTopUnits,
      getPeakHours,
      getGenderData,
      getWeeklyComparison,
      getAverageVisitDuration,
      getRecentActivity,
      addTool,
      removeTool,
    ]
  );

  return (
    <VisitorContext.Provider value={value}>
      {children}
    </VisitorContext.Provider>
  );
};

export const useVisitors = (): VisitorContextType => {
  const ctx = useContext(VisitorContext);
  if (!ctx) throw new Error('useVisitors must be used within VisitorProvider');
  return ctx;
};
