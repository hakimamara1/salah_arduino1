const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const TARGET_DIR = path.join(__dirname, '..', 'public', 'images');

async function compressImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
    return;
  }

  const isInclude = filePath.includes(path.sep + 'include' + path.sep);
  const maxDimension = isInclude ? 600 : 800;

  const statBefore = fs.statSync(filePath);
  const sizeBeforeMb = statBefore.size / (1024 * 1024);

  // If the file is already under 120KB, we can skip it to prevent quality degradation
  if (sizeBeforeMb < 0.12) {
    return;
  }

  const relativePath = path.relative(TARGET_DIR, filePath);
  console.log(`Processing: ${relativePath} (Current: ${sizeBeforeMb.toFixed(2)} MB)`);

  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();

    let pipeline = sharp(filePath);
    if (metadata.width > maxDimension || metadata.height > maxDimension) {
      pipeline = pipeline.resize(maxDimension, maxDimension, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }

    if (ext === '.jpg' || ext === '.jpeg') {
      pipeline = pipeline.jpeg({ quality: 80, progressive: true });
    } else if (ext === '.png') {
      pipeline = pipeline.png({ quality: 80, compressionLevel: 9 });
    }

    const buffer = await pipeline.toBuffer();
    fs.writeFileSync(filePath, buffer);

    const statAfter = fs.statSync(filePath);
    const sizeAfterMb = statAfter.size / (1024 * 1024);
    const savingPercent = ((sizeBeforeMb - sizeAfterMb) / sizeBeforeMb * 100).toFixed(1);
    console.log(`  └─ Done: ${sizeAfterMb.toFixed(3)} MB (Saved ${savingPercent}%)`);
  } catch (e) {
    console.error(`  └─ Failed processing ${relativePath}:`, e.message);
  }
}

function scanDirectory(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(scanDirectory(fullPath));
    } else {
      results.push(fullPath);
    }
  });
  return results;
}

async function run() {
  console.log('--- STARTING IMAGE COMPRESSION ---');
  if (!fs.existsSync(TARGET_DIR)) {
    console.error(`Directory not found: ${TARGET_DIR}`);
    return;
  }

  const files = scanDirectory(TARGET_DIR);
  for (const file of files) {
    await compressImage(file);
  }
  console.log('--- IMAGE COMPRESSION COMPLETED ---');
}

run();
