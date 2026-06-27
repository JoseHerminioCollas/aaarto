import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import config from "./config";

interface CoinbaseEthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  isCoinbaseWallet?: boolean;
}

export const connectCoinbaseWallet = async () => {
  const coinbaseWallet = new CoinbaseWalletSDK({
    appName: "Aaarto NFT Minting",
    appLogoUrl: "https://aaarto.art/logo.png",
  });

  const ethereum = coinbaseWallet.makeWeb3Provider(config.rpcUrl) as CoinbaseEthereumProvider;
console.log('a', ethereum)
  // Show "connecting" message in UI immediately
  // (don't return here, just inform the UI)
  if (!window.ethereum || !window.ethereum.request || !window.ethereum.isCoinbaseWallet) {
    console.log("Extension not detected — popup will show, inform user of options");
    // e.g. setErrorMessage("Use mobile app or install extension")
    // but DO NOT return, let request run
  }
console.log('b' )

  try {
    const accounts = (await ethereum.request({
      method: "eth_requestAccounts",
    })) as string[];
console.log('c', accounts )

    if (!accounts || accounts.length === 0) {
      throw new Error("no_accounts");
    }

    return { ethereum, account: accounts[0], status: '' };
  } catch (err: any) {
    console.error("Coinbase Wallet extension not responding", err);
    throw new Error("not_installed");
  }
};
