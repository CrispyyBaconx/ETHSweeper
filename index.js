const { ethers } = require("ethers");
require('dotenv').config();
const path = require("path");
const fs = require('fs');
const provider = new ethers.providers.getDefaultProvider(process.env.NETWORK);
const RECEIVING_WALLET = process.env.SEND_TO;
const AMOUNT_TO_SEND = process.env.AMOUNT_TO_SEND; // has to be in each wallet, or txn will revert
var private_key_array = [];

let txn = {
    to: RECEIVING_WALLET,
    value: ethers.utils.parseEther(AMOUNT_TO_SEND),
    gasLimit: 21000,
    maxFeePerGas: ethers.utils.parseUnits("100", "gwei"), // put gas details here
    maxPriorityFeePerGas: ethers.utils.parseUnits("2.5", "gwei")
}

async function getPrivateKeyArrayFromInput(array) {
    return new Promise(async (resolve, reject) => {
        fs.readdir(path.join(__dirname, 'ListInput'), async function (err, files) {
            if (err) {
                reject(err);
            } else if (files.length != 1) {
                reject('There should be only one file in the directory.');
            }

            fs.readFileSync(path.join(__dirname, 'ListInput', files[0]), 'utf8').split('\n').forEach(function (line) {
                (line != '' && line != '\n') ? array.push(line.replace("\r", "")) : null;
            });

            resolve(array);
        });
    });
}

getPrivateKeyArrayFromInput(private_key_array).then(data => {
    data.forEach(async (key) => {
        await new ethers.Wallet(key, provider).sendTransaction(txn).then(tx => {
            console.log('Transaction sent: ' + tx.hash);
        });
    });
});