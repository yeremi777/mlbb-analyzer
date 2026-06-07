export const SYNERGY_PROOF_PRIORITIES = ["primary", "secondary", "condition"] as const;

export const SYNERGY_PROOF_IMPACTS = ["low", "medium", "high"] as const;

export type SynergyProofPriority = (typeof SYNERGY_PROOF_PRIORITIES)[number];
export type SynergyProofImpact = (typeof SYNERGY_PROOF_IMPACTS)[number];

export type SynergyProof = {
  id: string;
  category: string;
  priority: SynergyProofPriority;
  impact: SynergyProofImpact;
  summary: string;
  worksBestWhen: string[];
  failureCases: string[];
};
