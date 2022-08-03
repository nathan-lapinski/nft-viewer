const { createCanvas} = require('canvas')
const fs = require('fs');
const canvas = createCanvas(200, 200)
const ctx = canvas.getContext('2d')

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

const out = fs.createWriteStream(__dirname + `/images/test_${Date.now()}.jpeg`)
const stream = canvas.createJPEGStream({
    quality: 0.95,
    chromaSubsampling: false
  })
stream.pipe(out)
out.on('finish', () =>  console.log('The JPEG file was created.'))

