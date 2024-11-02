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
