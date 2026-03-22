require('dotenv').config();
const fs = require('fs');
const path = require('path');
const solc = require('solc');
const { ethers } = require('ethers');

async function main() {
    console.log("Compiling GaslessAIOracle.sol...");
    const contractPath = path.resolve(__dirname, 'GaslessAIOracle.sol');
    const sourceCode = fs.readFileSync(contractPath, 'utf8');

    const input = {
        language: 'Solidity',
        sources: {
            'GaslessAIOracle.sol': {
                content: sourceCode
            }
        },
        settings: {
            evmVersion: 'paris',
            outputSelection: {
                '*': {
                    '*': ['*']
                }
            }
        }
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    
    if (output.errors) {
        output.errors.forEach(err => console.error(err.formattedMessage));
        const hasErrors = output.errors.some(err => err.severity === 'error');
        if (hasErrors) {
            console.error("Compilation failed. Exiting.");
            process.exit(1);
        }
    }

    const contractFile = output.contracts['GaslessAIOracle.sol']['GaslessAIOracle'];
    const bytecode = contractFile.evm.bytecode.object;
    const abi = contractFile.abi;

    // Save ABI for agent script
    fs.writeFileSync('GaslessAIOracle.json', JSON.stringify(abi, null, 2));

    const provider = new ethers.JsonRpcProvider(process.env.STATUS_RPC);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    console.log(`Deploying from account: ${wallet.address}`);
    const balance = await provider.getBalance(wallet.address);
    console.log(`Account Balance: ${ethers.formatEther(balance)} ETH`);

    const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    
    // Gasless deployment on Status Network
    console.log("Deploying contract (waiting for tx to be mined)...");
    const contract = await factory.deploy({
        gasPrice: 0,
        gasLimit: 3000000 // Provide enough gas limit, 0 price
    });
    
    await contract.waitForDeployment();
    const address = await contract.getAddress();
    
    console.log(`Contract deployed at address: ${address}`);
    console.log(`Deployment Transaction Hash: ${contract.deploymentTransaction().hash}`);

    // Save contract address
    fs.writeFileSync('contractAddress.txt', address);
    console.log("Saved contract address to contractAddress.txt");
}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
