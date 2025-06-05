"use client";

import { useState } from "react";
import { Keypair } from "@stellar/stellar-sdk";
import { useWalletStore } from "@/stores/wallet";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import {
  Car,
  FileText,
  Shield,
  Clock,
  Check,
  ArrowRight,
  ArrowLeft,
  Upload,
  AlertCircle,
  DollarSign,
  Users,
  Briefcase,
  Coins,
  Calculator,
  Info,
  Gauge,
} from "lucide-react";
import { formatCurrency } from "@/lib/stellar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { tokenizeVehicle, VehicleMetadata } from "@/lib/auto-token";

const ASSET_TYPES = [
  {
    id: "classic_car",
    name: "Classic Cars",
    description: "Vintage and collectible automobiles",
    icon: Car,
    minValue: 50000,
    examples: [
      "Classic American Cars",
      "European Vintage Cars",
      "Rare Limited Editions",
      "Restored Classics",
    ],
  },
  {
    id: "ev_project",
    name: "EV Projects",
    description: "Electric vehicle and mobility innovations",
    icon: Gauge,
    minValue: 100000,
    examples: [
      "Electric Vehicle Fleets",
      "Charging Networks",
      "EV Startups",
      "Green Mobility Solutions",
    ],
  },
  {
    id: "fleet",
    name: "Fleet Investments",
    description: "Commercial and rental vehicle fleets",
    icon: Car,
    minValue: 250000,
    examples: [
      "Taxi Fleets",
      "Rental Car Services",
      "Delivery Vehicle Fleets",
      "Corporate Fleets",
    ],
  },
];

const TOKENIZATION_STEPS = [
  {
    id: 1,
    title: "Asset Details",
    description: "Provide basic information about your asset",
  },
  {
    id: 2,
    title: "Legal Documentation",
    description: "Upload required legal and ownership documents",
  },
  {
    id: 3,
    title: "Tokenization Structure",
    description: "Define token economics and distribution",
  },
  {
    id: 4,
    title: "Compliance Setup",
    description: "Configure investor requirements and restrictions",
  },
  {
    id: 5,
    title: "Review & Deploy",
    description: "Review all details and deploy your token",
  },
];

export default function Tokenize() {
  const { isConnected, address } = useWalletStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Asset Details
    assetType: "",
    assetName: "",
    location: "",
    description: "",
    totalValue: "",

    // Step 2: Legal Documentation
    ownershipProof: null as File | null,
    valuation: null as File | null,
    insurance: null as File | null,

    // Step 3: Tokenization Structure
    tokenSymbol: "",
    totalSupply: "",
    pricePerToken: "",
    minInvestment: "",

    // Step 4: Compliance
    kycRequired: true,
    accreditedOnly: false,
    jurisdictionRestrictions: "",

    // Step 5: Launch settings
    launchDate: "",
    fundingGoal: "",
    fundingDeadline: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [vehicleData, setVehicleData] = useState<
    VehicleMetadata & {
      totalSupply: string;
    }
  >({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    vin: "",
    condition: "",
    mileage: 0,
    images: [],
    totalSupply: "1000000",
  });

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < TOKENIZATION_STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateTokenomics = () => {
    if (!formData.totalValue || !formData.totalSupply) return null;

    const totalVal = parseFloat(formData.totalValue);
    const supply = parseFloat(formData.totalSupply);
    const pricePerToken = totalVal / supply;

    return {
      pricePerToken: pricePerToken.toFixed(2),
      marketCap: totalVal,
      minInvestmentTokens: formData.minInvestment
        ? Math.ceil(parseFloat(formData.minInvestment) / pricePerToken)
        : 0,
    };
  };

  const handleVehicleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In a real app, these would be managed by a proper wallet
      const issuerKeypair = Keypair.random();
      const distributorKeypair = Keypair.random();

      const result = await tokenizeVehicle({
        issuerKeypair,
        distributorKeypair,
        vehicleMetadata: {
          make: vehicleData.make,
          model: vehicleData.model,
          year: vehicleData.year,
          vin: vehicleData.vin,
          condition: vehicleData.condition,
          mileage: vehicleData.mileage,
          images: vehicleData.images,
        },
        totalSupply: vehicleData.totalSupply,
      });

      toast.success("Vehicle successfully tokenized!", {
        description: `Asset: ${result.asset.code}`,
      });
    } catch (error) {
      toast.error("Failed to tokenize vehicle", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setVehicleData((prev) => ({
      ...prev,
      [name]: name === "year" || name === "mileage" ? Number(value) : value,
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold mb-4 block">
                Asset Type
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ASSET_TYPES.map((type) => {
                  const Icon = type.icon;
                  return (
                    <Card
                      key={type.id}
                      className={`cursor-pointer transition-all ${
                        formData.assetType === type.id
                          ? "ring-2 ring-primary bg-primary/5"
                          : "hover:shadow-md"
                      }`}
                      onClick={() => updateFormData("assetType", type.id)}
                    >
                      <CardContent className="p-6 text-center">
                        <Icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                        <h3 className="font-semibold mb-2">{type.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {type.description}
                        </p>
                        <Badge variant="outline">
                          Min: {formatCurrency(type.minValue.toString())}
                        </Badge>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="assetName">Asset Name</Label>
                <Input
                  id="assetName"
                  placeholder="e.g., Luxury Apartment NYC"
                  value={formData.assetName}
                  onChange={(e) => updateFormData("assetName", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., Manhattan, New York"
                  value={formData.location}
                  onChange={(e) => updateFormData("location", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Asset Description</Label>
              <Textarea
                id="description"
                placeholder="Detailed description of your asset, its features, and investment potential..."
                value={formData.description}
                onChange={(e) => updateFormData("description", e.target.value)}
                className="min-h-24"
              />
            </div>

            <div>
              <Label htmlFor="totalValue">Total Asset Value (USD)</Label>
              <Input
                id="totalValue"
                type="number"
                placeholder="2500000"
                value={formData.totalValue}
                onChange={(e) => updateFormData("totalValue", e.target.value)}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Based on professional appraisal or market valuation
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                All documents must be notarized and verified by our legal team
                before tokenization approval.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Ownership Proof
                  </CardTitle>
                  <CardDescription>
                    Property deed, title, or ownership certificate
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload PDF or image
                    </p>
                    <Button variant="outline" size="sm">
                      Choose File
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Professional Valuation
                  </CardTitle>
                  <CardDescription>
                    Official appraisal from certified assessor
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload appraisal report
                    </p>
                    <Button variant="outline" size="sm">
                      Choose File
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Insurance Documentation
                  </CardTitle>
                  <CardDescription>
                    Current insurance policy and coverage details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload insurance policy
                    </p>
                    <Button variant="outline" size="sm">
                      Choose File
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Additional Documents
                  </CardTitle>
                  <CardDescription>
                    Any other relevant legal or financial documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Optional documents
                    </p>
                    <Button variant="outline" size="sm">
                      Choose Files
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 3:
        const tokenomics = calculateTokenomics();
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="tokenSymbol">Token Symbol</Label>
                <Input
                  id="tokenSymbol"
                  placeholder="e.g., LAPT"
                  value={formData.tokenSymbol}
                  onChange={(e) =>
                    updateFormData("tokenSymbol", e.target.value.toUpperCase())
                  }
                  maxLength={5}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  3-5 character unique identifier
                </p>
              </div>
              <div>
                <Label htmlFor="totalSupply">Total Token Supply</Label>
                <Input
                  id="totalSupply"
                  type="number"
                  placeholder="1000000"
                  value={formData.totalSupply}
                  onChange={(e) =>
                    updateFormData("totalSupply", e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="minInvestment">Minimum Investment (USD)</Label>
              <Input
                id="minInvestment"
                type="number"
                placeholder="250"
                value={formData.minInvestment}
                onChange={(e) =>
                  updateFormData("minInvestment", e.target.value)
                }
              />
            </div>

            {tokenomics && (
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle>Calculated Tokenomics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Price Per Token
                      </p>
                      <p className="text-2xl font-bold">
                        ${tokenomics.pricePerToken}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Market Cap
                      </p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(tokenomics.marketCap.toString())}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Min Investment Tokens
                      </p>
                      <p className="text-2xl font-bold">
                        {tokenomics.minInvestmentTokens.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fundingGoal">Funding Goal (USD)</Label>
                <Input
                  id="fundingGoal"
                  type="number"
                  placeholder="1000000"
                  value={formData.fundingGoal}
                  onChange={(e) =>
                    updateFormData("fundingGoal", e.target.value)
                  }
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Target amount to raise from investors
                </p>
              </div>
              <div>
                <Label htmlFor="fundingDeadline">Funding Deadline</Label>
                <Input
                  id="fundingDeadline"
                  type="date"
                  value={formData.fundingDeadline}
                  onChange={(e) =>
                    updateFormData("fundingDeadline", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Investor Requirements</CardTitle>
                <CardDescription>
                  Set compliance requirements for token holders
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>KYC Verification Required</Label>
                    <p className="text-sm text-muted-foreground">
                      All investors must complete identity verification
                    </p>
                  </div>
                  <Button
                    variant={formData.kycRequired ? "default" : "outline"}
                    onClick={() =>
                      updateFormData("kycRequired", !formData.kycRequired)
                    }
                  >
                    {formData.kycRequired ? "Required" : "Optional"}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Accredited Investors Only</Label>
                    <p className="text-sm text-muted-foreground">
                      Restrict to accredited investors (higher income/net worth)
                    </p>
                  </div>
                  <Button
                    variant={formData.accreditedOnly ? "default" : "outline"}
                    onClick={() =>
                      updateFormData("accreditedOnly", !formData.accreditedOnly)
                    }
                  >
                    {formData.accreditedOnly ? "Required" : "Open to All"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div>
              <Label htmlFor="jurisdictionRestrictions">
                Jurisdiction Restrictions
              </Label>
              <Textarea
                id="jurisdictionRestrictions"
                placeholder="e.g., US residents only, excluding OFAC sanctioned countries..."
                value={formData.jurisdictionRestrictions}
                onChange={(e) =>
                  updateFormData("jurisdictionRestrictions", e.target.value)
                }
              />
              <p className="text-sm text-muted-foreground mt-1">
                Specify any geographic restrictions for token holders
              </p>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Our legal team will review these settings to ensure regulatory
                compliance in relevant jurisdictions.
              </AlertDescription>
            </Alert>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <Alert>
              <Check className="h-4 w-4" />
              <AlertDescription>
                Review all information carefully. Once deployed, some settings
                cannot be changed.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Asset Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{formData.assetName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">
                      {
                        ASSET_TYPES.find((t) => t.id === formData.assetType)
                          ?.name
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">{formData.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Value:</span>
                    <span className="font-medium">
                      {formatCurrency(formData.totalValue)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Token Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Symbol:</span>
                    <span className="font-medium">{formData.tokenSymbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Supply:</span>
                    <span className="font-medium">
                      {parseFloat(formData.totalSupply).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Price per Token:
                    </span>
                    <span className="font-medium">
                      ${calculateTokenomics()?.pricePerToken}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Min Investment:
                    </span>
                    <span className="font-medium">
                      {formatCurrency(formData.minInvestment)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Deployment Cost</h3>
                <div className="text-3xl font-bold mb-2">$2,500 USD</div>
                <p className="text-sm opacity-90">
                  Includes smart contract deployment, legal review, compliance
                  setup, and ongoing platform fees for the first year.
                </p>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  function VehicleInformationForm() {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="make">Make</Label>
            <Input id="make" placeholder="e.g. Ford" />
          </div>
          <div>
            <Label htmlFor="model">Model</Label>
            <Input id="model" placeholder="e.g. Mustang GT" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="year">Year</Label>
            <Input id="year" type="number" placeholder="e.g. 1967" />
          </div>
          <div>
            <Label htmlFor="type">Vehicle Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="classic_car">Classic Car</SelectItem>
                  <SelectItem value="ev_project">EV Project</SelectItem>
                  <SelectItem value="fleet">Fleet</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe your vehicle or project..."
          />
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="p-8">
              <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">Wallet Required</h2>
              <p className="text-muted-foreground mb-4">
                Connect your wallet to start the tokenization process
              </p>
              <Button className="w-full">Connect Wallet</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Asset Tokenization</h1>
            <p className="text-xl text-muted-foreground">
              Transform your real world asset into tradeable tokens
            </p>
          </div>

          {/* Progress Steps */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                {TOKENIZATION_STEPS.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                        currentStep >= step.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {currentStep > step.id ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        step.id
                      )}
                    </div>
                    {index < TOKENIZATION_STEPS.length - 1 && (
                      <div
                        className={`w-16 h-0.5 mx-2 ${
                          currentStep > step.id ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <Progress
                value={(currentStep / TOKENIZATION_STEPS.length) * 100}
                className="mb-2"
              />
              <div className="text-center">
                <h3 className="font-semibold">
                  {TOKENIZATION_STEPS[currentStep - 1].title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {TOKENIZATION_STEPS[currentStep - 1].description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Step Content */}
          <Card>
            <CardContent className="p-8">{renderStepContent()}</CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep < TOKENIZATION_STEPS.length ? (
              <Button onClick={nextStep}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button className="bg-green-600 hover:bg-green-700">
                Deploy Token
                <Coins className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
