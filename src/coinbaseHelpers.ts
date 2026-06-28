import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import config from "./config";

interface CoinbaseEthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  isCoinbaseWallet?: boolean;
  on?: (event: string, handler: (...args: any[]) => void) => void;
  removeListener?: (event: string, handler: (...args: any[]) => void) => void;
}

function getCoinbaseProvider(
  openNoWalletModal: () => void,
): CoinbaseEthereumProvider | null {
  const { ethereum } = window as any;
  if (!ethereum) {
    console.log("No Ethereum provider injected at all");
    openNoWalletModal();
    return null;
  }

  // Case: multiple providers injected
  if (Array.isArray(ethereum.providers)) {
    const coinbase = ethereum.providers.find((p: any) => p.isCoinbaseWallet);
    if (!coinbase) {
      console.log("Coinbase Wallet not found among multiple providers");
      openNoWalletModal();
    }
    return coinbase || null;
  }

  // Case: providerMap
  if (ethereum.providerMap && typeof ethereum.providerMap.get === "function") {
    const coinbase = ethereum.providerMap.get("CoinbaseWallet");
    if (!coinbase) {
      console.log("Coinbase Wallet not found in providerMap");
      openNoWalletModal();
    }
    return coinbase || null;
  }

  // Case: single provider injected
  if (!ethereum.isCoinbaseWallet) {
    console.log("Single provider injected, but it is not Coinbase Wallet");
    openNoWalletModal();
    return null;
  }

  return ethereum as CoinbaseEthereumProvider;
}

export async function connectCoinbaseWallet(openNoWalletModal: () => void) {
  const coinbaseWallet = new CoinbaseWalletSDK({
    appName: "Aaarto NFT Minting",
    appLogoUrl: "https://aaarto.art/logo.png",
  });

  const ethereum =
    getCoinbaseProvider(openNoWalletModal) ??
    (coinbaseWallet.makeWeb3Provider(
      config.rpcUrl,
    ) as CoinbaseEthereumProvider);

  console.log("Connecting with Coinbase provider:", ethereum);

  const accounts = (await ethereum.request({
    method: "eth_requestAccounts",
  })) as string[];

  if (!accounts || accounts.length === 0) {
    throw new Error("no_accounts");
  }

  console.log("Connected account:", accounts[0]);

  // Event listeners for future UI integration
  if (ethereum.on) {
    ethereum.on("accountsChanged", (accs: string[]) => {
      console.log("Accounts changed:", accs);
    });

    ethereum.on("chainChanged", (chainId: string) => {
      console.log("Chain changed:", chainId);
    });

    ethereum.on("disconnect", (error: any) => {
      console.log("Disconnected from Coinbase Wallet:", error);
    });
  }

  return { ethereum, account: accounts[0] };
}
