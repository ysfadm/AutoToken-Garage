"use client";

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
  Trophy,
  ChevronRight,
  CheckCircle,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const LEVEL_COLORS = {
  beginner: "bg-blue-500",
  intermediate: "bg-yellow-500",
  advanced: "bg-green-500",
  expert: "bg-purple-500",
};

const LEVEL_PROGRESS = {
  beginner: 25,
  intermediate: 50,
  advanced: 75,
  expert: 100,
};

export default function CompetenciesPage() {
  const { profile } = useWalletStore();
  const { competencies } = useContractStore();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Professional Competencies</h1>
            <p className="text-muted-foreground">
              Track and demonstrate your professional expertise
            </p>
          </div>
          <Button>
            <Trophy className="h-4 w-4 mr-2" />
            Add Competency
          </Button>
        </div>

        <div className="grid gap-6">
          {competencies.map((competency, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{competency.name}</CardTitle>
                    <CardDescription>{competency.description}</CardDescription>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {competency.level}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Progress
                    value={LEVEL_PROGRESS[competency.level]}
                    className={LEVEL_COLORS[competency.level]}
                  />

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <div className="flex items-center mt-1">
                        {competency.status === "verified" ? (
                          <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                        ) : (
                          <Clock className="h-4 w-4 mr-1 text-yellow-500" />
                        )}
                        <span className="capitalize">{competency.status}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Evidence</p>
                      <p className="mt-1">{competency.evidence.length} items</p>
                    </div>
                    <div>
                      <Button variant="ghost" size="sm" className="mt-1">
                        View Details
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>

                  {/* Recent Evidence */}
                  {competency.evidence.length > 0 && (
                    <div className="border rounded-lg p-4 mt-4">
                      <h4 className="text-sm font-medium mb-3">Recent Evidence</h4>
                      <div className="space-y-3">
                        {competency.evidence.slice(0, 2).map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between text-sm"
                          >
                            <div>
                              <p className="font-medium">{item.title}</p>
                              <p className="text-muted-foreground">
                                {item.date_completed}
                              </p>
                            </div>
                            <Button variant="ghost" size="sm">
                              <ArrowUpRight className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
