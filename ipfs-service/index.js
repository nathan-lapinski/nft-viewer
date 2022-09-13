import express from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "./.env") });

// File uploads will be stored in the uploads dir
const upload = multer({ dest: "uploads/" });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TODO: This can be converted to a health check endpoint or removed
app.get("/", (req, res) => {
  return res.send("IPFS Gateway");
});

app.post('/pin', upload.single("file"), async (req, res) => {
  const d = req.file;
  console.log(d);

  console.log("FILE has been received from node. About to send to IPFS...");

  // Once the image file has been received, it is immediately sent to Pinata to be pinned to IPFS
  const data = new FormData();
  data.append("file", fs.createReadStream(d.path));
  data.append("pinataOptions", '{"cidVersion": 1}');
  data.append(
    "pinataMetadata",
    '{"name": "MyFile", "keyvalues": {"company": "Pinata"}}'
  );

  const config = {
    method: "post",
    url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
    headers: {
      Authorization: `Bearer ${process.env.PINATA_TOKEN}`,
      ...data.getHeaders(),
    },
    data: data,
  };

  const resp = await axios(config);
  console.log(resp.data);

  // TODO: Forward IPFS metadata to minting service for minting on blockchain
  // The Content ID (CID) is what uniquely identifies data on IPFS. Currently,
  // this sends only an image, but in future it should send a JSON metadata.s
  const CID = resp.data.IpfsHash;

  if (!CID) {
    return res.send("failed to find CID in IPFS result");
  }

  res.json({cid: CID});
});

// This route uses the Pinata service to write the generated image to IPFS.
app.post("/test_send", upload.single("file"), async (req, res) => {
  const d = req.file;
  console.log(d);

  console.log("FILE has been received from node. About to send to IPFS...");

  // Once the image file has been received, it is immediately sent to Pinata to be pinned to IPFS
  const data = new FormData();
  data.append("file", fs.createReadStream(d.path));
  data.append("pinataOptions", '{"cidVersion": 1}');
  data.append(
    "pinataMetadata",
    '{"name": "MyFile", "keyvalues": {"company": "Pinata"}}'
  );

  const config = {
    method: "post",
    url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
    headers: {
      Authorization: `Bearer ${process.env.PINATA_TOKEN}`,
      ...data.getHeaders(),
    },
    data: data,
  };

  const resp = await axios(config);
  console.log(resp.data);

  // TODO: Forward IPFS metadata to minting service for minting on blockchain
  // The Content ID (CID) is what uniquely identifies data on IPFS. Currently,
  // this sends only an image, but in future it should send a JSON metadata.s
  const CID = resp.data.IpfsHash;

  if (!CID) {
    return res.send("failed to find CID in IPFS result");
  }

  // TODO: Remove hardcoded URL
  // Write the CID of the data to the NFT contract service
  const r = await axios({
    method: "post",
    url: "http://127.0.0.1:4000/mint",
    data: {
      cid: CID,
    },
  });

  console.log(r);

  return res.send(`success`);
});

app.listen(3030, () => {
  console.log("Server running on port 3030");
});
