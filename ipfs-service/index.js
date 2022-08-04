//const express = require('express');
import express from 'express';
// const ipfsClient = require('ipfs-http-client');
import { create } from 'ipfs-http-client'


const ipfs = create();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    return res.send('IPFS Gateway');
});

app.post('/image_upload', async (req, res) => {
    const data = req.body;
    console.log(data);
    return res.send('success')
});

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
    // return filesAdded[0].hash;
}

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
