import { getPublicKey, signTransaction } from "@stellar/freighter-api";
import StellarSdk from "stellar-sdk";
import { server, NETWORKS, createAsset, AUTO_TOKEN_CONFIG } from "./stellar";

export interface VehicleMetadata {
  make: string;
  model: string;
  year: number;
  vin: string;
  condition: string;
  mileage: number;
  images: string[];
}

// IPFS hash'ini simüle et (gerçek uygulamada IPFS entegrasyonu eklenecek)
function mockIPFSHash(metadata: VehicleMetadata): string {
  return `Qm${Buffer.from(JSON.stringify(metadata))
    .toString("base64")
    .slice(0, 44)}`;
}

// Araç tokenizasyonu
export async function tokenizeVehicle(params: {
  vehicleMetadata: VehicleMetadata;
  totalSupply: string;
}): Promise<{
  asset: StellarSdk.Asset;
  txHash: string;
  metadataHash: string;
}> {
  try {
    const { vehicleMetadata, totalSupply } = params;
    const userPublicKey = await getPublicKey();

    // IPFS hash'ini oluştur (simüle edilmiş)
    const metadataHash = mockIPFSHash(vehicleMetadata);

    // Asset code'unu araç bilgilerinden oluştur
    const assetCode = `${vehicleMetadata.make.slice(0, 4).toUpperCase()}${
      vehicleMetadata.year
    }`;
    const asset = createAsset(assetCode, userPublicKey);

    // İşlemi oluştur
    const account = await server.loadAccount(userPublicKey);
    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORKS.testnet.networkPassphrase,
    })
      .addOperation(
        StellarSdk.Operation.manageData({
          name: "VEHICLE_METADATA_HASH",
          value: metadataHash,
        })
      )
      .setTimeout(180)
      .build();

    // İşlemi imzala
    const signedXDR = await signTransaction(transaction.toXDR(), {
      networkPassphrase: NETWORKS.testnet.networkPassphrase,
    });

    // İmzalı işlemi gönder
    const submittedTx = await server.submitTransaction(
      StellarSdk.TransactionBuilder.fromXDR(
        signedXDR,
        NETWORKS.testnet.networkPassphrase
      )
    );

    return {
      asset,
      txHash: submittedTx.hash,
      metadataHash,
    };
  } catch (error) {
    console.error("Error tokenizing vehicle:", error);
    throw error;
  }
}

// Token transferi
export async function transferTokens(
  destinationAddress: string,
  asset: StellarSdk.Asset,
  amount: string
): Promise<string> {
  try {
    const sourcePublicKey = await getPublicKey();
    const account = await server.loadAccount(sourcePublicKey);

    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORKS.testnet.networkPassphrase,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: destinationAddress,
          asset: asset,
          amount: amount,
        })
      )
      .setTimeout(180)
      .build();

    const signedXDR = await signTransaction(transaction.toXDR(), {
      networkPassphrase: NETWORKS.testnet.networkPassphrase,
    });

    const result = await server.submitTransaction(
      StellarSdk.TransactionBuilder.fromXDR(
        signedXDR,
        NETWORKS.testnet.networkPassphrase
      )
    );

    return result.hash;
  } catch (error) {
    console.error("Error transferring tokens:", error);
    throw error;
  }
}
