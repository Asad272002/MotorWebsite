import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { ArrowLeft } from 'lucide-react';
import bikesJson from '@/bikes_data/bikes.json';
import { VariantSelector } from './VariantSelector';
import path from 'path';
import { promises as fs } from 'fs';

type Bike = {
  name: string;
  cc: number;
  brand: string;
  specification: string;
  type: string;
  image?: {
    localPath: string;
  };
};

type GroupedBike = Omit<Bike, 'cc'> & {
  baseName: string;
  variants: Bike[];
};

const rawBikes = bikesJson as Bike[];

// Same normalization logic as in catalogue
const normalizeBikeName = (name: string) => {
  return name.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/cc$/, '');
};

const getBaseName = (name: string) => {
  const norm = normalizeBikeName(name);
  if (norm.includes('tarogp1')) return 'Taro GP 1';
  if (norm.includes('tarogp2')) return 'Taro GP 2';
  if (norm.includes('taroc6')) return 'Taro C6';
  if (norm.includes('taroc5')) return 'Taro C5';
  if (norm.includes('lifankpm')) return 'Lifan KPM';
  if (norm.includes('lifank19')) return 'Lifan K19';
  if (norm.includes('lifanv16s')) return 'Lifan V16S';
  if (norm.includes('lifankpt')) return 'Lifan KPT';
  if (norm.includes('hispeedinfinity')) return 'Hi Speed Infinity';
  if (norm.includes('hispeedfreedom')) return 'Hi Speed Freedom';
  if (norm.includes('hispeedcyclone')) return 'Hi Speed Cyclone';
  if (norm.includes('hispeedbatllo')) return 'Hi Speed Batllo';
  if (norm.includes('superstar200')) return 'Super Star 200cc';

  return name;
};

const getGroupedBikes = () => {
  return rawBikes.reduce((acc, bike) => {
    const isOther = bike.type.toLowerCase() === 'replica';
    const baseName = isOther ? bike.name.trim() : getBaseName(bike.name);
    const key = isOther ? `${baseName.toLowerCase()}-${bike.cc}` : baseName.toLowerCase();
    
    if (!acc[key]) {
      acc[key] = {
        baseName,
        name: baseName,
        brand: bike.brand,
        specification: bike.specification,
        type: bike.type,
        variants: [],
      };
    }
    
    acc[key].variants.push(bike);
    return acc;
  }, {} as Record<string, GroupedBike>);
};

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const getBikeGroup = (slug: string) => {
  const grouped = getGroupedBikes();
  return Object.values(grouped).find((g) => slugify(g.baseName) === slug);
};

const isImageFileName = (name: string) => /\.(png|jpe?g|webp|gif)$/i.test(name);

const isVariantFolderName = (name: string) => /^\d+$/.test(name) || /cc/i.test(name);

const normalizeForMatch = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, '');

const listFilesRecursive = async (
  dirPath: string,
  maxDepth: number
): Promise<string[]> => {
  if (maxDepth < 0) return [];

  let entries: import('fs').Dirent[];
  try {
    entries = await fs.readdir(dirPath, { withFileTypes: true });
  } catch {
    return [];
  }

  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      const nested = await listFilesRecursive(fullPath, maxDepth - 1);
      files.push(...nested);
      continue;
    }
    if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
};

const resolveGalleryRootDir = async (bikeGroup: GroupedBike) => {
  const bikesDataRoot = path.join(process.cwd(), 'bikes_data');
  const targetFileNames = Array.from(
    new Set(
      bikeGroup.variants
        .map((v) => v.image?.localPath)
        .filter(Boolean)
        .map((p) => (p as string).split('/').pop() as string)
        .filter(Boolean)
    )
  );

  if (targetFileNames.length === 0) return null;

  const allFiles = await listFilesRecursive(bikesDataRoot, 5);
  const matches = allFiles.filter((fullPath) =>
    targetFileNames.includes(path.basename(fullPath))
  );

  if (matches.length === 0) return null;

  const candidateDirs = matches.map((matchPath) => {
    let dir = path.dirname(matchPath);
    const base = path.basename(dir);
    if (isVariantFolderName(base)) {
      dir = path.dirname(dir);
    }
    return dir;
  });

  const counts = new Map<string, number>();
  candidateDirs.forEach((d) => counts.set(d, (counts.get(d) ?? 0) + 1));

  let bestDir = candidateDirs[0];
  let bestCount = counts.get(bestDir) ?? 0;
  counts.forEach((count, dir) => {
    if (count > bestCount) {
      bestDir = dir;
      bestCount = count;
    }
  });

  return bestDir;
};

const getGalleryImagesForGroup = async (bikeGroup: GroupedBike) => {
  const bikesDataRoot = path.join(process.cwd(), 'bikes_data');
  const galleryRoot = await resolveGalleryRootDir(bikeGroup);
  if (!galleryRoot) return [];

  const filePaths = await listFilesRecursive(galleryRoot, 2);
  const baseMatch = normalizeForMatch(bikeGroup.baseName);
  const images = filePaths
    .filter((p) => isImageFileName(p))
    .filter((p) => {
      if (bikeGroup.type.toLowerCase() !== 'replica') return true;
      const stem = path.parse(p).name;
      const fileMatch = normalizeForMatch(stem);
      return fileMatch.includes(baseMatch) || baseMatch.includes(fileMatch);
    })
    .sort((a, b) => a.localeCompare(b));

  return images.map((absPath) => {
    const rel = path.relative(bikesDataRoot, absPath);
    const urlSegments = rel.split(path.sep).map((s) => encodeURIComponent(s));
    return `/bikes-data/${urlSegments.join('/')}`;
  });
};

const getGalleryImagesByCc = async (bikeGroup: GroupedBike) => {
  const bikesDataRoot = path.join(process.cwd(), 'bikes_data');
  const allFiles = await listFilesRecursive(bikesDataRoot, 5);
  const filesByBaseName = new Map<string, string[]>();

  allFiles.forEach((fullPath) => {
    const base = path.basename(fullPath);
    const existing = filesByBaseName.get(base);
    if (existing) {
      existing.push(fullPath);
      return;
    }
    filesByBaseName.set(base, [fullPath]);
  });

  const entries = await Promise.all(
    bikeGroup.variants.map(async (variant) => {
      const fileName = (variant.image?.localPath ?? '').split('/').pop();
      if (!fileName) return [variant.cc, [] as string[]] as const;

      const matches = filesByBaseName.get(fileName) ?? [];
      if (matches.length === 0) return [variant.cc, [] as string[]] as const;

      let dir = path.dirname(matches[0]);
      const base = path.basename(dir);
      if (isVariantFolderName(base)) {
        dir = path.dirname(dir);
      }

      const filePaths = await listFilesRecursive(dir, 2);
      const baseMatch = normalizeForMatch(bikeGroup.baseName);
      const images = filePaths
        .filter((p) => isImageFileName(p))
        .filter((p) => {
          if (bikeGroup.type.toLowerCase() !== 'replica') return true;
          const stem = path.parse(p).name;
          const fileMatch = normalizeForMatch(stem);
          return fileMatch.includes(baseMatch) || baseMatch.includes(fileMatch);
        })
        .sort((a, b) => a.localeCompare(b))
        .map((absPath) => {
          const rel = path.relative(bikesDataRoot, absPath);
          const urlSegments = rel.split(path.sep).map((s) => encodeURIComponent(s));
          return `/bikes-data/${urlSegments.join('/')}`;
        });

      return [variant.cc, images] as const;
    })
  );

  const byCc: Record<number, string[]> = {};
  entries.forEach(([cc, images]) => {
    if (!byCc[cc]) byCc[cc] = images;
  });

  return byCc;
};

export default async function BikeDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { id } = await params;
  const { from } = await searchParams;
  const backHref = from?.toLowerCase() === 'others' ? '/catalogue?tab=others' : '/catalogue?tab=original';
  const bikeGroup = getBikeGroup(id);

  if (!bikeGroup || bikeGroup.variants.length === 0) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-serif text-primary mb-4">Bike Not Found</h1>
        <Link href={backHref}>
          <Button>Back to Collection</Button>
        </Link>
      </div>
    );
  }

  const galleryImages = await getGalleryImagesForGroup(bikeGroup);
  const galleryImagesByCc = await getGalleryImagesByCc(bikeGroup);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <Link
            href={backHref}
            className="text-sm uppercase tracking-widest text-muted hover:text-champagne transition-colors flex items-center gap-2 w-fit"
          >
            <ArrowLeft size={14} /> Back to Collection
          </Link>
        </div>

        {/* Client component to handle state between variants */}
        <VariantSelector bikeGroup={bikeGroup} galleryImages={galleryImages} galleryImagesByCc={galleryImagesByCc} />
      </div>
    </div>
  );
}
