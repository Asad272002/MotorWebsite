import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

const contentTypeByExt: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

export async function GET(
  _req: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await context.params;

  if (!segments || segments.length === 0) {
    return new NextResponse('Not found', { status: 404 });
  }

  if (segments.some((s) => s.includes('..') || s.includes('\\') || s.includes(':'))) {
    return new NextResponse('Bad request', { status: 400 });
  }

  const baseDir = path.resolve(process.cwd(), 'bikes_data');
  const filePath = path.resolve(baseDir, ...segments);

  if (!filePath.startsWith(baseDir + path.sep)) {
    return new NextResponse('Bad request', { status: 400 });
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = contentTypeByExt[ext];
  if (!contentType) {
    return new NextResponse('Unsupported media type', { status: 415 });
  }

  try {
    const data = await fs.readFile(filePath);
    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}

