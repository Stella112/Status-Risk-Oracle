require('dotenv').config();
const fs = require('fs');
const { ethers } = require('ethers');
const { OpenAI } = require('openai');

function logToAgent(step, status, details) {
    const logFile = 'agent_log.json';
    let logs = [];
    if (fs.existsSync(logFile)) {
        logs = JSON.parse(fs.readFileSync(logFile, 'utf8'));
    }
    logs.push({ timestamp: new Date().toISOString(), step, status, details });
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
}

async function main() {
    console.log("Starting Gasless Status AI Agent...");
    
    const VENICE_API_KEY = process.env.VENICE_API_KEY || process.env.HERMES_API_KEY;
    const VENICE_API_BASE = process.env.VENICE_API_BASE || process.env.HERMES_API_BASE;

    let prediction = "";
    if (VENICE_API_KEY && VENICE_API_BASE) {
        console.log("Generating highly-private AI prediction using Venice (venice-uncensored)...");
        try {
            const reqBody = {
                model: "venice-uncensored",
                messages: [
                    { role: "user", content: "You are a confidential onchain risk desk analyst. Output a 1-sentence classified risk assessment regarding L2 centralization." }
                ]
            };

            const res = await fetch(`${VENICE_API_BASE}/chat/completions`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${VENICE_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(reqBody)
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`HTTP ${res.status}: ${text}`);
            }

            const data = await res.json();
            prediction = data.choices[0].message.content.trim();
        } catch (e) {
            console.error("AI Generation failed:", e);
            prediction = "Markets are incredibly unpredictable today! (Simulated)";
        }
    } else {
        prediction = "All charts point to an exciting upcoming week! (Simulated Fallback)";
    }

    console.log(`\\nAI Agent decided to broadcast this prediction:`);
    console.log(`"${prediction}"\\n`);

    const LIGHTHOUSE_API_KEY = process.env.LIGHTHOUSE_API_KEY;
    let finalPayload = prediction;
    if (LIGHTHOUSE_API_KEY) {
        try {
            console.log("Integrating Protocol Labs/Filecoin (Bounty 4) via Lighthouse SDK...");
            const lighthouse = require('@lighthouse-web3/sdk');
            const response = await lighthouse.uploadText(prediction, LIGHTHOUSE_API_KEY, "Status-Oracle-Report");
            const cid = response.data.Hash;
            finalPayload = `ipfs://${cid}`;
            console.log(`✅ Permanently pinned to Filecoin with CID: ${cid}`);
        } catch (e) {
            console.error("Lighthouse upload failed, falling back to raw text:", e);
        }
    }

    const provider = new ethers.JsonRpcProvider(process.env.STATUS_RPC);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    // Bounty: ENS Target Resolution
    let contractAddress = "";
    try {
        console.log("Attempting to dynamically resolve target contract via ENS (gasless-oracle.eth)...");
        const mainnetProvider = new ethers.JsonRpcProvider("https://eth.llamarpc.com"); 
        const ensResolved = await mainnetProvider.resolveName("gasless-oracle.eth");
        if (ensResolved) {
            contractAddress = ensResolved;
            console.log(`✅ ENS securely resolved to: ${contractAddress}`);
        } else {
            throw new Error("ENS target not found");
        }
    } catch (e) {
        console.log(`⚠️ ENS not registered yet. Gracefully falling back to local cached address...`);
        contractAddress = fs.readFileSync('contractAddress.txt', 'utf8').trim();
    }
    const abi = JSON.parse(fs.readFileSync('GaslessAIOracle.json', 'utf8'));

    const contract = new ethers.Contract(contractAddress, abi, wallet);

    console.log(`Sending gasless transaction to update prediction on-chain...`);
    const tx = await contract.updatePrediction(finalPayload, {
        gasPrice: 0,
        gasLimit: 3000000 // Status Network gasless
    });

    console.log(`Transaction sent! Waiting for confirmation...`);
    console.log(`Transaction Hash: ${tx.hash}`);

    const receipt = await tx.wait();
    console.log(`\\nSuccess! Block Number: ${receipt.blockNumber}`);
    console.log(`Gas Used: ${receipt.gasUsed.toString()}, Gas Price: ${tx.gasPrice.toString()}`);
    console.log(`Verified Status Testnet Gasless Transaction!`);

    logToAgent('Pipeline Execution', 'Success', {
        prediction,
        filecoinCid: finalPayload,
        ensResolved: contractAddress,
        txHash: tx.hash
    });
}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
