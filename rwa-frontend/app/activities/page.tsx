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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Plus,
  Calendar,
  FileText,
  GraduationCap,
  Briefcase,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { PDRRecord } from "@/lib/types";
import { format } from "date-fns";

const ACTIVITY_TYPES = [
  {
    id: "training",
    name: "Training",
    icon: BookOpen,
    description: "Courses, workshops, and training sessions",
  },
  {
    id: "certification",
    name: "Certification",
    icon: GraduationCap,
    description: "Professional certifications and qualifications",
  },
  {
    id: "project",
    name: "Project",
    icon: Briefcase,
    description: "Significant work projects and initiatives",
  },
  {
    id: "education",
    name: "Education",
    icon: FileText,
    description: "Formal education and academic achievements",
  },
];

export default function ActivitiesPage() {
  const { profile } = useWalletStore();
  const { activities, addActivity } = useContractStore();
  const [showNewActivity, setShowNewActivity] = useState(false);
  const [newActivity, setNewActivity] = useState<Partial<PDRRecord>>({
    activity_type: "training",
    status: "pending",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id) return;

    try {
      await addActivity({
        id: `act-${Date.now()}`,
        ...newActivity,
        activity_type: newActivity.activity_type || "training",
        status: "pending",
        competencies: [],
        documentation: [],
      } as PDRRecord);

      setShowNewActivity(false);
      setNewActivity({
        activity_type: "training",
        status: "pending",
      });
    } catch (error) {
      console.error("Failed to add activity:", error);
    }
  };

  const handleChange = (
    field: keyof PDRRecord,
    value: string
  ) => {
    setNewActivity((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Professional Activities</h1>
            <p className="text-muted-foreground">
              Track and manage your professional development activities
            </p>
          </div>
          <Dialog open={showNewActivity} onOpenChange={setShowNewActivity}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Activity
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Activity</DialogTitle>
                <DialogDescription>
                  Record a new professional development activity
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="activity_type">Activity Type</Label>
                  <Select
                    value={newActivity.activity_type}
                    onValueChange={(value) =>
                      handleChange("activity_type", value as any)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ACTIVITY_TYPES.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newActivity.title || ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="e.g., Advanced TypeScript Workshop"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newActivity.description || ""}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Describe the activity and its learning outcomes..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date_completed">Completion Date</Label>
                    <Input
                      id="date_completed"
                      type="date"
                      value={newActivity.date_completed || ""}
                      onChange={(e) =>
                        handleChange("date_completed", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="provider">Provider</Label>
                    <Input
                      id="provider"
                      value={newActivity.provider || ""}
                      onChange={(e) => handleChange("provider", e.target.value)}
                      placeholder="Organization or institution"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Add Activity
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge
                    variant={activity.status === "verified" ? "default" : "secondary"}
                  >
                    {activity.status === "verified" ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <AlertCircle className="h-3 w-3 mr-1" />
                    )}
                    {activity.status}
                  </Badge>
                  <Badge variant="outline">{activity.activity_type}</Badge>
                </div>
                <CardTitle className="text-lg mt-2">{activity.title}</CardTitle>
                <CardDescription>{activity.provider}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">{activity.description}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    {format(new Date(activity.date_completed), "MMM d, yyyy")}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
