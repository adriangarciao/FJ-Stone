import 'server-only';
import { getPlaiceholder } from 'plaiceholder';
import fs from 'fs/promises';
import path from 'path';
import { getProjectImageUrl } from './supabase/storage';
import type { Project } from './types';

/**
 * Generate a tiny base64 blur placeholder for an image.
 * Works for both local /public images and remote Supabase images.
 * Returns null on any error — callers should handle gracefully.
 */
export async function getImageBlurData(storagePath: string): Promise<string | null> {
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

    const { base64 } = await getPlaiceholder(buffer, { size: 10 });
    return base64;
  } catch {
    return null;
  }
}

/**
 * Add blur placeholder data URLs to the first image of each project.
 * Run server-side only — generates tiny base64 thumbnails for blur-up effect.
 */
export async function addBlurToProjects(projects: Project[]): Promise<Project[]> {
  return Promise.all(
    projects.map(async (project) => {
      if (!project.images?.length) return project;
      const firstImage = project.images[0];
      const blurDataURL = await getImageBlurData(firstImage.storage_path);
      if (!blurDataURL) return project;
      return {
        ...project,
        images: [
          { ...firstImage, blurDataURL },
          ...project.images.slice(1),
        ],
      };
    })
  );
}
