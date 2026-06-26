import config from "./config";
import { ethers, TransactionResponse, TransactionReceipt } from "ethers";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";

const errorMessages = {
  notInstalled: "Coinbase Wallet is not available. Please install or open it.",
  accountAccess: "Connect Coinbase Wallet account with this site.",
  attemptAdd: `Attempting to add the ${config.chainNameDisplay} chain.`,
  attemptSwitch: `Attempting to switch to the ${config.chainNameDisplay} chain.`,
  general: "An error occurred during minting.",
  userCancel: "The request has been cancelled.",
  alreadyProcessing:
    "Coinbase Wallet is processing a request, try opening Coinbase Wallet",
};

const contractAddress = config.contractAddress;
const platformFee = ethers.parseEther(config.platformFee);

const mintNFT = async (ipfsTokenURI: string): Promise<string | undefined> => {
  try {
    const coinbaseWallet = new CoinbaseWalletSDK({
      appName: "Aaarto NFT Minting",
      appLogoUrl: "https://aaarto.art/logo.png",
    });

    const ethereum = coinbaseWallet.makeWeb3Provider(config.rpcUrl);

    if (!ethereum) {
      throw new Error(errorMessages.notInstalled);
    }

    const userAccounts = (await ethereum.request({
      method: "eth_requestAccounts",
    })) as string[];
    const userAccount = userAccounts[0];

    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();

    const { chainId } = await provider.getNetwork();
    if (chainId !== config.chainIDBigInt) {
      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: config.chainIDHex }],
        });
      } catch (e: unknown) {
        if (e instanceof Error && "code" in e && (e as any).code === 4902) {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: config.ethRequestParams,
          });
        }
      }
    }

    const AaartoNFTContract = new ethers.Contract(
      contractAddress,
      config.contractArtifact.abi,
      signer,
    );

    const txResponse: TransactionResponse = await AaartoNFTContract.preSafeMint(
      userAccount,
      ipfsTokenURI,
      { value: platformFee },
    );

    // Fix: assert non-null receipt
    // const receipt = (await txResponse.wait()) as TransactionReceipt;
    // if (!receipt || !receipt.hash) {
    //   throw new Error("Transaction has not been successful");
    // }
    const receipt = await txResponse.wait();
    if (!receipt) {
      throw new Error("Transaction receipt is null");
    }
    if (!receipt.hash) {
      throw new Error("Transaction has not been successful");
    }
    return receipt.hash;

  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes("user rejected action")) {
        throw new Error(errorMessages.userCancel);
      }
      if (error.message.includes("successful")) {
        throw error;
      } else {
        throw new Error(errorMessages.general);
      }
    }
  }
};

export default mintNFT;
