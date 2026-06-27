// src/mintNFT.ts
import config from "./config";
import { ethers, TransactionResponse, TransactionReceipt } from "ethers";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";

const contractAddress = config.contractAddress;
const platformFee = ethers.parseEther(config.platformFee);

const mintNFT = async (ipfsTokenURI: string): Promise<string | undefined> => {
  // Inline Coinbase Wallet setup
  const coinbaseWallet = new CoinbaseWalletSDK({
    appName: "Aaarto NFT Minting",
    appLogoUrl: "https://aaarto.art/logo.png",
  });
  const ethereum = coinbaseWallet.makeWeb3Provider(config.rpcUrl);

  if (!ethereum || !ethereum.request) {
    throw new Error("Wallet not available");
  }

  const accounts = (await ethereum.request({
    method: "eth_requestAccounts",
  })) as string[];
  if (!accounts || accounts.length === 0) {
    throw new Error("No accounts found");
  }
  const account = accounts[0];

  const provider = new ethers.BrowserProvider(ethereum);
  const signer = await provider.getSigner();

  const { chainId } = await provider.getNetwork();
  if (chainId !== config.chainIDBigInt) {
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: config.chainIDHex }],
      });
    } catch (e: any) {
      if (e.code === 4902) {
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

  // Estimate gas to force wallet popup
  const gasLimit = await AaartoNFTContract.preSafeMint.estimateGas(
    account,
    ipfsTokenURI,
    { value: platformFee },
  );

  const txResponse: TransactionResponse = await AaartoNFTContract.preSafeMint(
    account,
    ipfsTokenURI,
    { value: platformFee, gasLimit },
  );

  const receipt: TransactionReceipt | null = await txResponse.wait();
  if (!receipt || !receipt.hash) {
    throw new Error("Transaction failed");
  }
  return receipt.hash;
};

export default mintNFT;
