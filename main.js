const Web3 = require('web3');
const axios = require('axios');
const fs = require('fs');
const chalk = require('chalk');

process.removeAllListeners('warning');

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
     📢  Telegram Channel: https://t.me/AirdropInsiderID
    `);
    console.log("==================================================");
}

// Print banner at the start
printBanner();

// Configuration
const RPC = 'https://rpc.moksha.vana.org';
const web3 = new Web3(new Web3.providers.HttpProvider(RPC));
const PRIVATE_KEYS_FILE = 'pk.txt';
const ROUTER_ADDRESS = '0xCFd016891E654869BfEd5D9E9bb76559dF593dbc';
const ROUTER_ABI = [
    {
        "name": "addFile",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
        "inputs": [
            { "internalType": "string", "name": "url", "type": "string" },
            { "internalType": "string", "name": "encryptedKey", "type": "string" }
        ]
    }
];

// Helper to read private keys from file
function readPrivateKeys(file) {
    return fs.readFileSync(file, 'utf8')
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
            const privateKey = line.trim();
            return { privateKey };
        });
}

// Function to get a message for the address
async function getMessage(address) {
    try {
        const response = await axios.post('https://api.datapig.xyz/api/get-message', { address });
        return response.data.message;
    } catch (error) {
        console.error('Error getting message:', error.response?.data || error.message);
    }
}

// Function to sign a message
async function signMessage(privateKey, message) {
    try {
        const account = web3.eth.accounts.privateKeyToAccount(privateKey);
        const signature = account.sign(message);
        return { signature: signature.signature, address: account.address };
    } catch (error) {
        console.error('Error signing message:', error.message);
    }
}

// Function to login
async function login(address, message, signature) {
    try {
        const response = await axios.post('https://api.datapig.xyz/api/login', { signature, address, message });
        return response.data.token;
    } catch (error) {
        console.error('Error logging in:', error.response?.data || error.message);
    }
}

// Function to get tokens
async function getTokens(token) {
    try {
        const response = await axios.get('https://api.datapig.xyz/api/tokens', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Error getting tokens:', error.response?.data || error.message);
    }
}

// Function to generate analysis
async function generateAnalysis(token, address, preferences, signature) {
    const refCode = "7qm3wa"; // Use fixed refCode

    try {
        const response = await axios.post(
            'https://api.datapig.xyz/api/submit',
            { address, preferences, signature, refCode },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error) {
        if (error.response?.status === 429) {
            console.log('Daily Limit Reached. Moving to the next wallet.');
            return null;
        }
        console.error('Error generating analysis:', error.response?.data || error.message);
    }
}

// Function to confirm the transaction hash
async function confirmHash(token, address, confirmedTxHash) {
    try {
        const response = await axios.post(
            'https://api.datapig.xyz/api/invitedcode',
            { address, confirmedTxHash },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error) {
        console.error('Error confirming transaction hash:', error.response?.data || error.message);
    }
}

// Function to mint file (with retry mechanism)
async function mintFile(privateKey, url, encryptedKey, retries = 3) {
    try {
        const account = web3.eth.accounts.privateKeyToAccount(privateKey);
        const contract = new web3.eth.Contract(ROUTER_ABI, ROUTER_ADDRESS);

        // Prepare the full IPFS URL
        const fullUrl = `ipfs://${url}`;

        // Estimate gas for the addFile method
        const gasEstimate = await contract.methods.addFile(fullUrl, encryptedKey).estimateGas({ from: account.address });

        // Get the current gas price
        const gasPrice = await web3.eth.getGasPrice();

        // Create transaction data
        const data = contract.methods.addFile(fullUrl, encryptedKey).encodeABI();
        const transaction = {
            to: ROUTER_ADDRESS,
            data,
            gas: gasEstimate,
            gasPrice: gasPrice, // Include the current gas price
        };

        // Sign the transaction
        const signedTransaction = await web3.eth.accounts.signTransaction(transaction, privateKey);

        // Send the signed transaction
        const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
        console.log('Mintfile transaction successful: Transaction Hash:', receipt.transactionHash);

        // Return the transaction hash for confirmation
        return receipt.transactionHash;
    } catch (error) {
        console.error(`Error in mintFile (Attempt ${4 - retries}):`, error.message);

        // Retry if we have remaining attempts
        if (retries > 1) {
            console.log(`Retrying in 1 minute...`);
            await new Promise(resolve => setTimeout(resolve, 60000)); // Wait for 1 minute before retrying
            return mintFile(privateKey, url, encryptedKey, retries - 1); // Retry with reduced retries
        } else {
            console.error('All retry attempts failed.');
            throw new Error('Failed to mint file after 3 attempts');
        }
    }
}

// Generate random preferences
function generateRandomPreferences(tokens) {
    const categories = [
        'Layer 1', 'Governance', 'Launch Pad', 'GameFi & Metaverse',
        'NFT & Collectibles', 'Layer 2 & Scaling', 'Infrastructure',
        'Meme & Social', 'DeFi', 'DePIN', 'Others', 'AI', 'Liquid Staking', 'RWA', 'Murad Picks'
    ];
    const randomCategories = categories.sort(() => 0.5 - Math.random()).slice(0, 3);

    // Filter tokens that match the random categories
    const matchedTokens = tokens.filter(token => 
        token.categories.some(category => randomCategories.includes(category))
    );

    // Select 13 or 14 distinct tokens randomly from matched tokens
    const selectedTokens = matchedTokens
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.random() < 0.5 ? 13 : 14);

    // Create likes payload with true/false for selected tokens
    const likes = selectedTokens.reduce((acc, token) => {
        acc[token.id] = Math.random() < 0.5; // Random true/false
        return acc;
    }, {});

    return { categories: randomCategories, likes };
}

// Main execution
async function mainExecution() {
    const privateKeyData = readPrivateKeys(PRIVATE_KEYS_FILE);

    for (const { privateKey } of privateKeyData) {
        const account = web3.eth.accounts.privateKeyToAccount(privateKey);
        const address = account.address;

        console.log(chalk.cyan(`Using address: ${address}`));

        for (let loopCount = 0; loopCount < 5; loopCount++) {
            console.log(chalk.yellow(`Starting loop ${loopCount + 1} of 5 for wallet ${address}`));

            try {
                const message = await getMessage(address);
                if (!message) {
                    console.log(chalk.red('Error: No message received. Moving to next wallet.'));
                    break;
                }

                const { signature } = await signMessage(privateKey, message);
                if (!signature) {
                    console.log(chalk.red('Error: No signature generated. Moving to next wallet.'));
                    break;
                }

                const token = await login(address, message, signature);
                if (!token) {
                    console.log(chalk.red('Error: Login failed. Moving to next wallet.'));
                    break;
                }

                const tokens = await getTokens(token);
                if (!tokens) {
                    console.log(chalk.red('Error: No tokens received. Moving to next wallet.'));
                    break;
                }

                const preferences = generateRandomPreferences(tokens);
                const additionalMessage = "Please sign to retrieve your VANA encryption key";
                const { signature: analysisSignature } = await signMessage(privateKey, additionalMessage);

                if (!analysisSignature) {
                    console.log(chalk.red('Error: No analysis signature generated. Moving to next wallet.'));
                    break;
                }

                const analysis = await generateAnalysis(token, address, preferences, analysisSignature);
                if (!analysis) {
                    break;
                }

                const { ipfs_hash: url, encryptedKey } = analysis;
                const txHash = await mintFile(privateKey, url, encryptedKey);

                const confirmedHashResponse = await confirmHash(token, address, txHash);
                console.log(chalk.green('Confirmed transaction hash: '), confirmedHashResponse);

            } catch (error) {
                console.error(chalk.red(`Error in loop ${loopCount + 1}:`), chalk.red(error.message));
                break;
            }
        }

        console.log(chalk.cyan(`Completed 5 loops for wallet ${address}. Moving to the next wallet.`));
        console.log(chalk.magenta('--- End of wallet process ---\n'));
    }
    console.log(chalk.magenta('--- Wait for next 24 hours... ---\n'));
}

setInterval(mainExecution, 86400000);
mainExecution();
