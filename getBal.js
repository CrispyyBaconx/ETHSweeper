const { ethers } = require("ethers");
require('dotenv').config();
const provider = new ethers.providers.getDefaultProvider(process.env.NETWORK);
const RECEIVING_WALLET = process.env.SEND_TO;

provider.getBalance(RECEIVING_WALLET).then((balance) => {
    // convert a currency unit from wei to ether
    const balanceInEth = ethers.utils.formatEther(balance)
    console.log(`balance: ${balanceInEth} ETH`)
})