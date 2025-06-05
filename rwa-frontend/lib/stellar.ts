import StellarSdk from "stellar-sdk";

// Network configuration
export const NETWORKS = {
  testnet: {
    networkPassphrase: StellarSdk.Networks.TESTNET,
    horizonUrl: "https://horizon-testnet.stellar.org",
    friendbotUrl: "https://friendbot.stellar.org",
  },
};

// Configure Stellar SDK for testnet
export const server = new StellarSdk.Server(NETWORKS.testnet.horizonUrl);

// Auto Token configuration
export const AUTO_TOKEN_CONFIG = {
  code: "AUTOTKN",
  issuer: "", // Will be set after account creation
  limit: "1000000000",
};

// Create a new account using Friendbot
export async function createTestnetAccount(): Promise<StellarSdk.Keypair> {
  const keypair = StellarSdk.Keypair.random();

  try {
    const response = await fetch(
      `${NETWORKS.testnet.friendbotUrl}?addr=${encodeURIComponent(
        keypair.publicKey()
      )}`
    );

    if (!response.ok) {
      throw new Error("Failed to fund account");
    }

    await response.json();
    return keypair;
  } catch (error) {
    console.error("Error creating testnet account:", error);
    throw error;
  }
}

// Create a new asset
export function createAsset(code: string, issuer: string): StellarSdk.Asset {
  return new StellarSdk.Asset(code, issuer);
}

// Create a trustline transaction
export async function createTrustline(
  publicKey: string,
  asset: StellarSdk.Asset
): Promise<StellarSdk.Transaction> {
  try {
    const account = await server.loadAccount(publicKey);

    return new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORKS.testnet.networkPassphrase,
    })
      .addOperation(
        StellarSdk.Operation.changeTrust({
          asset,
          limit: AUTO_TOKEN_CONFIG.limit,
        })
      )
      .setTimeout(180)
      .build();
  } catch (error) {
    console.error("Error creating trustline transaction:", error);
    throw error;
  }
}

// Submit a signed transaction
export async function submitTransaction(
  transaction: StellarSdk.Transaction
): Promise<StellarSdk.Horizon.SubmitTransactionResponse> {
  try {
    return await server.submitTransaction(transaction);
  } catch (error) {
    console.error("Error submitting transaction:", error);
    throw error;
  }
}

// Get account balances
export async function getAccountBalances(publicKey: string) {
  try {
    const account = await server.loadAccount(publicKey);
    return account.balances;
  } catch (error) {
    console.error("Error getting account balances:", error);
    throw error;
  }
}
