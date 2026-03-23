# Status Risk Oracle — Agent Interface

## Overview
This is a fully autonomous **Confidential Onchain Risk Desk** AI Agent. It requires no human intervention to execute its pipeline.

## Live Endpoints
- **Dashboard UI**: `GET /` — Visual 5-step pipeline interface
- **Execute Agent Pipeline**: `POST /api/run-agent` — Triggers the full autonomous pipeline (Venice AI → Filecoin → ENS → Status Network), streams progress via Server-Sent Events

## Pipeline Steps (Autonomous)
1. **Venice AI** — Generates a private, no-data-retention risk assessment
2. **Protocol Labs / Filecoin** — Uploads the encrypted report permanently via Lighthouse SDK
3. **ENS Resolver** — Dynamically resolves the target oracle contract via `gasless-oracle.eth`
4. **Status Network L2** — Broadcasts the Filecoin CID with `gasPrice: 0`

## Triggering the Agent
```bash
curl -X POST https://<your-deployment-url>/api/run-agent \
  -H "Content-Type: application/json"
```

Response: Server-Sent Events stream with steps: `venice_start`, `venice_done`, `filecoin_start`, `filecoin_done`, `ens_start`, `ens_done`, `status_start`, `status_done`

## Agent Manifest
See [agent.json](./agent.json) for the full OpenClaw DevSpot capability manifest.

## Execution Log
See [agent_log.json](./agent_log.json) for the structured autonomous execution trail.

## Tech Stack
- Node.js + Express (SSE streaming)
- Ethers.js (Status Network L2 + ENS)
- Venice AI API (Private Inference)
- Lighthouse SDK (Filecoin Storage)
- Solidity (GaslessAIOracle.sol)
