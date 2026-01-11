import { createClient } from './server';
import type { ContentBlock } from '../types';

/**
 * Get a single content block by key
 */
export async function getContentBlock(
  key: string,
  fallback?: string
): Promise<string> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('content_blocks')
      .select('value')
      .eq('key', key)
      .single();

    if (error || !data) {
      return fallback || '';
    }

    // For text blocks, return the text value
    return (data.value as { text?: string })?.text || fallback || '';
  } catch {
    return fallback || '';
  }
}

/**
 * Get a content block with full metadata
 */
export async function getContentBlockFull(
  key: string
): Promise<ContentBlock | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('content_blocks')
      .select('*')
      .eq('key', key)
      .single();

    if (error || !data) {
      return null;
    }

    return data as ContentBlock;
  } catch {
    return null;
  }
}

/**
 * Get multiple content blocks by keys
 */
export async function getContentBlocks(
  keys: string[]
): Promise<Record<string, ContentBlock>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('content_blocks')
      .select('*')
      .in('key', keys);

    if (error || !data) {
      return {};
    }

    return data.reduce((acc, block) => {
      acc[block.key] = block as ContentBlock;
      return acc;
    }, {} as Record<string, ContentBlock>);
  } catch {
    return {};
  }
}

/**
 * Get all content blocks for a page
 */
export async function getPageContentBlocks(
  page: string
): Promise<Record<string, ContentBlock>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('content_blocks')
      .select('*')
      .eq('page', page);

    if (error || !data) {
      return {};
    }

    return data.reduce((acc, block) => {
      acc[block.key] = block as ContentBlock;
      return acc;
    }, {} as Record<string, ContentBlock>);
  } catch {
    return {};
  }
}

/**
 * Helper to extract text value from a content block
 */
export function getBlockText(
  blocks: Record<string, ContentBlock>,
  key: string,
  fallback: string = ''
): string {
  const block = blocks[key];
  if (!block) return fallback;
  return block.value?.text || fallback;
}
