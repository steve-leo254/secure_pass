import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type {
  Visitor,
  AuditLog,
  VisitorCategory,
  Member,
  Gender,
} from "../types";

const DEFAULT_TOOLS = [
  "Hammer",
  "Screwdriver",
  "Drill Machine",
  "Spanner Set",
  "Welding Machine",
  "Ladder",
  "Pliers",
  "Measuring Tape",
  "Level Tool",
  "Wire Cutter",
  "Pipe Wrench",
  "Saw",
];

const CATEGORIES: VisitorCategory[] = [
  "contractor",
  "technician",
  "delivery",
  "staff",
  "visitor",
];

const SEED_VISITORS: Visitor[] = [
  {
    id: "s1",
    fullName: "James Mwangi",
    phoneNumber: "+254712345678",
    idNumber: "23456789",
    category: "contractor",
    purpose: "Plumbing repair in unit 4B",
    gender: "male",
    unitVisited: "Unit 4B",
    tools: ["Spanner Set", "Pliers"],
    customTools: [],
    timeIn: new Date(Date.now() - 2 * 3600000).toISOString(),
    timeOut: null,
    status: "checked-in",
    registeredBy: "Security Officer",
    checkedOutBy: null,
  },
  {
    id: "s2",
    fullName: "Sarah Wanjiru",
    phoneNumber: "+254723456789",
    idNumber: "34567890",
    category: "visitor",
    purpose: "Visiting resident in apartment 12A",
    gender: "female",
    unitVisited: "Apartment 12A",
    tools: [],
    customTools: [],
    timeIn: new Date(Date.now() - 3600000).toISOString(),
    timeOut: null,
    status: "checked-in",
    registeredBy: "Security Officer",
    checkedOutBy: null,
  },
  {
    id: "s3",
    fullName: "Peter Ochieng",
    phoneNumber: "+254734567890",
    idNumber: "45678901",
    category: "technician",
    purpose: "HVAC maintenance on rooftop",
    gender: "male",
    unitVisited: "Building B - Rooftop",
    tools: ["Drill Machine", "Screwdriver", "Measuring Tape"],
    customTools: [],
    timeIn: new Date(Date.now() - 4 * 3600000).toISOString(),
    timeOut: new Date(Date.now() - 1800000).toISOString(),
    status: "checked-out",
    registeredBy: "Security Officer",
    checkedOutBy: null,
  },
  {
    id: "s4",
    fullName: "Mary Kamau",
    phoneNumber: "+254745678901",
    idNumber: "56789012",
    category: "delivery",
    purpose: "Package delivery for resident",
    gender: "female",
    unitVisited: "Reception Desk",
    tools: [],
    customTools: [],
    timeIn: new Date(Date.now() - 5400000).toISOString(),
    timeOut: new Date(Date.now() - 4800000).toISOString(),
    status: "checked-out",
    registeredBy: "Security Officer",
    checkedOutBy: null,
  },
  {
    id: "s5",
    fullName: "David Njoroge",
    phoneNumber: "+254756789012",
    idNumber: "67890123",
    category: "staff",
    purpose: "Daily shift - Office Floor 3",
    gender: "male",
    unitVisited: "Office Floor 3",
    tools: [],
    customTools: [],
    timeIn: new Date(Date.now() - 6 * 3600000).toISOString(),
    timeOut: null,
    status: "checked-in",
    registeredBy: "Security Officer",
    checkedOutBy: null,
  },
  {
    id: "s6",
    fullName: "Grace Akinyi",
    phoneNumber: "+254767890123",
    idNumber: "78901234",
    category: "contractor",
    purpose: "Electrical wiring in office 5C",
    gender: "female",
    unitVisited: "Office 5C",
    tools: ["Wire Cutter", "Screwdriver", "Measuring Tape"],
    customTools: [],
    timeIn: new Date(Date.now() - 3 * 3600000).toISOString(),
    timeOut: null,
    status: "checked-in",
    registeredBy: "Security Officer",
    checkedOutBy: null,
  },
];

interface DataContextType {
  visitors: Visitor[];
  addVisitor: (
    v: Omit<Visitor, "id" | "timeIn" | "timeOut" | "status">
  ) => void;
  checkoutVisitor: (id: string, user: string) => void;
  editVisitor: (id: string, updates: Partial<Visitor>, user: string) => void;
  deleteVisitor: (id: string, user: string) => void;
  tools: string[];
  addTool: (tool: string) => void;
  removeTool: (tool: string) => void;
  categories: VisitorCategory[];
  auditLogs: AuditLog[];
  activeVisitors: Visitor[];
  members: Member[];
  addMember: (
    data: Omit<Member, "id" | "mId" | "dateRegistered" | "lastAccess">
  ) => Member;
  deleteMember: (id: string) => void;
  updateMember: (id: string, updates: Partial<Member>) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [visitors, setVisitors] = useState<Visitor[]>(() => {
    const stored = localStorage.getItem("sp_visitors");
    return stored ? JSON.parse(stored) : SEED_VISITORS;
  });

  const [tools, setTools] = useState<string[]>(() => {
    const stored = localStorage.getItem("sp_tools");
    return stored ? JSON.parse(stored) : DEFAULT_TOOLS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const stored = localStorage.getItem("sp_audit");
    return stored ? JSON.parse(stored) : [];
  });

  const [members, setMembers] = useState<Member[]>(() => {
    const stored = localStorage.getItem("sp_members");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("sp_visitors", JSON.stringify(visitors));
  }, [visitors]);
  useEffect(() => {
    localStorage.setItem("sp_tools", JSON.stringify(tools));
  }, [tools]);
  useEffect(() => {
    localStorage.setItem("sp_audit", JSON.stringify(auditLogs));
  }, [auditLogs]);
  useEffect(() => {
    localStorage.setItem("sp_members", JSON.stringify(members));
  }, [members]);

  const log = (action: string, by: string, details: string) => {
    setAuditLogs((prev) => [
      {
        id: crypto.randomUUID(),
        action,
        performedBy: by,
        timestamp: new Date().toISOString(),
        details,
      },
      ...prev,
    ]);
  };

  const addVisitor = (
    data: Omit<Visitor, "id" | "timeIn" | "timeOut" | "status">
  ) => {
    const visitor: Visitor = {
      ...data,
      id: crypto.randomUUID(),
      timeIn: new Date().toISOString(),
      timeOut: null,
      status: "checked-in",
    };
    setVisitors((prev) => [visitor, ...prev]);
    log("REGISTER", data.registeredBy, `Registered ${data.fullName} (${data.category})`);
  };

  const checkoutVisitor = (id: string, user: string) => {
    setVisitors((prev) =>
      prev.map((v) =>
        v.id === id
          ? { ...v, status: "checked-out" as const, timeOut: new Date().toISOString() }
          : v
      )
    );
    const v = visitors.find((v) => v.id === id);
    if (v) log("CHECKOUT", user, `Checked out ${v.fullName}`);
  };

  const editVisitor = (id: string, updates: Partial<Visitor>, user: string) => {
    setVisitors((prev) => prev.map((v) => (v.id === id ? { ...v, ...updates } : v)));
    log("EDIT", user, `Edited visitor record (${id.slice(0, 8)})`);
  };

  const deleteVisitor = (id: string, user: string) => {
    const v = visitors.find((x) => x.id === id);
    setVisitors((prev) => prev.filter((x) => x.id !== id));
    if (v) log("DELETE", user, `Deleted record for ${v.fullName}`);
  };

  const addTool = (t: string) => {
    if (!tools.includes(t)) setTools((prev) => [...prev, t]);
  };

  const removeTool = (t: string) => {
    setTools((prev) => prev.filter((x) => x !== t));
  };

  const generateMemberId = (): string => {
    const count = members.length + 1;
    const year = new Date().getFullYear();
    return `MEM-${String(count).padStart(3, "0")}-${year}`;
  };

  const addMember = (
    data: Omit<Member, "id" | "mId" | "dateRegistered" | "lastAccess">
  ): Member => {
    const member: Member = {
      ...data,
      id: crypto.randomUUID(),
      mId: generateMemberId(),
      dateRegistered: new Date().toISOString(),
      status: "active",
    };
    setMembers((prev) => [member, ...prev]);
    log("REGISTER_MEMBER", "System", `Member registered: ${data.fullName} (${member.mId})`);
    return member;
  };

  const deleteMember = (id: string) => {
    const member = members.find((m) => m.id === id);
    setMembers((prev) => prev.filter((m) => m.id !== id));
    if (member) log("DELETE_MEMBER", "Admin", `Deleted member: ${member.fullName}`);
  };

  const updateMember = (id: string, updates: Partial<Member>) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
    log("UPDATE_MEMBER", "Admin", `Updated member record (${id.slice(0, 8)})`);
  };

  return (
    <DataContext.Provider
      value={{
        visitors,
        addVisitor,
        checkoutVisitor,
        editVisitor,
        deleteVisitor,
        tools,
        addTool,
        removeTool,
        categories: CATEGORIES,
        auditLogs,
        activeVisitors: visitors.filter((v) => v.status === "checked-in"),
        members,
        addMember,
        deleteMember,
        updateMember,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be within DataProvider");
  return ctx;
};
