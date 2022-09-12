const { createCanvas } = require("canvas");
const fs = require("fs");
const canvas = createCanvas(200, 200);
const ctx = canvas.getContext("2d");
const axios = require("axios");
const FormData = require("form-data");
const cors = require('cors');
const express = require("express");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json('hello from image gen service')
});

app.get("/generate", async (req, res) => {
  // Generate an image by drawing some shapes on a Canvas
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      ctx.beginPath();
      const x = 25 + j * 50; // x coordinate
      const y = 25 + i * 50; // y coordinate
      const radius = 20; // Arc radius
      const startAngle = 0; // Starting point on circle
      const endAngle = Math.PI + (Math.PI * j) / 2; // End point on circle
      const counterclockwise = i % 2 !== 0; // clockwise or counterclockwise

      ctx.arc(x, y, radius, startAngle, endAngle, counterclockwise);

      if (i > 1) {
        const rando = Math.floor(Math.random() * 16777215).toString(16);
        ctx.fillStyle = `#${rando}`;
        ctx.fill();
      } else {
        ctx.stroke();
      }
    }
  }

  // Convert the canvas to a JPEG and store it in a local file
  const imgName = `/images/test_${Date.now()}.jpeg`;
  const out = fs.createWriteStream(__dirname + imgName);
  const stream = canvas.createJPEGStream({
    quality: 0.95,
    chromaSubsampling: false,
  });
  stream.pipe(out);

  out.on("finish", async () => {
    const dataUrl = canvas.toDataURL();
    res.json({url: dataUrl, imgId: imgName});
  });
});

app.post('/pin', async (req, res) => {
  const id = req.body.imgId;

  if (!id) {
    res.send('Error: missing image id');
    return;
  }

  console.log("sending to IPFS service...");

  const data = new FormData();
  data.append("file", fs.createReadStream(__dirname + id));

  // TODO: Remove hardcoded URL
  const config = {
    method: "post",
    url: "http://127.0.0.1:3030/pin",
    headers: {
      ...data.getHeaders(),
    },
    data: data,
  };

  let resp;
  try {
    resp = await axios(config);
  } catch (err) {
    console.log(err);
  }
  console.log(resp.data);
  res.json(resp.data);
});

app.post('/mint', async (req, res) => {
  const id = req.body.imgId;

  if (!id) {
    res.send('Error: missing image id');
    return;
  }

  console.log("sending to IPFS service...");

  const data = new FormData();
  data.append("file", fs.createReadStream(__dirname + id));

  console.log(data);

  // TODO: Remove hardcoded URL
  const config = {
    method: "post",
    url: "http://127.0.0.1:3000/test_send",
    headers: {
      ...data.getHeaders(),
    },
    data: data,
  };

  let resp;
  try {
    resp = await axios(config);
  } catch (err) {
    console.log(err);
  }
  console.log(resp.data);
  res.send('success')
});

app.listen(4009, () => {
  console.log(`server listening on port ${4009}`);
});