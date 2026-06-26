// src/coinbaseHelpers.ts
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import config from "./config";

const errorMessages = {
  notInstalled: "Coinbase Wallet is not installed or not detected.",
  alreadyProcessing:
    "Coinbase Wallet is already processing a request, try opening the Coinbase Wallet application.",
};

// Create a Coinbase Wallet SDK instance
const coinbaseWallet = new CoinbaseWalletSDK({
  appName: "Aaarto NFT Minting",
  appLogoUrl: "https://aaarto.art/logo.png",
});

// Create the provider once
const ethereum = coinbaseWallet.makeWeb3Provider(config.rpcUrl);

// Function 1: check installation
export const checkCoinbaseInstall = () => {
  if (!ethereum || !ethereum.request) {
    throw new Error(errorMessages.notInstalled);
  }
};

// Function 2: request accounts
export const requestAccounts = async (): Promise<string> => {
  try {
    const accounts = (await ethereum.request({
      method: "eth_requestAccounts",
    })) as string[];

    return accounts.join(" | ");
  } catch (error: any) {
    if (error.message?.includes("Already processing eth_requestAccounts")) {
      throw new Error(errorMessages.alreadyProcessing);
    }
    throw error;
  }
};
