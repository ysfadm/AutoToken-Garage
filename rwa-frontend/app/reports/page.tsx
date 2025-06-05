"use client";

import { useState } from "react";
import { useWalletStore } from "@/stores/wallet";
import { useContractStore } from "@/stores/contract";
import { Header } from "@/components/layout/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Download,
  Filter,
  Calendar,
  Trophy,
  CheckCircle,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { formatDate, calculateCompetencyProgress } from "@/lib/pdr";

const REPORT_TYPES = [
  {
    id: "activities",
    name: "Activities Summary",
    description: "Overview of all professional development activities",
  },
  {
    id: "competencies",
    name: "Competency Report",
    description: "Detailed analysis of competency development",
  },
  {
    id: "certification",
    name: "Certification Status",
    description: "Status of professional certifications and qualifications",
  },
];

export default function ReportsPage() {
  const { profile } = useWalletStore();
  const { activities, competencies } = useContractStore();
  const [selectedReport, setSelectedReport] = useState("activities");
  const [timeframe, setTimeframe] = useState("all");

  const filteredActivities = activities.filter((activity) => {
    if (timeframe === "all") return true;
    const activityDate = new Date(activity.date_completed);
    const now = new Date();
    switch (timeframe) {
      case "month":
        return activityDate >= new Date(now.setMonth(now.getMonth() - 1));
      case "quarter":
        return activityDate >= new Date(now.setMonth(now.getMonth() - 3));
      case "year":
        return activityDate >= new Date(now.setFullYear(now.getFullYear() - 1));
      default:
        return true;
    }
  });

  const renderReportContent = () => {
    switch (selectedReport) {
      case "activities":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>{formatDate(activity.date_completed)}</TableCell>
                  <TableCell>{activity.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{activity.activity_type}</Badge>
                  </TableCell>
                  <TableCell>{activity.provider}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        activity.status === "verified" ? "default" : "secondary"
                      }
                    >
                      {activity.status === "verified" ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <Clock className="h-3 w-3 mr-1" />
                      )}
                      {activity.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );

      case "competencies":
        return (
          <div className="grid gap-6">
            {competencies.map((competency) => (
              <Card key={competency.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>{competency.name}</CardTitle>
                      <CardDescription>{competency.description}</CardDescription>
                    </div>
                    <Badge variant="outline">{competency.level}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{calculateCompetencyProgress(competency)}%</span>
                    </div>
                    <div className="text-sm">
                      <p className="text-muted-foreground mb-2">Evidence:</p>
                      <ul className="space-y-1">
                        {competency.evidence.map((item, i) => (
                          <li key={i} className="flex justify-between">
                            <span>{item.title}</span>
                            <Badge variant="outline">{item.status}</Badge>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Professional Reports</h1>
            <p className="text-muted-foreground">
              Generate detailed reports of your professional development
            </p>
          </div>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Settings</CardTitle>
              <CardDescription>
                Configure the type and scope of your report
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Report Type
                  </label>
                  <Select
                    value={selectedReport}
                    onValueChange={setSelectedReport}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      {REPORT_TYPES.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Time Frame
                  </label>
                  <Select value={timeframe} onValueChange={setTimeframe}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time frame" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="month">Past Month</SelectItem>
                      <SelectItem value="quarter">Past Quarter</SelectItem>
                      <SelectItem value="year">Past Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Report Data</CardTitle>
            </CardHeader>
            <CardContent>{renderReportContent()}</CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
