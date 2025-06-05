"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useWalletStore } from "@/stores/wallet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  UserCircle,
  Settings,
  LogOut,
  FileText,
  ChevronDown,
  BookOpen,
  Trophy,
  ScrollText,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export function Header() {
  const {
    isConnected,
    address,
    profile,
    connect,
    disconnect,
    checkConnection,
  } = useWalletStore();

  // Check connection on mount
  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  const handleConnect = async () => {
    try {
      await connect();
      toast.success("Successfully connected");
    } catch (error) {
      toast.error("Failed to connect");
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast.info("Disconnected");
  };

  const viewProfile = () => {
    // Navigate to profile page
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center">
            <GraduationCap className="h-6 w-6 mr-2" />
            <span className="font-bold">PDR Platform</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center space-x-2">
          <nav className="flex items-center space-x-4">
            <Link href="/activities" className="text-sm font-medium">
              Activities
            </Link>
            <Link href="/competencies" className="text-sm font-medium">
              Competencies
            </Link>
            <Link href="/reports" className="text-sm font-medium">
              Reports
            </Link>
          </nav>
        </div>

        {/* Profile Section */}
        <div className="flex items-center gap-3">
          {isConnected && profile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <UserCircle className="h-4 w-4" />
                  <div className="text-left">
                    <div className="text-sm font-medium">{profile.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {profile.role}
                    </div>
                  </div>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <div className="text-sm font-medium">Profile</div>
                  <div className="text-xs text-muted-foreground">
                    {profile.department}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={viewProfile}>
                  <UserCircle className="h-4 w-4 mr-2" />
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {}}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDisconnect}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={handleConnect} className="gap-2">
              <UserCircle className="h-4 w-4" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
