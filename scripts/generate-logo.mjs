import sharp from "sharp";

// Much larger icon that fills the canvas
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="bg" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#818cf8"/>
      <stop offset="100%" stop-color="#4f46e5"/>
    </radialGradient>
    <linearGradient id="hex" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#a855f7"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="64" fill="url(#bg)"/>
  <g transform="translate(256,256) scale(8.5)">
    <path d="M24 4L44 15.5V38.5L24 50L4 38.5V15.5L24 4Z" fill="url(#hex)" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
    <circle cx="24" cy="24" r="10.5" fill="white" fill-opacity="0.2" stroke="white" stroke-width="1.2"/>
    <line x1="24" y1="24" x2="24" y2="15" stroke="white" stroke-width="2.2" stroke-linecap="round"/>
    <line x1="24" y1="24" x2="30" y2="24" stroke="white" stroke-width="1.8" stroke-linecap="round" opacity="0.85"/>
    <circle cx="24" cy="24" r="1.8" fill="white"/>
  </g>
</svg>`;

await sharp(Buffer.from(svg)).resize(1024, 1024).png().toFile("public/clockhive-logo.png");
console.log("✅ clockhive-logo.png");

await sharp(Buffer.from(svg)).resize(1024, 1024).jpeg({ quality: 95 }).toFile("public/clockhive-logo.jpg");
console.log("✅ clockhive-logo.jpg");

await sharp(Buffer.from(svg)).resize(512, 512).png().toFile("public/clockhive-logo-512.png");
console.log("✅ clockhive-logo-512.png");

await sharp(Buffer.from(svg)).resize(512, 512).jpeg({ quality: 92 }).toFile("public/clockhive-logo-512.jpg");
console.log("✅ clockhive-logo-512.jpg");

await sharp(Buffer.from(svg)).resize(180, 180).png().toFile("public/apple-touch-icon.png");
console.log("✅ apple-touch-icon.png");
