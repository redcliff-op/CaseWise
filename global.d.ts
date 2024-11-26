import { User } from "@react-native-google-signin/google-signin";

interface Tab {
  name: string;
  icon: any;
  screenIndex: number;
}

interface RiskEntry {
  risk: string | null;
  impact: string | null;
  likelihood: string | null;
  concerning: boolean;
}

interface KeyTerms {
  description: string | null;
  terms: {
    term: string | null;
    importance: string | null;
  }[] | null;
}

interface Obligation {
  obligation: string | null;
  description: string | null;
  due_date: string | null;
}

interface ShadyClause {
  clause: string | null;
  description: string | null;
  reason: string | null;
  potential_impact: string | null;
}

interface ActionItem {
  action: string | null;
  deadline: string | null;
}

interface DisputeResolution {
  method: string | null;
  jurisdiction: string | null;
}

interface DocumentAnalysis {
  document_name: string | null;
  document_type: string | null;
  parties_involved: (string | null)[] | null;
  effective_date: string | null;
  termination_date: string | null;
  key_terms: KeyTerms | null;
  obligations: Obligation[] | null;
  risks: {
    general: RiskEntry[] | null;
    legal: RiskEntry[] | null;
    financial: RiskEntry[] | null;
    reputational: RiskEntry[] | null;
  } | null;
  shady_clauses: ShadyClause[] | null;
  action_items: ActionItem[] | null;
  dispute_resolution: DisputeResolution | null;
  termination_conditions: (string | null)[] | null;
  review_recommendations: string | null;
  user_protection_tips: string | null;
  overall_analysis: string | null;
}

interface Preferences {
  summaryLang: string;
}

interface UserData {
  preferences: Preferences;
}

interface ChatItem {
  ai: boolean;
  message: string;
  time: string;
}

interface CasePrediction {
  predictedOutcome: string | null;
  predictionConfidence: string | null;
  keyFactors: string[] | null; 
  improvementStrategies: string[] | null;
  riskLevel: string | null;
  potentialRewards: string | null; 
  uncertaintyFactors: string[] | null;
  successRate: number | null; 
}

interface CaseFiling {
  caseTitle: string;
  clientDetails: {
    name: string;
    contact: string;
    email: string;
    address?: string;
  };
  caseType: "Civil" | "Criminal" | "Corporate" | "Family" | "Other";
  filingDate: string; 
  jurisdiction: string;
  documentsRequired: string[];
  status: "Draft" | "Submitted" | "Rejected";
}

interface EvidenceCollection {
  evidenceType: "Physical" | "Digital" | "Witness Statement" | "Other";
  title: string,
  description: string;
  uploadDate: string;
}

interface LegalResearch {
  researchId: string;
  topic: string;
  notes: string;
  relatedLaws: string[];
  precedentCases: {
    caseTitle: string;
    caseSummary: string;
    rulingDate: string;
    court: string;
  }[];
  completionStatus: "In Progress" | "Completed";
}

interface HearingManagement {
  hearingId: string;
  hearingDate: string;
  courtName: string;
  judgeName: string;
  agenda: string;
  outcome?: string;
  documentsRequired: string[];
  rescheduleDetails?: {
    rescheduledDate: string;
    reason: string;
  };
}

interface CaseResolution {
  resolutionId: string;
  resolutionDate: string;
  outcome: "Won" | "Lost" | "Settled" | "Withdrawn";
  summary: string;
  judgmentCopyUrl?: string; 
  followUpActions: string[];
}

interface CaseData {
  navigateStatus: number,
  caseFiling: CaseFiling;
  evidenceCollection: EvidenceCollection[] | null;
  legalResearch: LegalResearch[] | null;
  hearingManagement: HearingManagement[] | null;
  caseResolution?: CaseResolution | null;
}