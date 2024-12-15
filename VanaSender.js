// ASCII Art Header
function printBanner() {
    console.log(`
    █████╗ ██╗██████╗ ██████╗ ██████╗  ██████╗ ██████╗ 
   ██╔══██╗██║██╔══██╗██╔══██╗██╔══██╗██╔═══██╗██╔══██╗
   ███████║██║██████╔╝██║  ██║██████╔╝██║   ██║██████╔╝
   ██╔══██║██║██╔══██╗██║  ██║██╔══██╗██║   ██║██╔═══╝ 
   ██║  ██║██║██║  ██║██████╔╝██║  ██║╚██████╔╝██║     
   ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝     
                                                    
                █████╗  █████╗  █████╗                 
               ██╔══██╗██╔══██╗██╔══██╗                
               ╚█████╔╝╚█████╔╝╚█████╔╝                
               ██╔══██╗██╔══██╗██╔══██╗                
               ╚█████╔╝╚█████╔╝╚█████╔╝                
                ╚════╝  ╚════╝  ╚════╝                     
                   DATAPIG AUTO - BOT                
     📢  Telegram Channel: https://t.me/airdroplocked
    `);
    console.log("==================================================");
}

// Print banner at the start
printBanner();

// Importing Web3 and Chalk
const Web3 = require('web3');
const chalk = require('chalk'); // Import Chalk for colored output
const fs = require('fs');

// Suppress Deprecation Warnings
process.noDeprecation = true;

// Your RPC URL for Vana Moksha Testnet
const rpcUrl = "https://wild-small-reel.vana-moksha.quiknode.pro/94ba07ddd711bb33efc07c2cd267bcce7a6f0fc2";
const web3 = new Web3(rpcUrl);

// Configuration for Vana Moksha Testnet
const chainId = 14800; // Vana Moksha Testnet Chain ID

// Your Metamask Wallet
const sourceAddress = 'MASUKAN ADDRESS EVM DISINI';
const privateKey = 'MASUKAN PRIVATE KEY DISINI';

// Reading destination addresses from wallets.txt
const walletFile = 'wallets.txt';
const destinationAddresses = fs.readFileSync(walletFile, 'utf-8').split('\n').map(addr => addr.trim()).filter(addr => addr);

async function sendVana(destinationAddress) {
    try {
        const nonce = await web3.eth.getTransactionCount(sourceAddress, 'latest');

        // Fetching current gas price and increasing it for faster processing
        const gasPrice = await web3.eth.getGasPrice();
        const increasedGasPrice = web3.utils.toBN(gasPrice).mul(web3.utils.toBN(2)); // 2x the default gas price

        const tx = {
            from: sourceAddress,
            to: destinationAddress,
            value: web3.utils.toWei('0.1', 'ether'), // Adjust the amount as needed
            gas: 21000,
            gasPrice: increasedGasPrice, // Set the increased gas price
            chainId: chainId,
            nonce: nonce,
        };

        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        // Log successful transaction in green
        console.log(chalk.green(`Transaction successful to ${destinationAddress}: ${receipt.transactionHash}`));
    } catch (error) {
        console.error(chalk.red(`Failed to send to ${destinationAddress}: ${error.message}`));
    }
}

async function sendToAll() {
    for (const address of destinationAddresses) {
        console.log(`Sending $VANA to ${address}...`);
        await sendVana(address);
    }
    console.log(chalk.blue('All transactions completed!'));
}

// Execute the function to send to all addresses
sendToAll();
