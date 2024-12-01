require('dotenv').config();
const { ethers } = require('ethers');
const WalletContract = require('../abis/WalletContract.json')
const KYCRegistryContract = require('../abis/KYCRegistryV32.json')
const { saveTxDataForWallet } = require("./wallet");
const Verifier = require('../models/verifierAddress');
const { where } = require('../models/userModel');
const Approved = require('../models/approvedModel');
const User = require('../models/userModel');


const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
// Smart contract ABI and address
const WalletContractAddress = "0x7aA6bD0045769E57A793a4C4f270901E4fdd70A9"
const KYCRegistryContractAddress = "0x426E7b96f39f503aDFa6823CDC0D42D8bEA096E8"

const addVerifier = async (verifierAddress) => {
    try {
        // intercat with the deployed contract
        const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        const contract = new ethers.Contract(KYCRegistryContractAddress, KYCRegistryContract.abi, signer);

        console.log(verifierAddress)

        // Send the transaction to store shard3 on the blockchain
        const tx = await contract.addVerifier(verifierAddress, {
            gasPrice: 0
        });
        await tx.wait();

        if (tx !== null) {
            await saveTxDataForWallet(tx, 0, `Verifier added ${verifierAddress}`);

            const phoneNumber = await Approved.findOne({ walletAddress: verifierAddress }, 'phoneNumber');
            const orgName = await User.findOne({ phoneNumber: phoneNumber.phoneNumber }, 'fullName');

            const verifier = new Verifier({
                orgName: orgName.fullName,
                address: verifierAddress,
                isActivated: true,
                hash: tx.hash,
                addedOn: Date.now()
            });

            await verifier.save();

            return {
                status: true,
                message: "Verifier added successfully"
            }
        }
    } catch (error) {
        console.log(error);
    }
}

const removeVerifier = async (verifierAddress) => {
    try {
        // intercat with the deployed contract
        const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        const contract = new ethers.Contract(KYCRegistryContractAddress, KYCRegistryContract.abi, signer);

        // Send the transaction to store shard3 on the blockchain
        const tx = await contract.disableVerifier(verifierAddress, {
            gasPrice: 0
        });
        await tx.wait();

        if (tx !== null) {
            await saveTxDataForWallet(tx, 0, `Verifier removed ${verifierAddress}`);
            await Verifier.updateOne({ address: verifierAddress }, { isActivated: false, hash: tx.hash });
            return {
                status: true,
                message: "Verifier added successfully"
            }
        }
    } catch (error) {
        console.log(error);
    }
}

const getAllVerifierList = async () => {
    try {
        const verifierList = await Verifier.find({ isActivated: true });
        return verifierList;
    } catch (error) {
        return error;
    }
}

module.exports = {
    addVerifier, removeVerifier, getAllVerifierList
}