# Status Network AI Gasless Oracle

This project was built for the **Synthesis Open Track Hackathon** to demonstrate a fully functional, highly optimized 5-Bounty AI Architecture deployed on the **Status Network Sepolia Testnet**.

## 🏆 The "Private Gasless Storage Oracle" Pipeline (5 Bounties)
1. **Venice (Private AI)**: The agent exclusively uses the Venice inference API to generate fundamentally private, uncensored market reports.
2. **Protocol Labs (Agentic Storage / Filecoin)**: Because on-chain storage is severely limited, the massive encrypted report is uploaded identically to decentralized storage via the **Lighthouse SDK**, generating a permanent `CID`.
3. **Protocol Labs (Let the Agent Cook)**: Operating as a fully autonomous multi-tool entity, the engine natively respects the DevSpot registry structure, generating both a static `agent.json` operational manifest and an ongoing `agent_log.json` execution trail.
4. **ENS (Decentralized Identity)**: The agent dynamically resolves the target contract over the `gasless-oracle.eth` domain, refusing hardcoded centralization. 
5. **Status Network (Gasless L2)**: Finally, the agent anchors the IPFS CID seamlessly on the Status Network layer, executing with exactly `0` gas.

## Qualifying Proof Elements

### 📝 Verified Contract Deployment
The `GaslessAIOracle` contract was deployed gaslessly.
* **Network**: Status Network Sepolia
* **Contract Address**: `0xF6393C9fCcB2236A6Ea7502fAbBc8768b8E19E66`
* **Block Explorer Link**: [0xF6393C9fCcB2236A6Ea7502fAbBc8768b8E19E66](https://sepoliascan.status.network/address/0xF6393C9fCcB2236A6Ea7502fAbBc8768b8E19E66)

### ⛽ Integrated Execution Hash Proof
The AI Agent successfully coordinated Venice, Lighthouse/Filecoin, and ENS, sending the final Protocol Labs CID entirely gas-free!
* **Transaction Hash**: `0xb7862b9edd203a14384da1b7e835f1ec846818ed2045fd32d8c95f928fb514d4`
* **Filecoin Permanent Storage CID**: `bafkreia4fcxo5aeuhoknddfsplczw3k6qavfw363s45tu7tcle7ircqhoe`
* **Network**: Status Network Sepolia (RPC: `https://public.sepolia.rpc.status.network`)
* **Gas Used**: `66415` 
* **Gas Price / Fee paid**: `0 ETH`
* **Block Explorer Link**: [0xb7862b9edd203a14384da1b7e835f1ec846818ed2045fd32d8c95f928fb514d4](https://sepoliascan.status.network/tx/0xb7862b9edd203a14384da1b7e835f1ec846818ed2045fd32d8c95f928fb514d4)

## 📦 Why Filecoin is Essential to the Architecture

As autonomous agents generate incredibly dense, large language model outputs (like market analysis reports), storing these text strings natively on Ethereum or L2 smart contracts is unscalable and economically impossible. 

**Filecoin / Protocol Labs** is the foundational bedrock of this architecture because it acts as the "Agentic Storage Layer". Our AI Agent is programmed to autonomously encrypt and pin its intelligence payload to Filecoin permanently. It only anchors the lightweight IPFS `CID` onto the Status Network L2. Without Filecoin, our agent could not afford to store its findings, and the oracle would be fundamentally broken.

## 🎭 Why Venice AI is Essential to the Architecture

The core of this project operates as a **Confidential Onchain Risk Desk**. Because the AI agent analyzes sensitive market data and drafts confidential risk assessments regarding L2 centralization and macro-environments, relying on standard public LLMs (like OpenAI) would expose our alpha and strategies to corporate data retention policies. 

**Venice AI** provides the crucial "no-data-retention inference" layer. By wiring Venice's private cognition directly into our gasless Status Network smart contract, we successfully bridge the gap between "Private Agents" and "Trusted Public Actions"—ensuring the risk desk's intelligence remains strictly confidential until the moment the agent autonomously anchors it on-chain.

## 🌐 Why ENS is Essential to the Architecture

In a true decentralized agent economy, agents cannot rely on hardcoded, immutable `0x...` hex strings to find their targets. Smart contracts are upgraded, and endpoints change. 

**ENS Identity** is fundamentally core to this project. Our AI Agent utilizes ENS (`gasless-oracle.eth`) to dynamically establish the identity of the target Smart Contract on-chain. By writing the agent to autonomously resolve the `.eth` name via `ethers.js` before executing the Status Network transaction, we have **eliminated raw hex addresses from the agent's UX flow entirely**. The entity receiving the Private Risk Assessment is governed strictly by verifiable ENS naming.

---

## Technical Details & How to Run

**Prerequisites**:
- Node.js > 18
- NPM

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Wallet and APIs
You can generate a `.env` file containing required configuration values simply by running:
```bash
node setup.js
```

### 3. Deploy the Smart Contract Gaslessly
```bash
node deploy.js
```
This script compiles the Solidity code (using Paris EVM specification for wide L2 compatibility) and broadcasts a raw 0-gas deployment transaction to the Status Network.

### 4. Run the AI Oracle Agent Gaslessly
```bash
node agent.js
```
This queries the Hermes model endpoint and signs a 0-gas payload executing the update logic on the remote deployed contract container.
