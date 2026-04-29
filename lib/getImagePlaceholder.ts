import 'server-only';
import { getPlaiceholder } from 'plaiceholder';
import fs from 'fs/promises';
import path from 'path';
import { getProjectImageUrl } from './supabase/storage';
import type { Project } from './types';

/**
 * Generate a tiny base64 blur placeholder data URL from a buffer.
 * Used at upload time so the result can be stored in the DB.
 */
export async function generateBlurDataUrl(buffer: Buffer): Promise<string | null> {
  try {
    const { base64 } = await getPlaiceholder(buffer, { size: 10 });
    return base64;
  } catch {
    return null;
  }
}

/**
 * Generate a blur data URL from a storage path.
 * Used by the backfill script and local-fallback path in queries.
 */
async function getImageBlurData(storagePath: string): Promise<string | null> {
  try {
    let buffer: Buffer;

    if (storagePath.startsWith('/images/')) {
      // Local image in /public — read from disk
      const filePath = path.join(process.cwd(), 'public', storagePath);
      buffer = await fs.readFile(filePath);
    } else {
      // Supabase storage image — fetch via HTTP
      const url = getProjectImageUrl(storagePath);
      if (!url) return null;
      const res = await fetch(url);
      if (!res.ok) return null;
      buffer = Buffer.from(await res.arrayBuffer());
    }

    return generateBlurDataUrl(buffer);
  } catch {
    return null;
  }
}

/**
 * Add blur_data_url to the first image of each project.
 * Used for the local /public image fallback where blur data is not in the DB.
 */
export async function addBlurToProjects(projects: Project[]): Promise<Project[]> {
  return Promise.all(
    projects.map(async (project) => {
      if (!project.images?.length) return project;
      const firstImage = project.images[0];
      // Skip if already has blur data (e.g. from DB)
      if (firstImage.blur_data_url) return project;
      const blur_data_url = await getImageBlurData(firstImage.storage_path);
      if (!blur_data_url) return project;
      return {
        ...project,
        images: [
          { ...firstImage, blur_data_url },
          ...project.images.slice(1),
        ],
      };
    })
  );
}
