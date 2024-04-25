# Gassed Up

A sCrypt Hackathon 2024 project submission.

We decided to participate in the sCrypt hackathon
to learn about bitcoin's script capabilities
using the sCrypt Smart Contract library.

For the project scope, we sought to port the existing process of buying gasoline to bitcoin.

The current process consists of:

1. a user arriving at a gas station gas pump
1. a user swiping a credit card and getting pre-charged for $200 (which covers the cost of filling up)
1. a user pumping gas; selecting an octane, pumping the gas, and hanging up the nozzle
1. the gas station gas pump reverting the pre-charge amount
1. the gas station gas pump charging the credit card for the actual amount of gas purchased.

---

### User Scenario

This scenario (or business process) involves two actors:

1. Buyer - the person who's going to be buying gas
1. Gas Pump - a single gas pump at a gas station

### Getting this project running

1. clone this repo
1. ensure Node 16+ is installed
1. run `npm i` from the root of the directory to install the project's dependencies
1. ensure Yours Wallet is installed in your browser (set it to testnet mode)
1. ensure Sensilet Wallet is installed in your browser (set it to testnet mode too)
1. export your testnet Sensilet Wallet private key and copy it into `getPubKey.js`
  * then run `npm getPubKey.js` to get a public key (this key will be used as the Public Key for the Gas Pump)
  * copy the Public Key into the `/src/contracs/GassedUp.ts` Smart Contract
  * run `npx scrypt-cli compile` to compile the smart contract into the `/artifacts` directory
1. Finally, run `npm start` to start a web server serving a React App that will use the GassedUp bitcoin smart contract

The app should now be running at http://localhost:3000.

### Running through the scenario

With the app running at http://localhost:3000 and both Yours and Sensilet Wallets running in the browser (and both in `testnet` mode):

> tip: to fund the wallets for testing, visit https://scrypt.io/faucet

You'll see something like:

![screenshot](/public/gassed-up-screenshot.png)

1. click "bitcoin" to buy some gas; this will open a modal window
1. select 100, 200, or enter a number of satoshis to buy gas
  * this will open the Buyer's Yours Wallet and prompt the user to sign the transaction
  * after clicking 'sign transaction', an alert message will be displayed showing the txid of the deployed contract
1. select an octane of gas
1. click 'Start' to start pumping gas, and click 'Stop' when done pumping
1. click 'Complete' to finalize the transaction and get your change
1. Done! You're all gassed up!
