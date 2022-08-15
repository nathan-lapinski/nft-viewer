const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, "../.env") });
const ethers = require('ethers');
const contract = require("../artifacts/contracts/MintNFT.sol/MintNFT.json");
const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.get('/', (req, res) => {
    res.send('success from NFT');
});

app.post('/mint', async (req, res) => {

    console.log(req.body)

    const cid = req.body.cid;

    if (!cid) {
        return res.send('no cid found')
    }

    // TODO: should not store gateway on chain - just CID
    const uri = `https://gateway.pinata.cloud/ipfs/${cid}`;

    console.log('sending to ethereum...')

    // Call mintNFT function
    const mintNFT = async () => {
        let nftTxn = await myNftContract.mintNFT(signer.address, uri)
        await nftTxn.wait()
        console.log(`NFT Minted! Check it out at: https://goerli.etherscan.io/tx/${nftTxn.hash}`)
    }

    const val = await mintNFT()
        // .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
    console.log(val);
    res.send(val)
});

app.listen(4000, () => {
    console.log(`server listening on port ${4000}`);
});

