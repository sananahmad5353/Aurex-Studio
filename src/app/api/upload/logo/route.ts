import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { requireAdmin } from '@/lib/admin-auth';
import { NextRequest, NextResponse } from 'next/server';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

const SIZES = [
  { name: 'logo', width: 200, height: 200, fit: 'contain' as const, bg: '{ r: 0, g: 0, b: 0, alpha: 0 }' },
  { name: 'logo-lg', width: 400, height: 400, fit: 'contain' as const, bg: '{ r: 0, g: 0, b: 0, alpha: 0 }' },
  { name: 'favicon', width: 32, height: 32, fit: 'contain' as const, bg: '{ r: 0, g: 0, b: 0, alpha: 0 }' },
  { name: 'og-image', width: 1200, height: 630, fit: 'cover' as const, bg: '{ r: 255, g: 255, b: 255, alpha: 1 }' },
];

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  try {
    const formData = await request.formData();
    const file = formData.get('logo') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml', 'image/gif', 'image/bmp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Use PNG, JPG, WebP, SVG, GIF, or BMP.' }, { status: 400 });
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum 10MB.' }, { status: 400 });
    }

    await mkdir(UPLOAD_DIR, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const results: Record<string, string> = {};

    for (const size of SIZES) {
      try {
        const outputPath = path.join(UPLOAD_DIR, `${size.name}.webp`);

        let pipeline = sharp(buffer);

        // Get metadata to detect if image has transparency
        const metadata = await sharp(buffer).metadata();
        const hasAlpha = metadata.hasAlpha || metadata.channels === 4 || file.type === 'image/svg+xml' || file.type === 'image/png';

        if (size.name === 'og-image') {
          // OG image: always has a background
          pipeline = pipeline
            .resize(size.width, size.height, { fit: size.fit })
            .webp({ quality: 90 });
        } else if (size.name === 'favicon') {
          // Favicon: small, square
          pipeline = pipeline
            .resize(size.width, size.height, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .webp({ quality: 95 });
        } else {
          // Logo: preserve transparency if present, otherwise white bg
          pipeline = pipeline
            .resize(size.width, size.height, { fit: 'contain', background: hasAlpha ? { r: 0, g: 0, b: 0, alpha: 0 } : { r: 255, g: 255, b: 255, alpha: 1 } })
            .webp({ quality: 95 });
        }

        await pipeline.toFile(outputPath);
        results[size.name] = `/uploads/${size.name}.webp`;
      } catch (err) {
        console.error(`Failed to process ${size.name}:`, err);
      }
    }

    // Also save the original
    const ext = file.name.split('.').pop() || 'png';
    const originalPath = path.join(UPLOAD_DIR, `logo-original.${ext}`);
    await writeFile(originalPath, buffer);
    results.original = `/uploads/logo-original.${ext}`;

    return NextResponse.json({
      success: true,
      message: 'Logo uploaded and processed successfully',
      urls: results,
      logoUrl: results.logo || '',
      ogImageUrl: results['og-image'] || '',
    });
  } catch (err) {
    console.error('Logo upload error:', err);
    return NextResponse.json({ error: 'Failed to process logo' }, { status: 500 });
  }
}