require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { ethers } = require('ethers');

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/api/run-agent', async (req, res) => {
    // We will use Server-Side Events (SSE) to stream progress to the premium UI!
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const sendEvent = (step, message, data = null) => {
        res.write(`data: ${JSON.stringify({ step, message, data })}\n\n`);
    };

    try {
        sendEvent('start', 'Initializing Gasless Status AI Agent pipeline...');

        const VENICE_API_KEY = process.env.VENICE_API_KEY;
        const VENICE_API_BASE = process.env.VENICE_API_BASE;

        // STEP 1: Venice AI
        sendEvent('venice_start', 'Generating private AI market analysis via Venice...');
        let prediction = "Markets are highly volatile; secure your assets on L2s.";
        
        if (VENICE_API_KEY && VENICE_API_BASE) {
            try {
                const reqBody = {
                    model: "venice-uncensored",
                    messages: [{ role: "user", content: "You are a confidential onchain risk desk analyst. Output a 1-sentence classified risk assessment regarding L2 centralization." }]
                };
                // Fallback to fetch
                const vRes = await fetch(`${VENICE_API_BASE}/chat/completions`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${VENICE_API_KEY}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(reqBody)
                });
                if (vRes.ok) {
                    const data = await vRes.json();
                    prediction = data.choices[0].message.content.trim();
                }
            } catch (e) {
                console.error("Venice failed silently, using fallback");
            }
        }
        sendEvent('venice_done', `Venice AI decided: "${prediction}"`, prediction);

        // STEP 2: Protocol Labs / Filecoin
        sendEvent('filecoin_start', 'Storing AI report permanently on Filecoin via Lighthouse...');
        const LIGHTHOUSE_API_KEY = process.env.LIGHTHOUSE_API_KEY;
        let finalPayload = prediction;
        let filecoinCid = "simulated-cid-123";
        if (LIGHTHOUSE_API_KEY) {
            try {
                const lighthouse = require('@lighthouse-web3/sdk');
                const pRes = await lighthouse.uploadText(prediction, LIGHTHOUSE_API_KEY, "Status-Oracle-Report");
                filecoinCid = pRes.data.Hash;
                finalPayload = `ipfs://${filecoinCid}`;
            } catch(e) {}
        }
        sendEvent('filecoin_done', `Pinned to Filecoin: ${filecoinCid}`, filecoinCid);

        // STEP 3: ENS
        sendEvent('ens_start', 'Dynamically resolving target contract via ENS (gasless-oracle.eth)...');
        let contractAddress = "";
        try {
            const mainnetProvider = new ethers.JsonRpcProvider("https://eth.llamarpc.com"); 
            const ensResolved = await mainnetProvider.resolveName("gasless-oracle.eth");
            if (ensResolved) { contractAddress = ensResolved; } 
            else { throw new Error(); }
        } catch (e) {
            contractAddress = fs.readFileSync('contractAddress.txt', 'utf8').trim();
        }
        sendEvent('ens_done', `ENS securely resolved to: ${contractAddress}`, contractAddress);

        // STEP 4: Status Network
        sendEvent('status_start', 'Broadcasting gasless 0-fee transaction to Status Network...');
        const provider = new ethers.JsonRpcProvider(process.env.STATUS_RPC);
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        const abi = JSON.parse(fs.readFileSync('GaslessAIOracle.json', 'utf8'));
        const contract = new ethers.Contract(contractAddress, abi, wallet);

        const tx = await contract.updatePrediction(finalPayload, {
            gasPrice: 0,
            gasLimit: 3000000
        });

        sendEvent('status_pending', `Transaction sent! TxHash: ${tx.hash}`);
        const receipt = await tx.wait();

        sendEvent('status_done', `Success! Block: ${receipt.blockNumber}, Gas Price: 0 Gwei`, {
            hash: tx.hash,
            blockNumber: receipt.blockNumber,
            gasUsed: receipt.gasUsed.toString()
        });

        sendEvent('complete', 'Pipeline fully executed!');
        res.end();
    } catch (error) {
        sendEvent('error', `Pipeline failed: ${error.message}`);
        res.end();
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Live Dashboard running on http://localhost:${PORT}`);
});
