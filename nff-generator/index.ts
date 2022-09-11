const { createCanvas } = require("canvas");
const fs = require("fs");
const canvas = createCanvas(200, 200);
const ctx = canvas.getContext("2d");
const axios = require("axios");
import FormData from "form-data";

// Generate a an image with different colored shapes.
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

// Create a local file for storing the image as a jpeg
const imgName = `/images/test_${Date.now()}.jpeg`;
const out = fs.createWriteStream(__dirname + imgName);
// Options were taken from a tutorial - can be modified if needed
const stream = canvas.createJPEGStream({
  quality: 0.95,
  chromaSubsampling: false,
});
stream.pipe(out);
// Once file is written, send it to IPFS upload servce
// TODO: In future, this can be a separate step/endpoint. The user
// can be shown the image first, and then upload to IPFS/Ethereum can
// happen with their permission.
out.on("finish", async () => {
  console.log(`The JPEG file was created.`);

  console.log("sending to IPFS service...");

  const data = new FormData();
  data.append("file", fs.createReadStream(__dirname + imgName));

  // TODO: url needs to come from config.
  const config = {
    method: "post",
    url: "http://127.0.0.1:3000/test_send",
    headers: {
      ...data.getHeaders(),
    },
    data: data,
  };

  const resp = await axios(config);
  console.log(resp.data);
});
