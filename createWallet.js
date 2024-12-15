const fs = require('fs');
const { ethers } = require('ethers');
const readline = require('readline');

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
                Auto Create New Wallet               
     📢  Telegram Channel: https://t.me/airdroplocked
    `);
    console.log("==================================================");
}

// Setup readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Fungsi untuk membuat wallet MetaMask baru
function createWallet() {
    const wallet = ethers.Wallet.createRandom();
    
    // Alamat wallet dan private key
    const address = wallet.address;
    const privateKey = wallet.privateKey;
    
    // Menyimpan alamat ke WalletAdd.txt
    fs.appendFileSync('WalletAdd.txt', address + '\n', 'utf8');
    
    // Menyimpan private key ke walletPK.txt
    fs.appendFileSync('walletPK.txt', privateKey + '\n', 'utf8');
    
    console.log('Wallet Created:');
    console.log('Address:', address);
    console.log('Private Key:', privateKey);
}

// Fungsi untuk meminta jumlah wallet
function askForWalletCount() {
    rl.question('Berapa jumlah wallet yang mau dibuat? ', (count) => {
        const numWallets = parseInt(count);
        
        if (isNaN(numWallets) || numWallets <= 0) {
            console.log('Masukkan angka yang valid!');
            askForWalletCount(); // Meminta input lagi jika tidak valid
        } else {
            // Membuat wallet sesuai dengan jumlah yang diminta
            for (let i = 0; i < numWallets; i++) {
                createWallet();
            }
            console.log(`\nTotal ${numWallets} wallet berhasil dibuat.`);
            rl.close(); // Menutup input setelah selesai
        }
    });
}

// Menampilkan Banner dan memulai program
printBanner();
askForWalletCount();
