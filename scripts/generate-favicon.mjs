import sharp from "sharp";
import fs from "fs";
import path from "path";

const publicDir = path.join(process.cwd(), "public");
const appDir = path.join(process.cwd(), "app");

async function createFavicon() {
  const sizes = [16, 32, 48, 64];
  const pngBuffers = [];

  for (const size of sizes) {
    const rgbaPng = await sharp(path.join(publicDir, "logo.gif"))
      .resize(size, size, { fit: "contain", background: { r: 9, g: 9, b: 9, alpha: 0 } })
      .ensureAlpha()
      .png()
      .toBuffer();
    
    const info = await sharp(rgbaPng).metadata();
    console.log(`Size ${size}: channels=${info.channels}, hasAlpha=${info.hasAlpha}`);
    
    pngBuffers.push({ size, buffer: rgbaPng });
  }

  const numImages = pngBuffers.length;
  const headerSize = 6;
  const directoryEntrySize = 16;
  const totalSize = headerSize + directoryEntrySize * numImages;

  const ico = Buffer.alloc(totalSize);

  ico.writeUInt16LE(0, 0);
  ico.writeUInt16LE(1, 2);
  ico.writeUInt16LE(numImages, 4);

  let offset = totalSize;

  for (let i = 0; i < numImages; i++) {
    const { size, buffer } = pngBuffers[i];
    const entryOffset = headerSize + i * directoryEntrySize;

    ico.writeUInt8(size === 256 ? 0 : size, entryOffset);
    ico.writeUInt8(size === 256 ? 0 : size, entryOffset + 1);
    ico.writeUInt8(0, entryOffset + 2);
    ico.writeUInt8(0, entryOffset + 3);
    ico.writeUInt16LE(1, entryOffset + 4);
    ico.writeUInt16LE(32, entryOffset + 6);
    ico.writeUInt32LE(buffer.length, entryOffset + 8);
    ico.writeUInt32LE(offset, entryOffset + 12);

    offset += buffer.length;
  }

  const finalIco = Buffer.concat([ico, ...pngBuffers.map(p => p.buffer)]);

  fs.writeFileSync(path.join(publicDir, "favicon.ico"), finalIco);
  fs.writeFileSync(path.join(appDir, "favicon.ico"), finalIco);
  console.log("Created favicon.ico with sizes:", sizes.join(", "));
}

createFavicon().catch(console.error);
