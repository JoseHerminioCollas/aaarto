import { ethers } from "ethers";
import config from "./config";

const contractAddress = config.contractAddress;
const platformFee = ethers.parseEther(config.platformFee);

export const mintNFT = async (
  ethereum: any,
  account: string,
  ipfsTokenURI: string
): Promise<string> => {
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
    signer
  );

  const gasLimit = await AaartoNFTContract.preSafeMint.estimateGas(
    account,
    ipfsTokenURI,
    { value: platformFee }
  );

  const txResponse = await AaartoNFTContract.preSafeMint(
    account,
    ipfsTokenURI,
    { value: platformFee, gasLimit }
  );

  const receipt = await txResponse.wait();
  if (!receipt?.hash) throw new Error("Transaction failed");
  return receipt.hash;
};
