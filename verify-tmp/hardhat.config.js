import "@nomicfoundation/hardhat-verify";
import "dotenv/config";

export default {
  solidity: {
    version: "0.8.28",
    settings: {
      evmVersion: "paris",
      optimizer: {
        enabled: false,
        runs: 200,
      },
    },
  },
  networks: {
    status_sepolia: {
      type: "http",
      url: process.env.STATUS_RPC || "https://public.sepolia.rpc.status.network",
      chainId: 1660990954,
    },
  },
  etherscan: {
    apiKey: {
      status_sepolia: "abc",
    },
    customChains: [
      {
        network: "status_sepolia",
        chainId: 1660990954,
        urls: {
          apiURL: "https://sepoliascan.status.network/api",
          browserURL: "https://sepoliascan.status.network",
        },
      },
    ],
  },
};
