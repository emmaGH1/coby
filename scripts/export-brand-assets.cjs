// Reproduce the approved circular C mark without generated-image drift.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require(process.env.COBY_SHARP_PATH || 'sharp');
const out = path.join(__dirname, '..', 'assets');
const paper = '#F2F2F2';
const mark = '<circle cx="32" cy="32" r="28" fill="#4C8DF1"/><path d="M14 30C13 20 20 12 30 13" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>';
function svg(content, inset = 0) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 64 64"><g transform="translate(${inset} ${inset}) scale(${(64 - inset * 2) / 64})">${content}</g></svg>`);
}
async function main() {
  await sharp(svg(mark)).flatten({ background: paper }).png().toFile(path.join(out, 'icon.png'));
  // Foreground fits Android's central safe zone; OS owns the adaptive mask.
  await sharp(svg(mark, 12)).png().toFile(path.join(out, 'android-icon-foreground.png'));
  await sharp({ create: { width: 1024, height: 1024, channels: 4, background: paper } }).png().toFile(path.join(out, 'android-icon-background.png'));
  const mono = '<path d="M46 16A23 23 0 1 0 46 48" fill="none" stroke="#000" stroke-width="10" stroke-linecap="round"/>';
  await sharp(svg(mono, 12)).png().toFile(path.join(out, 'android-icon-monochrome.png'));
  await sharp(svg(mark)).png().toFile(path.join(out, 'splash-icon.png'));
  await sharp(svg(mark)).resize(64, 64).png().toFile(path.join(out, 'favicon.png'));
  console.log('Exported approved C mark: icon, adaptive layers, monochrome, splash and favicon.');
}
main().catch((error) => { console.error(error.message); process.exitCode = 1; });
