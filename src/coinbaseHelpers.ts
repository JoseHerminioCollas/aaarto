import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import config from "./config";

interface CoinbaseEthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  isCoinbaseWallet?: boolean;
}

function getCoinbaseProvider(): CoinbaseEthereumProvider | null {
  const { ethereum } = window as any;
  if (!ethereum) {
    console.log("No Ethereum provider injected at all");
    return null;
  }

  // Case: multiple providers injected
  if (Array.isArray(ethereum.providers)) {
    const coinbase = ethereum.providers.find((p: any) => p.isCoinbaseWallet);
    if (!coinbase) {
      console.log("Coinbase Wallet not found among multiple providers");
    }
    return coinbase || null;
  }

  // Case: providerMap (some environments expose this instead of providers[])
  if (ethereum.providerMap && typeof ethereum.providerMap.get === "function") {
    const coinbase = ethereum.providerMap.get("CoinbaseWallet");
    if (!coinbase) {
      console.log("Coinbase Wallet not found in providerMap");
    }
    return coinbase || null;
  }

  // Case: single provider injected
  if (!ethereum.isCoinbaseWallet) {
    console.log("Single provider injected, but it is not Coinbase Wallet");
    return null;
  }

  return ethereum as CoinbaseEthereumProvider;
}

export async function connectCoinbaseWallet() {
  const coinbaseWallet = new CoinbaseWalletSDK({
    appName: "Aaarto NFT Minting",
    appLogoUrl: "https://aaarto.art/logo.png",
  });

  const ethereum = getCoinbaseProvider() 
    ?? (coinbaseWallet.makeWeb3Provider(config.rpcUrl) as CoinbaseEthereumProvider);

  console.log("Connecting with Coinbase provider:", ethereum);

  try {
    const accounts = (await ethereum.request({
      method: "eth_requestAccounts",
    })) as string[];

    if (!accounts || accounts.length === 0) {
      return { status: "no_accounts", ethereum };
    }

    return { status: "connected", ethereum, account: accounts[0] };
  } catch (err: any) {
    console.error("Coinbase Wallet not responding", err);
    return { status: "not_installed", ethereum };
  }
}
