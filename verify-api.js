const fs = require('fs');

async function main() {
    const sourceCode = fs.readFileSync('GaslessAIOracle.sol', 'utf8');
    const contractAddress = '0xF6393C9fCcB2236A6Ea7502fAbBc8768b8E19E66';

    const payload = new URLSearchParams({
        module: 'contract',
        action: 'verifysourcecode',
        contractaddress: contractAddress,
        sourceCode: sourceCode,
        contractname: 'GaslessAIOracle',
        codeformat: 'solidity-single-file',
        compilerversion: 'v0.8.28+commit.7893614a',
        optimizationUsed: 0,
        runs: 200,
        evmversion: 'paris',
        licenseType: 3 // MIT
    });

    console.log("Submitting verification request to Blockscout...");
    const response = await fetch('https://sepoliascan.status.network/api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: payload
    });

    const data = await response.json();
    console.log("Response:", data);

    if (data.status === '1') {
        const guid = data.result;
        console.log(`Verification GUID: ${guid}. Waiting for verification to complete...`);
        
        // Poll for status
        for (let i = 0; i < 10; i++) {
            await new Promise(r => setTimeout(r, 3000));
            const checkRes = await fetch(`https://sepoliascan.status.network/api?module=contract&action=checkverifystatus&guid=${guid}`);
            const checkData = await checkRes.json();
            console.log("Status:", checkData);
            if (checkData.status === '1') {
                console.log("VERIFIED SUCCESSFULLY!");
                return;
            }
        }
    } else {
        console.error("Verification failed:", data.result);
    }
}

main().catch(console.error);
