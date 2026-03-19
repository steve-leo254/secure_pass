import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
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
  Category,
} from '../types';
import { CATEGORY_CHART_COLORS, CATEGORIES } from '../types';
import { useBilling } from './BillingContext';
import { apiService, type Tool, type Category as ApiCategory } from '../services/api';

interface VisitorContextType {
  visitors: Visitor[];
  auditLogs: AuditLog[];
  tools: string[];
  categories: Category[];
  addVisitor: (
    visitor: Omit<Visitor, 'id' | 'timeIn' | 'timeOut' | 'status'>
  ) => Promise<Visitor>;
  checkoutVisitor: (id: string) => Promise<void>;
  updateVisitor: (id: string, data: Partial<Visitor>) => Promise<void>;
  deleteVisitor: (id: string, performedBy?: string) => Promise<void>;
  editVisitor: (id: string, data: Partial<Visitor>, performedBy: string) => Promise<void>;
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
  addTool: (tool: string) => Promise<void>;
  removeTool: (tool: string) => Promise<void>;
  addCategory: (category: Category) => Promise<void>;
  updateCategory: (id: string, data: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

const VisitorContext = createContext<VisitorContextType | undefined>(undefined);

const STORAGE_KEY = 'securepass_visitors';
const AUDIT_KEY = 'securepass_audit';
const TOOLS_KEY = 'securepass_tools';
const CATEGORIES_KEY = 'securepass_categories';

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

const loadCategories = (): Category[] => {
  const saved = localStorage.getItem(CATEGORIES_KEY);
  if (saved) return JSON.parse(saved);
  
  // Default categories
  return [
    {
      id: '1',
      name: 'Visitor / Customer',
      value: 'visitor',
      color: '#3b82f6',
      icon: '👤',
      isActive: true,
    },
    {
      id: '2',
      name: 'Contractor',
      value: 'contractor',
      color: '#f97316',
      icon: '🔧',
      isActive: true,
    },
    {
      id: '3',
      name: 'Technician',
      value: 'technician',
      color: '#8b5cf6',
      icon: '⚙️',
      isActive: true,
    },
    {
      id: '4',
      name: 'Delivery Personnel',
      value: 'delivery',
      color: '#22c55e',
      icon: '📦',
      isActive: true,
    },
    {
      id: '5',
      name: 'Staff',
      value: 'staff',
      color: '#6366f1',
      icon: '🏢',
      isActive: true,
    },
  ];
};

export const VisitorProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [tools, setTools] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { updateSystemUsage } = useBilling();

  // Load data from API on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load visitors from API
        const apiVisitors = await apiService.getVisitors();
        const visitorsData: Visitor[] = apiVisitors.map(v => ({
          id: v.id,
          fullName: v.full_name,
          phoneNumber: v.phone_number,
          idNumber: v.id_number,
          category: v.category as VisitorCategory,
          purpose: v.purpose,
          gender: v.gender as 'male' | 'female' | 'other',
          unitVisited: v.unit_visited,
          tools: v.tools,
          customTools: v.custom_tools,
          timeIn: v.time_in,
          timeOut: v.time_out,
          status: v.status as 'checked-in' | 'checked-out',
          registeredBy: v.registered_by,
          checkedOutBy: v.checked_out_by,
        }));
        setVisitors(visitorsData);

        // Load audit logs from API
        const apiAuditLogs = await apiService.getAuditLogs();
        const auditLogsData: AuditLog[] = apiAuditLogs.map(log => ({
          id: log.id,
          action: log.action,
          performedBy: log.performed_by,
          timestamp: log.timestamp,
          details: log.details,
          category: log.category as VisitorCategory,
        }));
        setAuditLogs(auditLogsData);

        // Load tools from API
        const apiTools = await apiService.getTools();
        setTools(apiTools.map(t => t.name));

        // Load categories from API
        const apiCategories = await apiService.getCategories();
        const categoriesData: Category[] = apiCategories.map(cat => ({
          id: cat.id,
          name: cat.name,
          value: cat.value,
          color: cat.color,
          icon: cat.icon,
          isActive: cat.is_active,
        }));
        setCategories(categoriesData);

        setLoading(false);
      } catch (error) {
        console.error('Failed to load data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Update billing usage whenever visitors change
  useEffect(() => {
    updateSystemUsage(visitors.length);
  }, [visitors.length]);

  const saveVisitors = (v: Visitor[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(v));
  };

  const saveTools = (t: string[]) => {
    localStorage.setItem(TOOLS_KEY, JSON.stringify(t));
  };

  const saveCategories = (c: Category[]) => {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(c));
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
    async (
      data: Omit<Visitor, 'id' | 'timeIn' | 'timeOut' | 'status'>
    ): Promise<Visitor> => {
      try {
        // Create visitor via API
        const response = await apiService.createVisitor({
          full_name: data.fullName,
          phone_number: data.phoneNumber,
          id_number: data.idNumber,
          category: data.category,
          purpose: data.purpose,
          gender: data.gender,
          unit_visited: data.unitVisited,
          tools: data.tools,
          custom_tools: data.customTools,
        });

        // Refresh visitors list
        const apiVisitors = await apiService.getVisitors();
        const visitorsData: Visitor[] = apiVisitors.map(v => ({
          id: v.id,
          fullName: v.full_name,
          phoneNumber: v.phone_number,
          idNumber: v.id_number,
          category: v.category as VisitorCategory,
          purpose: v.purpose,
          gender: v.gender as 'male' | 'female' | 'other',
          unitVisited: v.unit_visited,
          tools: v.tools,
          customTools: v.custom_tools,
          timeIn: v.time_in,
          timeOut: v.time_out,
          status: v.status as 'checked-in' | 'checked-out',
          registeredBy: v.registered_by,
          checkedOutBy: v.checked_out_by,
        }));
        setVisitors(visitorsData);

        // Add audit log
        addAuditLog(
          'CHECK_IN',
          data.registeredBy,
          `${data.fullName} checked in to ${data.unitVisited}`,
          data.category
        );

        // Return the new visitor
        return visitorsData.find(v => v.id === response.id)!;
      } catch (error) {
        console.error('Failed to add visitor:', error);
        throw error;
      }
    },
    [addAuditLog]
  );

  const checkoutVisitor = useCallback(
    async (id: string) => {
      try {
        // Checkout visitor via API
        await apiService.checkoutVisitor(id);

        // Refresh visitors list
        const apiVisitors = await apiService.getVisitors();
        const visitorsData: Visitor[] = apiVisitors.map(v => ({
          id: v.id,
          fullName: v.full_name,
          phoneNumber: v.phone_number,
          idNumber: v.id_number,
          category: v.category as VisitorCategory,
          purpose: v.purpose,
          gender: v.gender as 'male' | 'female' | 'other',
          unitVisited: v.unit_visited,
          tools: v.tools,
          customTools: v.custom_tools,
          timeIn: v.time_in,
          timeOut: v.time_out,
          status: v.status as 'checked-in' | 'checked-out',
          registeredBy: v.registered_by,
          checkedOutBy: v.checked_out_by,
        }));
        setVisitors(visitorsData);

        // Add audit log
        const visitor = visitorsData.find(v => v.id === id);
        if (visitor) {
          addAuditLog(
            'CHECK_OUT',
            'Security',
            `${visitor.fullName} checked out from ${visitor.unitVisited}`,
            visitor.category
          );
        }
      } catch (error) {
        console.error('Failed to checkout visitor:', error);
        throw error;
      }
    },
    [addAuditLog]
  );

  const updateVisitor = useCallback(
    async (id: string, data: Partial<Visitor>) => {
      try {
        await apiService.updateVisitor(id, {
          full_name: data.fullName,
          phone_number: data.phoneNumber,
          id_number: data.idNumber,
          category: data.category,
          purpose: data.purpose,
          gender: data.gender,
          unit_visited: data.unitVisited,
          tools: data.tools,
          custom_tools: data.customTools,
        });

        // Refresh visitors list
        const apiVisitors = await apiService.getVisitors();
        const visitorsData: Visitor[] = apiVisitors.map(v => ({
          id: v.id,
          fullName: v.full_name,
          phoneNumber: v.phone_number,
          idNumber: v.id_number,
          category: v.category as VisitorCategory,
          purpose: v.purpose,
          gender: v.gender as 'male' | 'female' | 'other',
          unitVisited: v.unit_visited,
          tools: v.tools,
          customTools: v.custom_tools,
          timeIn: v.time_in,
          timeOut: v.time_out,
          status: v.status as 'checked-in' | 'checked-out',
          registeredBy: v.registered_by,
          checkedOutBy: v.checked_out_by,
        }));
        setVisitors(visitorsData);
      } catch (error) {
        console.error('Failed to update visitor:', error);
        throw error;
      }
    },
    []
  );

  const deleteVisitor = useCallback(
    async (id: string, performedBy?: string) => {
      try {
        await apiService.deleteVisitor(id);

        // Refresh visitors list
        const apiVisitors = await apiService.getVisitors();
        const visitorsData: Visitor[] = apiVisitors.map(v => ({
          id: v.id,
          fullName: v.full_name,
          phoneNumber: v.phone_number,
          idNumber: v.id_number,
          category: v.category as VisitorCategory,
          purpose: v.purpose,
          gender: v.gender as 'male' | 'female' | 'other',
          unitVisited: v.unit_visited,
          tools: v.tools,
          customTools: v.custom_tools,
          timeIn: v.time_in,
          timeOut: v.time_out,
          status: v.status as 'checked-in' | 'checked-out',
          registeredBy: v.registered_by,
          checkedOutBy: v.checked_out_by,
        }));
        setVisitors(visitorsData);
      } catch (error) {
        console.error('Failed to delete visitor:', error);
        throw error;
      }
    },
    []
  );

  const editVisitor = useCallback(
    async (id: string, data: Partial<Visitor>, performedBy: string = 'Admin') => {
      try {
        await apiService.updateVisitor(id, {
          full_name: data.fullName,
          phone_number: data.phoneNumber,
          id_number: data.idNumber,
          category: data.category,
          purpose: data.purpose,
          gender: data.gender,
          unit_visited: data.unitVisited,
          tools: data.tools,
          custom_tools: data.customTools,
        });

        // Refresh visitors list
        const apiVisitors = await apiService.getVisitors();
        const visitorsData: Visitor[] = apiVisitors.map(v => ({
          id: v.id,
          fullName: v.full_name,
          phoneNumber: v.phone_number,
          idNumber: v.id_number,
          category: v.category as VisitorCategory,
          purpose: v.purpose,
          gender: v.gender as 'male' | 'female' | 'other',
          unitVisited: v.unit_visited,
          tools: v.tools,
          customTools: v.custom_tools,
          timeIn: v.time_in,
          timeOut: v.time_out,
          status: v.status as 'checked-in' | 'checked-out',
          registeredBy: v.registered_by,
          checkedOutBy: v.checked_out_by,
        }));
        setVisitors(visitorsData);
      } catch (error) {
        console.error('Failed to edit visitor:', error);
        throw error;
      }
    },
    []
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
    async (tool: string) => {
      try {
        await apiService.addTool({ name: tool });
        
        // Refresh tools list
        const apiTools = await apiService.getTools();
        setTools(apiTools.map(t => t.name));
      } catch (error) {
        console.error('Failed to add tool:', error);
        throw error;
      }
    },
    []
  );

  const removeTool = useCallback(
    async (tool: string) => {
      try {
        await apiService.removeTool(tool);
        
        // Refresh tools list
        const apiTools = await apiService.getTools();
        setTools(apiTools.map(t => t.name));
      } catch (error) {
        console.error('Failed to remove tool:', error);
        throw error;
      }
    },
    []
  );

  const addCategory = useCallback(
    async (category: Category) => {
      try {
        await apiService.addCategory({
          name: category.name,
          value: category.value,
          color: category.color,
          icon: category.icon,
          is_active: category.isActive,
        });
        
        // Refresh categories list
        const apiCategories = await apiService.getCategories();
        const categoriesData: Category[] = apiCategories.map(cat => ({
          id: cat.id,
          name: cat.name,
          value: cat.value,
          color: cat.color,
          icon: cat.icon,
          isActive: cat.is_active,
        }));
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to add category:', error);
        throw error;
      }
    },
    []
  );

  const updateCategory = useCallback(
    async (id: string, data: Partial<Category>) => {
      try {
        await apiService.updateCategory(id, {
          name: data.name || '',
          value: data.value || '',
          color: data.color || '',
          icon: data.icon || '',
          is_active: data.isActive ?? true,
        });
        
        // Refresh categories list
        const apiCategories = await apiService.getCategories();
        const categoriesData: Category[] = apiCategories.map(cat => ({
          id: cat.id,
          name: cat.name,
          value: cat.value,
          color: cat.color,
          icon: cat.icon,
          isActive: cat.is_active,
        }));
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to update category:', error);
        throw error;
      }
    },
    []
  );

  const deleteCategory = useCallback(
    async (id: string) => {
      try {
        await apiService.deleteCategory(id);
        
        // Refresh categories list
        const apiCategories = await apiService.getCategories();
        const categoriesData: Category[] = apiCategories.map(cat => ({
          id: cat.id,
          name: cat.name,
          value: cat.value,
          color: cat.color,
          icon: cat.icon,
          isActive: cat.is_active,
        }));
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to delete category:', error);
        throw error;
      }
    },
    []
  );

  const value = useMemo(
    () => ({
      visitors,
      auditLogs,
      tools,
      categories: categories.filter(c => c.isActive),
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
      addCategory,
      updateCategory,
      deleteCategory,
    }),
    [
      visitors,
      auditLogs,
      tools,
      categories,
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
