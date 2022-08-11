const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, "../.env") });
const ethers = require('ethers');
const contract = require("../artifacts/contracts/MintNFT.sol/MintNFT.json");

// Get Alchemy API Key
const API_KEY = process.env.API_KEY;

// Define an Alchemy Provider
const provider = new ethers.providers.AlchemyProvider('goerli', API_KEY);

// Create a signer
const privateKey = process.env.PRIVATE_KEY
const signer = new ethers.Wallet(privateKey, provider)

// Get contract ABI and address
const abi = contract.abi
const contractAddress = '0x0A3101077F080cF9FEDdf88dd94D14C5Ab7E50d3'

// Create a contract instance
const myNftContract = new ethers.Contract(contractAddress, abi, signer)

const tokenUri = 'https://gateway.pinata.cloud/ipfs/QmQ5pt4GTqzwXRKniwsdJc1RM3cTkG5tyVcXzsuwZ1USWi';

// Call mintNFT function
const mintNFT = async () => {
    let nftTxn = await myNftContract.mintNFT(signer.address, tokenUri)
    await nftTxn.wait()
    console.log(`NFT Minted! Check it out at: https://goerli.etherscan.io/tx/${nftTxn.hash}`)
}

mintNFT()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });