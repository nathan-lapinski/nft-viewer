import express from 'express';
import { create } from 'ipfs-http-client'

import multer from "multer";

import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "./.env") });


const upload = multer({ dest: "uploads/" });

const ipfs = create();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    return res.send('IPFS Gateway');
});

app.post("/image_upload", upload.single("file"), uploadFiles);

function uploadFiles(req, res) {
    console.log(req.body);
    console.log(req.file);
    res.json({ message: "Successfully uploaded file" });
}

app.post("/image_ipfs", upload.single("file"), uploadFileToIPFS);

async function uploadFileToIPFS(req, res) {
    const file = { path: 'strangelove', content: Buffer.from(JSON.stringify(req.file))};
    const fileHash = await ipfs.add(file);
    console.log(fileHash);
    return res.send(`https://gateway.ipfs.io/ipfs/${ fileHash }`);
}

app.post('/upload', async (req, res) => {
    const data = req.body;
    console.log(data);
    const fileHash = await addFile(data);
    return res.send(`https://gateway.ipfs.io/ipfs/${ fileHash }`);
});

const addFile = async ({ path, content }) => {
    const file = { path: path, content: Buffer.from(content) };
    console.log(`About to add file ${file}`)
    const filesAdded = await ipfs.add(file);
    console.log(filesAdded);
    return filesAdded;
}

app.post('/pinata_upload', async (req, res) => {
    const data = new FormData();
    data.append('file', fs.createReadStream('./files/test_123.jpeg'));
    data.append('pinataOptions', '{"cidVersion": 1}');
    data.append('pinataMetadata', '{"name": "MyFile", "keyvalues": {"company": "Pinata"}}');

    const config = {
        method: 'post',
        url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
        headers: { 
            'Authorization': `Bearer ${process.env.PINATA_TOKEN}`, 
            ...data.getHeaders()
        },
        data : data
    };

    const resp = await axios(config);
    console.log(resp.data);
    return res.send('hi');
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
