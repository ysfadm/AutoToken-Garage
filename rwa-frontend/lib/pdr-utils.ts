import { formatDistance, format } from "date-fns";
import { jsPDF } from "jspdf";
import { PDRRecord, CompetencyArea, UserProfile } from "./types";

// Date formatting utilities
export const formatActivityDate = (date: string) =>
  format(new Date(date), "PPP");
export const formatRelativeDate = (date: string) =>
  formatDistance(new Date(date), new Date(), { addSuffix: true });

// PDF Generation
export const generateActivityReport = (
  activities: PDRRecord[],
  profile: UserProfile
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(20);
  doc.text("Professional Development Record", pageWidth / 2, 20, {
    align: "center",
  });

  doc.setFontSize(12);
  doc.text(`${profile.name} - ${profile.role}`, pageWidth / 2, 30, {
    align: "center",
  });
  doc.text(`Department: ${profile.department}`, pageWidth / 2, 40, {
    align: "center",
  });

  // Activities Table
  doc.setFontSize(14);
  doc.text("Activities Summary", 20, 60);

  const headers = ["Date", "Activity", "Type", "Status"];
  const data = activities.map((act) => [
    format(new Date(act.date_completed), "yyyy-MM-dd"),
    act.title,
    act.activity_type,
    act.status,
  ]);

  // Add table
  doc.autoTable({
    startY: 70,
    head: [headers],
    body: data,
    theme: "grid",
    styles: { fontSize: 10 },
    headStyles: { fillColor: [41, 128, 185] },
  });

  return doc;
};

export const generateCompetencyReport = (
  competencies: CompetencyArea[],
  profile: UserProfile
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(20);
  doc.text("Competency Development Report", pageWidth / 2, 20, {
    align: "center",
  });

  doc.setFontSize(12);
  doc.text(`${profile.name} - ${profile.role}`, pageWidth / 2, 30, {
    align: "center",
  });

  // Competencies Summary
  let yPos = 50;
  competencies.forEach((comp) => {
    doc.setFontSize(14);
    doc.text(comp.name, 20, yPos);

    doc.setFontSize(10);
    doc.text(`Level: ${comp.level}`, 20, yPos + 10);
    doc.text(`Status: ${comp.status}`, 20, yPos + 20);

    if (comp.evidence.length > 0) {
      doc.text("Evidence:", 20, yPos + 30);
      comp.evidence.forEach((ev, idx) => {
        doc.text(
          `${idx + 1}. ${ev.title} (${ev.status})`,
          30,
          yPos + 40 + idx * 10
        );
      });
      yPos += 40 + comp.evidence.length * 10;
    }

    yPos += 50;

    // Add new page if needed
    if (yPos > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      yPos = 20;
    }
  });

  return doc;
};

// Statistics and Analysis
export const calculateCompetencyStats = (competencies: CompetencyArea[]) => {
  const total = competencies.length;
  const achieved = competencies.filter((c) => c.status === "verified").length;
  const inProgress = competencies.filter(
    (c) => c.status === "in_progress"
  ).length;

  return {
    total,
    achieved,
    inProgress,
    achievementRate: total ? (achieved / total) * 100 : 0,
  };
};

export const calculateActivityStats = (activities: PDRRecord[]) => {
  const total = activities.length;
  const verified = activities.filter((a) => a.status === "verified").length;
  const pending = activities.filter((a) => a.status === "pending").length;
  const byType = activities.reduce((acc, act) => {
    acc[act.activity_type] = (acc[act.activity_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    total,
    verified,
    pending,
    byType,
    verificationRate: total ? (verified / total) * 100 : 0,
  };
};

// Validation
export const validateCompetencyLevel = (
  competency: CompetencyArea,
  requiredEvidence: number
) => {
  const verifiedEvidence = competency.evidence.filter(
    (e) => e.status === "verified"
  ).length;
  return verifiedEvidence >= requiredEvidence;
};

// UI Helpers
export const getStatusColor = (status: string) => {
  const colors = {
    verified: "bg-green-500",
    pending: "bg-yellow-500",
    rejected: "bg-red-500",
    in_progress: "bg-blue-500",
    achieved: "bg-purple-500",
  };
  return colors[status as keyof typeof colors] || "bg-gray-500";
};

export const getLevelColor = (level: string) => {
  const colors = {
    beginner: "bg-blue-500",
    intermediate: "bg-yellow-500",
    advanced: "bg-green-500",
    expert: "bg-purple-500",
  };
  return colors[level as keyof typeof colors] || "bg-gray-500";
};
