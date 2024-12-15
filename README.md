# DataPig888 Bot

Welcome to the official **Airdrop 888** repository! 🐷🚀  
This bot simplifies your interactions with the **DataPig - Airdrop** platform, automating wallet handling, task execution, and blockchain minting with ease.

---

## 🔗 **Join DataPig888 Now**
👉 Get started here: https://app.datapig.xyz?ref=7qm3wa 
Use the referral link above to unlock exclusive rewards! 🎉

---

## 🎯 **Key Features**

- **Auto Create New Wallet Address & PrivateKey Within**  
  Create Multiply wallet EVM Address

- **Auto Sender $VANA Token**  
  Send your $VANA to other wallet with easily  

- **Efficient Wallet Automation**  
  Handle multiple wallets effortlessly by automating task submissions, preferences, and signature creation.

- **Daily Task Management**  
  Automatically skips wallets that have hit the daily task limit, saving time and effort.

- **Retry Mechanism**  
  Enhances reliability by retrying failed submissions up to three times.

- **Blockchain Integration**  
  Supports minting files and validating tasks directly on the blockchain.

- **Scheduled Automation**  
  Executes tasks every 24 hours without requiring manual input.

- **Detailed Logging**  
  Comprehensive logs for tracking activities and debugging issues.

---

## 🛠 **System Requirements**

Before starting, ensure your system meets the following requirements:

1. **Node.js**: Version 16 or higher.
2. **npm**: Installed for managing dependencies.
3. **Private Keys**: Securely store your wallet private keys in a `pk.txt` file (see Setup section).
4. **Referral Code**: Optional but recommended for additional rewards.

---

## ⚙️ **Installation**

### Step 1: Clone the Repository
```bash
git clone https://github.com/marioatmajanugraha/DataPig888.git
cd DataPig888
```

### Step 2: Configure Wallet Private Keys
Create a `pk.txt` file in the root directory and add private keys for your wallets, one per line.  

Example:
```plaintext
0xabcdef1234567890...
0x123456abcdef7890...
```

### Step 3: Install Dependencies
Run the following command to install all required dependencies:
```bash
npm install
```

---
## ▶️ **How to Run the Bot to Create Wallet**

To create Wallet the bot, execute the following command:
```bash
node createWallet.js
```

## ▶️ **How to Run the Bot to Send $VANA Token**

To start the bot, execute the following command:
```bash
node VanaSender.js
```

## ▶️ **How to Run the Bot**

To start the bot, execute the following command:
```bash
node main.js
```

### The bot will:

1. Create New Wallet EVM Address 
2. Auto Send Token $VANA
3. Read wallet keys from the `pk.txt` file.
4. Process daily tasks by signing and submitting messages to the platform.
5. Skip wallets that reach the daily task limit.
6. Retry any failed submissions up to three times.
7. Automatically repeat this process every 24 hours.

---

## 💡 **How It Works**

1. **Input Wallets**: Reads private keys from the `pk.txt` file.
2. **Task Execution**: Submits tasks, signs messages, and validates completions.
3. **Error Handling**: Retries failed transactions up to three times for better reliability.
4. **Minting Files**: Successfully completed tasks are minted directly on the blockchain.
5. **Logging**: Keeps detailed logs of all actions for transparency and debugging.

---

## 🔐 **Security Tips**

1. **Protect Your Private Keys**: Do not share your `pk.txt` file. Store it securely.
2. **Use Trusted Systems**: Only run the bot on secure and trusted devices.
3. **Stay Updated**: Regularly update the bot to access new features and security patches.

---

## 📝 **Customization**

To customize the bot:

1. Fork this repository.
2. Edit the code to add new features or modify existing ones.
3. Submit a pull request to share your updates with the community.

---

## 🤝 **Contributing**

We welcome contributions from the community!  
Follow these steps to contribute:

1. Fork this repository.
2. Create a branch for your feature or bug fix.
3. Commit your changes and submit a pull request.
4. Ensure your code is well-documented and thoroughly tested.

---

## 📩 **Support**

For any questions or issues, feel free to contact us:

- **Telegram**: t.me/airdroplocked

---

## 📜 **License**

This project is licensed under the MIT License.  
Refer to the LICENSE file for more details.

---

## 🌟 **Show Your Support**

If you find this project helpful, please give it a ⭐ on GitHub!  
Your support helps others discover this tool and motivates us to improve it further.

Happy Botting with **DataPig888**! 🎉
