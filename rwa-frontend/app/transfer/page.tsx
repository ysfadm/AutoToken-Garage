"use client";

import { useState, useEffect } from "react";
import { Asset } from "@stellar/stellar-sdk";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Send,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Info,
  Wallet,
} from "lucide-react";
import {
  formatTokenAmount,
  isValidStellarAddress,
  toContractAmount,
  estimateNetworkFee,
} from "@/lib/stellar";
import { toast } from "sonner";
import Link from "next/link";
import { transferTokens } from "@/lib/auto-token";

interface TransferForm {
  destinationAddress: string;
  assetCode: string;
  issuer: string;
  amount: string;
}

export default function TransferPage() {
  const { isConnected, address, connect } = useWalletStore();
  const { userBalance, isWhitelisted, compliance, transfer, assetMetadata } =
    useContractStore();

  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<TransferForm>({
    destinationAddress: "",
    assetCode: "",
    issuer: "",
    amount: "",
  });

  // Load data on mount and when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      // fetchUserData(address);
    }
  }, [isConnected, address]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Note: In a real app, source keys would come from a connected wallet
      const asset = new Asset(formData.assetCode, formData.issuer);

      await transferTokens(
        // This would be the user's keypair from their wallet
        sourceKeypair,
        formData.destinationAddress,
        asset,
        formData.amount
      );

      toast.success("Transfer successful!");

      // Reset form
      setFormData({
        destinationAddress: "",
        assetCode: "",
        issuer: "",
        amount: "",
      });
    } catch (error) {
      toast.error("Transfer failed", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="p-8">
              <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">Connect Wallet</h2>
              <p className="text-muted-foreground mb-4">
                Connect your wallet to transfer vehicle tokens
              </p>
              <Button onClick={connect} className="w-full">
                Connect Wallet
              </Button>
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
        <div className="max-w-xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Transfer Vehicle Tokens</h1>
            <p className="text-muted-foreground">
              Transfer ownership tokens for your vehicle investments
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Holdings</CardTitle>
              <CardDescription>
                Current token balance and vehicle information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Available Balance
                    </p>
                    <p className="text-2xl font-bold">
                      {formatTokenAmount(userBalance || "0")}
                    </p>
                  </div>
                  <Badge variant={isWhitelisted ? "default" : "secondary"}>
                    {isWhitelisted ? "Verified" : "Unverified"}
                  </Badge>
                </div>

                {assetMetadata && (
                  <div className="text-sm">
                    <p className="text-muted-foreground">Token Details:</p>
                    <p>
                      {assetMetadata.name} ({assetMetadata.symbol})
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transfer Details</CardTitle>
              <CardDescription>
                Enter recipient and amount to transfer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="recipient">Recipient Address</Label>
                <Input
                  id="recipient"
                  name="destinationAddress"
                  placeholder="Enter Stellar address"
                  value={formData.destinationAddress}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="amount">Amount to Transfer</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="text"
                  pattern="[0-9]*\.?[0-9]+"
                  placeholder="0.0"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Available: {formatTokenAmount(userBalance || "0")} tokens
                </p>
              </div>

              {!isWhitelisted && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You must complete verification before transferring tokens
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={
                  !isWhitelisted || !amount || !recipientAddress || isProcessing
                }
                onClick={handleSubmit}
              >
                {isProcessing ? (
                  "Processing..."
                ) : (
                  <>
                    Transfer Tokens
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <div className="mt-8 max-w-xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Recent Transfers</h2>
            <Card className="p-4">
              <p className="text-gray-500 text-center">No recent transfers</p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
