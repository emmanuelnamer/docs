import { Prospect, Audit, Report, Consultant, User } from '../types';

const STORAGE_KEY = 'leads_fr_data';

interface StoreData {
  prospects: Prospect[];
  audits: Audit[];
  reports: Report[];
  consultants: Consultant[];
  users: User[];
  currentUser: User | null;
}

const defaultConsultants: Consultant[] = [
  { id: 'c1', firstName: 'Thomas', lastName: 'Dupont', email: 'thomas@leads.fr', active: true, prospectCount: 0 },
  { id: 'c2', firstName: 'Marie', lastName: 'Laurent', email: 'marie@leads.fr', active: true, prospectCount: 0 },
];

const defaultUsers: User[] = [
  { id: 'c1', email: 'thomas@leads.fr', role: 'consultant', firstName: 'Thomas', lastName: 'Dupont' },
  { id: 'c2', email: 'marie@leads.fr', role: 'consultant', firstName: 'Marie', lastName: 'Laurent' },
  { id: 'm1', email: 'manager@leads.fr', role: 'manager', firstName: 'Admin', lastName: 'Manager' },
];

function loadData(): StoreData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    prospects: [],
    audits: [],
    reports: [],
    consultants: defaultConsultants,
    users: defaultUsers,
    currentUser: null,
  };
}

function saveData(data: StoreData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

let data = loadData();

export const store = {
  // Auth
  login(email: string, password: string): User | null {
    // For MVP, any password works for predefined users
    // For prospects, match by email
    const user = data.users.find(u => u.email === email);
    if (user) {
      data.currentUser = user;
      saveData(data);
      return user;
    }
    return null;
  },
  logout() {
    data.currentUser = null;
    saveData(data);
  },
  getCurrentUser(): User | null {
    return data.currentUser;
  },

  // Prospects
  getProspects(): Prospect[] {
    return data.prospects;
  },
  getProspectsByConsultant(consultantId: string): Prospect[] {
    return data.prospects.filter(p => p.consultantId === consultantId);
  },
  getProspect(id: string): Prospect | undefined {
    return data.prospects.find(p => p.id === id);
  },
  getProspectByEmail(email: string): Prospect | undefined {
    return data.prospects.find(p => p.email === email);
  },
  createProspect(prospect: Prospect): Prospect {
    data.prospects.push(prospect);
    // Create user account for prospect
    data.users.push({
      id: prospect.id,
      email: prospect.email,
      role: 'prospect',
      firstName: prospect.firstName,
      lastName: prospect.lastName,
    });
    // Auto-assign consultant (round-robin)
    const activeConsultants = data.consultants.filter(c => c.active);
    if (activeConsultants.length > 0) {
      const sorted = [...activeConsultants].sort((a, b) => a.prospectCount - b.prospectCount);
      prospect.consultantId = sorted[0].id;
      sorted[0].prospectCount++;
    }
    saveData(data);
    return prospect;
  },
  updateProspect(id: string, updates: Partial<Prospect>): Prospect | undefined {
    const idx = data.prospects.findIndex(p => p.id === id);
    if (idx >= 0) {
      data.prospects[idx] = { ...data.prospects[idx], ...updates };
      saveData(data);
      return data.prospects[idx];
    }
    return undefined;
  },

  // Audits
  getAudit(id: string): Audit | undefined {
    return data.audits.find(a => a.id === id);
  },
  getAuditByProspect(prospectId: string): Audit | undefined {
    return data.audits.find(a => a.prospectId === prospectId);
  },
  createAudit(audit: Audit): Audit {
    data.audits.push(audit);
    saveData(data);
    return audit;
  },
  updateAudit(id: string, updates: Partial<Audit>): Audit | undefined {
    const idx = data.audits.findIndex(a => a.id === id);
    if (idx >= 0) {
      data.audits[idx] = { ...data.audits[idx], ...updates };
      saveData(data);
      return data.audits[idx];
    }
    return undefined;
  },

  // Reports
  getReport(id: string): Report | undefined {
    return data.reports.find(r => r.id === id);
  },
  getReportByProspect(prospectId: string): Report | undefined {
    return data.reports.find(r => r.prospectId === prospectId);
  },
  createReport(report: Report): Report {
    data.reports.push(report);
    saveData(data);
    return report;
  },
  updateReport(id: string, updates: Partial<Report>): Report | undefined {
    const idx = data.reports.findIndex(r => r.id === id);
    if (idx >= 0) {
      data.reports[idx] = { ...data.reports[idx], ...updates };
      saveData(data);
      return data.reports[idx];
    }
    return undefined;
  },

  // Consultants
  getConsultants(): Consultant[] {
    return data.consultants;
  },
  getConsultant(id: string): Consultant | undefined {
    return data.consultants.find(c => c.id === id);
  },

  // Stats for manager
  getStats() {
    const total = data.prospects.length;
    const eligible = data.prospects.filter(p => p.eligible).length;
    const converted = data.prospects.filter(p => p.stage === 'converted').length;
    const avgScore = total > 0 ? Math.round(data.prospects.reduce((s, p) => s + p.score, 0) / total) : 0;
    const byStage: Record<string, number> = {};
    data.prospects.forEach(p => {
      byStage[p.stage] = (byStage[p.stage] || 0) + 1;
    });
    return { total, eligible, converted, avgScore, byStage };
  },

  // Reset
  reset() {
    data = {
      prospects: [],
      audits: [],
      reports: [],
      consultants: defaultConsultants,
      users: defaultUsers,
      currentUser: null,
    };
    saveData(data);
  }
};
