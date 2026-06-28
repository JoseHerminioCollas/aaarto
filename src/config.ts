import contractArtifactSepolia from "../artifacts/contracts/AaartoNFTV4.sol/AaartoNFTV4.json";

/**
 * config: if there is a window.env
 * get values from it, otherwise use default values
 */
export type WindowEnv = { platformFee: string; network: string };
type Network = "sepolia" | "polygon" | "amoy";

let config: any;
// TODO test only, add the next 2 lines for production
// const windowEnv: WindowEnv = { network: "polygon", platformFee: "0.001" };
// window.env = windowEnv;
// set default values
let platformFee = "0.0001";
let network: Network = "sepolia";
const chainNames: Record<Network, string> = {
  sepolia: "Sepolia Ether",
  polygon: "Polygon Mainnet",
  amoy: "Polygon Amoy Testnet",
};
let chainName = chainNames.sepolia;
if (window.env) {
  platformFee = window.env.platformFee;
  network = window.env.network as Network;
  chainName = chainNames[network];
}
if (network === "sepolia") {
  config = {
    chainNameDisplay: chainName,
    contractArtifact: contractArtifactSepolia,
    platformFee,
    contractAddress: "0x92128cD1BCA8cc406d2223Dcf1558E4d926Dd68f",
    chainIDBigInt: 1155111n,
    chainIDHex: "0xaa36a7",
    ethRequestParams: [
      {
        chainId: "0xaa36a7",
        chainName,
        rpcUrls: ["https://rpc.sepolia.org"],
        nativeCurrency: {
          name: "SEP",
          symbol: "SEP",
          decimals: 18,
        },
        blockExplorerUrls: ["https://sepolia.etherscan.io"],
      },
    ],
  };
} else if (network === "polygon") {
  config = {
    chainNameDisplay: chainName,
    contractArtifact: contractArtifactSepolia,
    platformFee,
    contractAddress: "0x03a9423E9Aac42E9F991D292F8e074808D9ABE7f",
    chainIDBigInt: 137n,
    chainIDHex: "0x89",
    ethRequestParams: [
      {
        chainId: "0x89",
        chainName,
        rpcUrls: ["https://polygon-rpc.com/"],
        nativeCurrency: {
          name: "MATIC",
          symbol: "MATIC",
          decimals: 18,
        },
        blockExplorerUrls: ["https://polygonscan.com/"],
      },
    ],
  };
} else if (network === "amoy") {
  config = {
    chainNameDisplay: chainName,
    contractArtifact: contractArtifactSepolia,
    platformFee,
    contractAddress: "0xXXX",
    chainIDBigInt: 80002n,
    chainIDHex: "0x13882",
    ethRequestParams: [
      {
        chainId: "0x13882",
        chainName,
        rpcUrls: ["https://rpc-amoy.polygon.technology/"],
        nativeCurrency: {
          name: "MATIC",
          symbol: "MATIC",
          decimals: 18,
        },
        blockExplorerUrls: ["https://amoy.polygonscan.com/"],
      },
    ],
  };
} else {
  throw "Chain config does not exist";
}
export default config;
