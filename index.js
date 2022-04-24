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

function getPrivateKeyArrayFromInput(array, callback) {
    const dir_path = path.join(__dirname, 'ListInput');

    fs.readdir(dir_path, function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } else if (files.length != 1) {
            return console.log('There should be only one file in the directory.');
        }

        fs.readFileSync(path.join(dir_path, files[0]), 'utf8').split('\n').forEach(function (line) {
            array.push(line.replace("\r", ""));
        });

        callback(array);
    });
}

getPrivateKeyArrayFromInput(private_key_array, function(data) {
    data.forEach(key => {
        new ethers.Wallet(key, provider).sendTransaction(txn).then(tx => {
            console.log('Transaction sent: ' + tx.hash);
        });
    });
});