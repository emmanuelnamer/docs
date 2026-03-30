export interface Prospect {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  sector: string;
  revenue: string;
  createdAt: string;
  score: number;
  scoreByAxis: {
    pub: number;
    vee: number;
    closing: number;
    predictability: number;
  };
  eligible: boolean;
  eligibilityAnswers: Record<string, string>;
  scoringAnswers: Record<string, number>;
  stage: ProspectStage;
  consultantId?: string;
  auditId?: string;
  reportId?: string;
  rdv1?: RDV;
  rdv2?: RDV;
  rdv3?: RDV;
}

export type ProspectStage =
  | 'pre-audit'
  | 'rdv1-pending'
  | 'rdv1-done'
  | 'rdv2-pending'
  | 'rdv2-done'
  | 'rdv3-pending'
  | 'rdv3-done'
  | 'converted'
  | 'lost';

export interface RDV {
  id: string;
  date: string;
  time: string;
  type: 'rdv1' | 'rdv2' | 'rdv3';
  status: 'scheduled' | 'done' | 'cancelled' | 'no-show';
  notes?: string;
}

export interface Audit {
  id: string;
  prospectId: string;
  consultantId: string;
  createdAt: string;
  updatedAt: string;
  status: 'in-progress' | 'completed';
  // Section A - Portrait
  sectionA: {
    dateCreation: string;
    nbEmployees: string;
    mainActivity: string;
    geoZone: string;
    currentRevenue: string;
  };
  // Section B - Offre & Positionnement
  sectionB: {
    offerDescription: string;
    avatarWho: string;
    avatarPain: string;
    avatarDesire: string;
    averageBasket: string;
    offerInOnePhrase: string;
    offerProofs: string;
    methodPillar1: string;
    methodPillar2: string;
    methodPillar3: string;
  };
  // Section C - Acquisition
  sectionC: {
    currentChannels: string;
    currentAdBudget: string;
    hasVideoContent: string;
    currentLeadsPerMonth: string;
    currentConversionRate: string;
    mainAcquisitionBrake: string;
    mupRealBlock: string;
    musUniqueMethod: string;
    offerIrresistibleScore: string;
  };
  // Section D - Objectifs
  sectionD: {
    objectiveCA12m: string;
    objectiveLeadsMonth: string;
    objectiveClosingRate: string;
    readyToInvestPub: string;
    readyToRecord: string;
    biggestFear: string;
    deepMotivation: string;
  };
  // Notes
  notes: {
    keyOpportunity: string;
    freeNotes: string;
  };
}

export interface Report {
  id: string;
  prospectId: string;
  auditId: string;
  consultantId: string;
  createdAt: string;
  sharedWithProspect: boolean;
  sharedAt?: string;
  content: ReportContent;
}

export interface ReportContent {
  executiveSummary: string;
  strengths: string[];
  improvements: string[];
  pvcSystem: {
    pubBlock: string;
    veeBlock: string;
    closingBlock: string;
  };
  projectionTable: {
    budgetPub: number;
    leadsEstimated: number;
    rdvEstimated: number;
    clientsEstimated: number;
    caAdditional: number;
    ca12m: number;
  };
  diagnosticPub: string;
  diagnosticVee: string;
  diagnosticClosing: string;
  avatarAnalysis: string;
  offerAnalysis: string;
  mupIdentified: string;
  musToConstruct: string;
  veeScript: string;
  adHooks: string[];
  roadmap90days: string[];
  consultantNotes: string;
}

export interface Consultant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  active: boolean;
  prospectCount: number;
}

export interface User {
  id: string;
  email: string;
  role: 'prospect' | 'consultant' | 'manager';
  firstName: string;
  lastName: string;
}

export interface EligibilityQuestion {
  id: string;
  question: string;
  subtitle?: string;
  options: { label: string; value: string; eligible: boolean }[];
}

export interface ScoringQuestion {
  id: string;
  axis: 'pub' | 'vee' | 'closing' | 'predictability';
  question: string;
  options: { label: string; value: number }[];
}
