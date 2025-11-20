import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicDir = join(__dirname, '..', 'public');
const slipsDir = join(publicDir, 'slips');
const optimizedDir = join(publicDir, 'optimized');

// Create optimized directory if it doesn't exist
if (!existsSync(optimizedDir)) {
  await mkdir(optimizedDir, { recursive: true });
}

const optimizedSlipsDir = join(optimizedDir, 'slips');
if (!existsSync(optimizedSlipsDir)) {
  await mkdir(optimizedSlipsDir, { recursive: true });
}

async function optimizeImage(inputPath, outputBasePath, maxSizeKB = 100) {
  const filename = inputPath.split('/').pop().replace(/\.(jpg|jpeg|png|JPG|PNG|JPEG)$/i, '');
  
  console.log(`Optimizing ${filename}...`);
  
  try {
    // Get image metadata
    const metadata = await sharp(inputPath).metadata();
    
    // Generate WebP version (optimized)
    await sharp(inputPath)
      .resize(800, null, { // Resize to max width 800px, maintain aspect ratio
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality: 80 })
      .toFile(`${outputBasePath}/${filename}.webp`);
    
    // Generate JPEG fallback (compressed)
    await sharp(inputPath)
      .resize(800, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .jpeg({ quality: 75, progressive: true })
      .toFile(`${outputBasePath}/${filename}.jpg`);
    
    // Generate smaller versions for responsive images
    await sharp(inputPath)
      .resize(400, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality: 80 })
      .toFile(`${outputBasePath}/${filename}-small.webp`);
    
    await sharp(inputPath)
      .resize(400, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .jpeg({ quality: 75, progressive: true })
      .toFile(`${outputBasePath}/${filename}-small.jpg`);
    
    console.log(`✓ ${filename} optimized`);
  } catch (error) {
    console.error(`Error optimizing ${filename}:`, error.message);
  }
}

async function optimizeLogo() {
  const logoPath = join(publicDir, 'wizjock-logo.png');
  
  if (!existsSync(logoPath)) {
    console.log('Logo not found, skipping...');
    return;
  }
  
  console.log('Optimizing logo...');
  
  try {
    // Generate WebP version
    await sharp(logoPath)
      .resize(200, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality: 90 })
      .toFile(join(optimizedDir, 'wizjock-logo.webp'));
    
    // Generate PNG fallback (compressed)
    await sharp(logoPath)
      .resize(200, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(join(optimizedDir, 'wizjock-logo.png'));
    
    console.log('✓ Logo optimized');
  } catch (error) {
    console.error('Error optimizing logo:', error.message);
  }
}

async function main() {
  console.log('Starting image optimization...\n');
  
  // Optimize logo
  await optimizeLogo();
  
  // Optimize slip images
  const slipFiles = await readdir(slipsDir);
  const imageFiles = slipFiles.filter(file => 
    /\.(jpg|jpeg|png|JPG|PNG|JPEG)$/i.test(file) && !file.startsWith('.')
  );
  
  console.log(`\nFound ${imageFiles.length} slip images to optimize\n`);
  
  for (const file of imageFiles) {
    await optimizeImage(join(slipsDir, file), optimizedSlipsDir);
  }
  
  console.log('\n✓ All images optimized!');
  console.log(`\nOptimized images saved to: ${optimizedDir}`);
}

main().catch(console.error);
