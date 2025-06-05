import { v4 as uuidv4 } from "uuid";
import { PDRRecord, CompetencyArea, UserProfile } from "./types";

export const generateId = () => uuidv4();

export const createActivity = (data: Partial<PDRRecord>): PDRRecord => ({
  id: generateId(),
  activity_type: "training",
  title: "",
  description: "",
  date_completed: new Date().toISOString().split("T")[0],
  provider: "",
  documentation: [],
  status: "pending",
  competencies: [],
  ...data,
});

export const createCompetency = (
  data: Partial<CompetencyArea>
): CompetencyArea => ({
  id: generateId(),
  name: "",
  description: "",
  level: "beginner",
  status: "in_progress",
  evidence: [],
  ...data,
});

export const createProfile = (data: Partial<UserProfile>): UserProfile => ({
  id: generateId(),
  name: "",
  role: "",
  department: "",
  joined_date: new Date().toISOString().split("T")[0],
  supervisor: "",
  current_goals: [],
  competencies: [],
  certifications: [],
  ...data,
});

export const validateActivity = (activity: PDRRecord): boolean => {
  return !!(
    activity.title &&
    activity.description &&
    activity.date_completed &&
    activity.provider
  );
};

export const calculateCompetencyProgress = (
  competency: CompetencyArea
): number => {
  if (!competency.evidence.length) return 0;
  const verifiedEvidence = competency.evidence.filter(
    (e) => e.status === "verified"
  ).length;
  return Math.round((verifiedEvidence / competency.evidence.length) * 100);
};

export const getLevelRequirements = (
  level: CompetencyArea["level"]
): {
  min_evidence: number;
  min_verified: number;
} => {
  const requirements = {
    beginner: { min_evidence: 1, min_verified: 1 },
    intermediate: { min_evidence: 3, min_verified: 2 },
    advanced: { min_evidence: 5, min_verified: 4 },
    expert: { min_evidence: 8, min_verified: 6 },
  };
  return requirements[level];
};

export const canLevelUp = (competency: CompetencyArea): boolean => {
  const progress = calculateCompetencyProgress(competency);
  const verifiedCount = competency.evidence.filter(
    (e) => e.status === "verified"
  ).length;
  const nextLevel = {
    beginner: "intermediate",
    intermediate: "advanced",
    advanced: "expert",
    expert: "expert",
  }[competency.level];

  const requirements = getLevelRequirements(
    nextLevel as CompetencyArea["level"]
  );
  return (
    verifiedCount >= requirements.min_verified &&
    competency.evidence.length >= requirements.min_evidence &&
    progress >= 75
  );
};

export const formatDate = (date: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString(undefined, options);
};
