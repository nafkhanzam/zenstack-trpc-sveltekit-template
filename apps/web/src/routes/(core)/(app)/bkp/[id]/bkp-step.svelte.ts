export const STEP_LABELS = {
  PROPOSAL: "Proposal",
  P_APPROVAL: "P. Approval",
  REGISTRATION: "Registration",
  R_APPROVAL: "R. Approval",
  WEEKLY_REPORTS: "Weekly Reports",
  FIELD_ASSESSMENT: "Field Assessment",
  GRADING: "Grading",
  COMPLETED: "Completed",
} as const;

export type StepLabel = (typeof STEP_LABELS)[keyof typeof STEP_LABELS];

let activeStepLabel = $state<StepLabel | "">("");

export function setActiveStep(label: StepLabel) {
  activeStepLabel = label;
}

export function getActiveStep() {
  return activeStepLabel;
}
