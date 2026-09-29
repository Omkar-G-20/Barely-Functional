// Script to generate PNG icons from SVG using sharp (if available) or a fallback pixel approach
const fs = require('fs');
const path = require('path');

// Minimal valid 192x192 green PNG (1x1 pixel scaled approach using raw PNG)
// We'll write valid SVG-based PNGs using a base64 embedded approach

// Since we can't use canvas easily, write placeholder PNGs that browsers accept
// These are actual valid 1-byte green PNGs, browsers will load them
// For production, replace with proper icons

// Generate using the @resvg/resvg-js if available
try {
  const { Resvg } = require('@resvg/resvg-js');
  const svgContent = fs.readFileSync(path.join('public', 'icon.svg'), 'utf8');
  
  const sizes = [192, 512];
  for (const size of sizes) {
    const resvg = new Resvg(svgContent, {
      fitTo: { mode: 'width', value: size }
    });
    const pngBuffer = resvg.render().asPng();
    fs.writeFileSync(path.join('public', `pwa-${size}.png`), pngBuffer);
    console.log(`Generated pwa-${size}.png`);
  }
} catch (e) {
  console.log('resvg not available, using sharp fallback...');
  try {
    const sharp = require('sharp');
    const svgContent = fs.readFileSync(path.join('public', 'icon.svg'));
    const sizes = [192, 512];
    for (const size of sizes) {
      sharp(svgContent)
        .resize(size, size)
        .png()
        .toFile(path.join('public', `pwa-${size}.png`))
        .then(() => console.log(`Generated pwa-${size}.png with sharp`))
        .catch(err => console.error(`Sharp error for ${size}:`, err));
    }
  } catch (e2) {
    console.log('Neither resvg nor sharp available. Writing embedded SVG PNGs...');
    // Write SVG files as fallback icons (browsers support SVG icons)
    const svgContent = fs.readFileSync(path.join('public', 'icon.svg'), 'utf8');
    fs.copyFileSync(path.join('public', 'icon.svg'), path.join('public', 'pwa-192.svg'));
    fs.copyFileSync(path.join('public', 'icon.svg'), path.join('public', 'pwa-512.svg'));
    
    // Create a minimal valid PNG using raw binary - a solid green 1x1 px base, browsers stretch it
    // This is a real 8x8 green PNG encoded in base64
    const minimalGreenPng = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAYAAABS3GwHAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAADTSURBVHic7cEBDQAAAMKg909tDjchAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeAMBuAABHgAAAABJRU5ErkJggg==',
      'base64'
    );
    fs.writeFileSync(path.join('public', 'pwa-192.png'), minimalGreenPng);
    fs.writeFileSync(path.join('public', 'pwa-512.png'), minimalGreenPng);
    console.log('Created placeholder PNG icons (replace with proper ones for production)');
  }
}
