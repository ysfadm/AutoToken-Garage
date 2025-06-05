"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VehicleMetadata } from "@/lib/auto-token";

interface TokenizedVehicle extends VehicleMetadata {
  assetCode: string;
  issuer: string;
  availableSupply: string;
  price: string;
}

// Mock data - in a real app, this would come from your backend/blockchain
const mockVehicles: TokenizedVehicle[] = [
  {
    make: "Ford",
    model: "Mustang GT",
    year: 1967,
    vin: "ABC123XYZ",
    condition: "Excellent",
    mileage: 75000,
    images: [
      "https://example.com/mustang1.jpg",
      "https://example.com/mustang2.jpg",
    ],
    assetCode: "MUSTANG67",
    issuer: "GXXXXX...XXXXX",
    availableSupply: "100000",
    price: "10",
  },
  {
    make: "Tesla",
    model: "Model S Plaid",
    year: 2024,
    vin: "XYZ789ABC",
    condition: "Good",
    mileage: 15000,
    images: ["https://example.com/tesla1.jpg"],
    assetCode: "TSLA24",
    issuer: "GXXXXX...XXXXX",
    availableSupply: "500000",
    price: "15",
  },
];

export default function MarketplacePage() {
  const [vehicles] = useState<TokenizedVehicle[]>(mockVehicles);
  const [selectedVehicle, setSelectedVehicle] =
    useState<TokenizedVehicle | null>(null);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Vehicle Marketplace</h1>
        <div className="flex gap-4">
          <Button variant="outline">Filter</Button>
          <Button variant="outline">Sort</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle, index) => (
          <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
            {vehicle.images[0] && (
              <div className="aspect-video relative mb-4 rounded-lg overflow-hidden">
                <img
                  src={vehicle.images[0]}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="object-cover w-full h-full"
                />
              </div>
            )}

            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h2>
                <div className="flex gap-2 mt-2">
                  <Badge>{vehicle.condition}</Badge>
                  <Badge variant="outline">
                    {vehicle.mileage.toLocaleString()} miles
                  </Badge>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Price per token</p>
                  <p className="text-lg font-bold">{vehicle.price} XLM</p>
                </div>
                <Button
                  onClick={() => setSelectedVehicle(vehicle)}
                  variant="default"
                >
                  View Details
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog
        open={!!selectedVehicle}
        onOpenChange={(open) => !open && setSelectedVehicle(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedVehicle?.year} {selectedVehicle?.make}{" "}
              {selectedVehicle?.model}
            </DialogTitle>
          </DialogHeader>

          {selectedVehicle && (
            <>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Condition</p>
                  <p className="font-medium">{selectedVehicle.condition}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mileage</p>
                  <p className="font-medium">
                    {selectedVehicle.mileage.toLocaleString()} miles
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">VIN</p>
                  <p className="font-medium">{selectedVehicle.vin}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Available Supply</p>
                  <p className="font-medium">
                    {selectedVehicle.availableSupply} tokens
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Asset Code</p>
                  <p className="font-medium">{selectedVehicle.assetCode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Issuer</p>
                  <p className="font-medium">{selectedVehicle.issuer}</p>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => setSelectedVehicle(null)}
                >
                  Close
                </Button>
                <Button className="w-full">Buy Tokens</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
