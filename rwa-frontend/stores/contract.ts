import { create } from "zustand";
import { AssetMetadata, ComplianceData, ContractInfo, PDRRecord, CompetencyArea } from "@/lib/types";
import { createContractClient, getContractInfo, getUserContractData } from "@/lib/contract";
import { RWA_CONTRACT_ID } from "@/lib/stellar";

interface ContractStore {
  // Contract information
  contractId: string;
  assetMetadata: AssetMetadata | null;
  totalSupply: string;
  isPaused: boolean;
  admin: string | null;

  // User-specific data
  userBalance: string;
  isWhitelisted: boolean;
  compliance: ComplianceData | null;

  // UI state
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;

  // Actions
  fetchContractData: () => Promise<void>;
  fetchUserData: (address: string) => Promise<void>;
  refreshBalance: (address: string) => Promise<void>;
  transfer: (from: string, to: string, amount: string) => Promise<boolean>;
  clearError: () => void;
  setContractId: (contractId: string) => void;

  // PDR activities and competencies
  activities: PDRRecord[];
  competencies: CompetencyArea[];
  // Data fetching
  fetchActivities: (userId: string) => Promise<void>;
  fetchCompetencies: (userId: string) => Promise<void>;
  // Activity management
  addActivity: (activity: PDRRecord) => Promise<void>;
  updateActivity: (id: string, activity: Partial<PDRRecord>) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
  // Competency management
  updateCompetency: (id: string, competency: Partial<CompetencyArea>) => Promise<void>;
  addEvidence: (competencyId: string, activity: PDRRecord) => Promise<void>;
}

// Mock data for development
const MOCK_ACTIVITIES: PDRRecord[] = [
  {
    id: "act-1",
    activity_type: "training",
    title: "Advanced TypeScript Workshop",
    description: "3-day intensive workshop on TypeScript and advanced patterns",
    date_completed: "2025-05-15",
    provider: "TypeScript Academy",
    documentation: ["certificate.pdf"],
    status: "verified",
    competencies: ["typescript", "software_architecture"],
    reflection: "Learned key concepts about generics and decorators"
  },
  {
    id: "act-2",
    activity_type: "certification",
    title: "AWS Solutions Architect Associate",
    description: "Cloud architecture certification from Amazon Web Services",
    date_completed: "2025-04-20",
    provider: "Amazon Web Services",
    documentation: ["aws-cert.pdf"],
    status: "verified",
    competencies: ["cloud", "architecture"]
  }
];

const MOCK_COMPETENCIES: CompetencyArea[] = [
  {
    id: "comp-1",
    name: "TypeScript Development",
    description: "Advanced TypeScript programming and best practices",
    level: "intermediate",
    status: "in_progress",
    evidence: []
  },
  {
    id: "comp-2",
    name: "Cloud Architecture",
    description: "Designing and implementing cloud solutions",
    level: "beginner",
    status: "in_progress",
    evidence: []
  }
];

export const useContractStore = create<ContractStore>((set, get) => ({
  // Initial state
  contractId: RWA_CONTRACT_ID,
  assetMetadata: null,
  totalSupply: '0',
  isPaused: false,
  admin: null,
  userBalance: '0',
  isWhitelisted: false,
  compliance: null,
  isLoading: false,
  error: null,
  lastUpdated: null,
  activities: [],
  competencies: [],

  // Clear error state
  clearError: () => set({ error: null }),

  // Set contract ID
  setContractId: (contractId: string) => {
    set({ contractId });
  },

  // Fetch general contract information
  fetchContractData: async () => {
    const { contractId } = get();
    set({ isLoading: true, error: null });

    try {
      console.log(`Fetching contract data for ${contractId}...`);
      
      const contractInfo = await getContractInfo(contractId);
      
      set({
        assetMetadata: contractInfo.metadata,
        totalSupply: contractInfo.totalSupply,
        isPaused: contractInfo.isPaused,
        admin: contractInfo.admin,
        isLoading: false,
        lastUpdated: Date.now()
      });

      console.log('Contract data fetched successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch contract data';
      console.error('Error fetching contract data:', errorMessage);
      
      set({
        isLoading: false,
        error: errorMessage
      });
    }
  },

  // Fetch user-specific contract data
  fetchUserData: async (address: string) => {
    const { contractId } = get();
    set({ isLoading: true, error: null });

    try {
      console.log(`Fetching user data for ${address}...`);
      
      const userData = await getUserContractData(address, contractId);
      
      set({
        userBalance: userData.balance,
        isWhitelisted: userData.isWhitelisted,
        compliance: userData.compliance,
        isLoading: false,
        lastUpdated: Date.now()
      });

      console.log('User data fetched successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user data';
      console.error('Error fetching user data:', errorMessage);
      
      set({
        isLoading: false,
        error: errorMessage
      });
    }
  },

  // Refresh only user balance
  refreshBalance: async (address: string) => {
    const { contractId } = get();

    try {
      console.log(`Refreshing balance for ${address}...`);
      
      const client = createContractClient(contractId);
      const balance = await client.balance(address);
      
      set({
        userBalance: balance,
        lastUpdated: Date.now()
      });

      console.log('Balance refreshed successfully');
    } catch (error) {
      console.error('Error refreshing balance:', error);
      // Don't set error state for balance refresh failures
    }
  },

  // Transfer tokens
  transfer: async (from: string, to: string, amount: string): Promise<boolean> => {
    const { contractId } = get();
    set({ isLoading: true, error: null });

    try {
      console.log(`Initiating transfer: ${amount} tokens from ${from} to ${to}`);
      
      const client = createContractClient(contractId);
      const success = await client.transfer(from, to, amount);
      
      if (success) {
        // Refresh user balance after successful transfer
        await get().refreshBalance(from);
        console.log('Transfer completed successfully');
      }
      
      set({ isLoading: false });
      return success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Transfer failed';
      console.error('Transfer error:', errorMessage);
      
      set({
        isLoading: false,
        error: errorMessage
      });
      
      return false;
    }
  },

  fetchActivities: async (userId: string) => {
    set({ isLoading: true });
    try {
      // In a real app, fetch from API
      set({ activities: MOCK_ACTIVITIES });
    } catch (error) {
      set({ error: "Failed to fetch activities" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCompetencies: async (userId: string) => {
    set({ isLoading: true });
    try {
      // In a real app, fetch from API
      set({ competencies: MOCK_COMPETENCIES });
    } catch (error) {
      set({ error: "Failed to fetch competencies" });
    } finally {
      set({ isLoading: false });
    }
  },

  addActivity: async (activity: PDRRecord) => {
    set({ isLoading: true });
    try {
      // In a real app, send to API
      const activities = get().activities;
      set({ activities: [...activities, activity] });
    } catch (error) {
      set({ error: "Failed to add activity" });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateActivity: async (id: string, updates: Partial<PDRRecord>) => {
    set({ isLoading: true });
    try {
      const activities = get().activities.map(act => 
        act.id === id ? { ...act, ...updates } : act
      );
      set({ activities });
    } catch (error) {
      set({ error: "Failed to update activity" });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteActivity: async (id: string) => {
    set({ isLoading: true });
    try {
      const activities = get().activities.filter(act => act.id !== id);
      set({ activities });
    } catch (error) {
      set({ error: "Failed to delete activity" });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateCompetency: async (id: string, updates: Partial<CompetencyArea>) => {
    set({ isLoading: true });
    try {
      const competencies = get().competencies.map(comp => 
        comp.id === id ? { ...comp, ...updates } : comp
      );
      set({ competencies });
    } catch (error) {
      set({ error: "Failed to update competency" });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  addEvidence: async (competencyId: string, activity: PDRRecord) => {
    set({ isLoading: true });
    try {
      const competencies = get().competencies.map(comp => 
        comp.id === competencyId 
          ? { ...comp, evidence: [...comp.evidence, activity] }
          : comp
      );
      set({ competencies });
    } catch (error) {
      set({ error: "Failed to add evidence" });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));