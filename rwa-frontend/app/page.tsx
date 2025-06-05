"use client";

import { useEffect } from "react";
import { useWalletStore } from "@/stores/wallet";
import { useContractStore } from "@/stores/contract";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Trophy,
  TrendingUp,
  User,
  ArrowRight,
  CheckCircle,
  Clock,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const { isConnected, profile, checkConnection } = useWalletStore();
  const {
    activities,
    competencies,
    isLoading,
    fetchActivities,
    fetchCompetencies,
  } = useContractStore();

  // Check connection and fetch data on mount
  useEffect(() => {
    checkConnection();
    if (isConnected && profile?.id) {
      fetchActivities(profile.id);
      fetchCompetencies(profile.id);
    }
  }, [
    checkConnection,
    isConnected,
    profile?.id,
    fetchActivities,
    fetchCompetencies,
  ]);

  const dashboardMetrics = [
    {
      title: "Total Activities",
      value: activities?.length || 0,
      description: "Recorded professional development activities",
      icon: BookOpen,
    },
    {
      title: "Competencies",
      value: competencies?.length || 0,
      description: "Areas of professional expertise",
      icon: Trophy,
    },
    {
      title: "Recent Progress",
      value: "4",
      description: "Activities in last 30 days",
      icon: TrendingUp,
    },
    {
      title: "Verification Status",
      value: activities?.filter((a) => a.status === "verified").length || 0,
      description: "Verified activities",
      icon: CheckCircle,
      status: "success",
    },
  ];

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] space-y-8">
            <div className="text-center space-y-4 max-w-2xl">
              <h1 className="text-4xl font-bold tracking-tight">
                Professional Development Record Platform
              </h1>
              <p className="text-xl text-muted-foreground">
                Track your professional growth, showcase your achievements, and
                manage your career development journey in one place.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
              <Card className="text-center">
                <CardHeader>
                  <BookOpen className="h-12 w-12 mx-auto text-primary" />
                  <CardTitle className="text-lg">Track Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Record and monitor your professional development activities
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Trophy className="h-12 w-12 mx-auto text-amber-500" />
                  <CardTitle className="text-lg">Build Competencies</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Develop and demonstrate your professional competencies
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <GraduationCap className="h-12 w-12 mx-auto text-blue-600" />
                  <CardTitle className="text-lg">Showcase Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Generate reports and portfolios of your professional journey
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-4 space-y-6">
        {/* Metrics Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {dashboardMetrics.map((metric, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <metric.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">
                  {metric.description}
                </p>
                {metric.status && (
                  <Badge
                    variant={
                      metric.status === "success" ? "default" : "secondary"
                    }
                    className="mt-2"
                  >
                    {metric.status === "success" ? "Up to date" : "Pending"}
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activities and Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>
                Your latest professional development records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.slice(0, 3).map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.date_completed}
                      </p>
                    </div>
                    <Badge>{activity.status}</Badge>
                  </div>
                ))}
                <Link href="/activities" className="block">
                  <Button variant="outline" className="w-full justify-between">
                    View All Activities
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Competency Progress</CardTitle>
              <CardDescription>
                Track your professional competency development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {competencies.map((competency, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div>
                      <p className="font-medium">{competency.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Level: {competency.level}
                      </p>
                    </div>
                    <Badge variant="outline">{competency.status}</Badge>
                  </div>
                ))}
                <Link href="/competencies" className="block">
                  <Button variant="outline" className="w-full justify-between">
                    View All Competencies
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
