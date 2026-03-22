const ethers = require('ethers');
const fs = require('fs');

// We generate a new wallet for this demo
const wallet = ethers.Wallet.createRandom();
console.log("Generated New Wallet:", wallet.address);
console.log("Private Key:", wallet.privateKey);

const envData = `STATUS_RPC=https://public.sepolia.rpc.status.network
PRIVATE_KEY=${wallet.privateKey}
HERMES_API_KEY=sk-ciol6sw50jvojhyahyv5e
HERMES_API_BASE=https://inference-api.nousresearch.com/v1
`;

fs.writeFileSync('.env', envData);
console.log("Saved .env file with new wallet");
