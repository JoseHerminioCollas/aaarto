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
console.log('a')
  if (!window.ethereum || !window.ethereum.request || !window.ethereum.isCoinbaseWallet) {
    console.log("Coinbase Wallet extension not detected");
    // throw new Error("not_installed");
    // TODO show message, do not throw error
  }
  try {
    const accounts = (await ethereum.request({
      method: "eth_requestAccounts",
    })) as string[];
console.log('b')

    if (!accounts || accounts.length === 0) {
console.log('c')
      throw new Error("no_accounts");
    }

    return { ethereum, account: accounts[0] };
  } catch (err: any) {
    // If the extension isn’t installed, this request will fail
    console.error("Coinbase Wallet extension not detected or not responding", err);
    throw new Error("not_installed");
  }
};
