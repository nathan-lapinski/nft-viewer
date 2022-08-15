const { createCanvas} = require('canvas')
const fs = require('fs');
const canvas = createCanvas(200, 200)
const ctx = canvas.getContext('2d')
const axios = require('axios')
const FormData = require('form-data');


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
        const rando = Math.floor(Math.random()*16777215).toString(16);
        ctx.fillStyle = `#${rando}`;
        ctx.fill();
      } else {
        ctx.stroke();
      }
    }
  }

// console.log('<img src="' + canvas.toDataURL() + '" />')

const imgName = `/images/test_${Date.now()}.jpeg`;

const out = fs.createWriteStream(__dirname + imgName)
const stream = canvas.createJPEGStream({
    quality: 0.95,
    chromaSubsampling: false
  })
stream.pipe(out)
out.on('finish', async () =>  {
  console.log('The JPEG file was created.');

  console.log('sending to IPFS service...');

  const data = new FormData();
  data.append('file', fs.createReadStream(__dirname + imgName));

  const config = {
      method: 'post',
      url: 'http://127.0.0.1:3000/test_send',
      headers: { 
          ...data.getHeaders()
      },
      data : data
  };

  const resp = await axios(config);
  console.log(resp.data);
});

