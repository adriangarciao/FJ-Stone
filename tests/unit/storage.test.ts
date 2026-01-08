import { describe, expect, it } from 'vitest';
import { getProjectImageUrl } from '@/lib/supabase/storage';

describe('getProjectImageUrl', () => {
  it('builds the public storage URL when inputs are provided', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    const result = getProjectImageUrl('image.jpg');

    expect(result).toBe(
      'https://example.supabase.co/storage/v1/object/public/portfolio/image.jpg'
    );
  });

  it('returns an empty string when the storage path is missing', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    expect(getProjectImageUrl('')).toBe('');
  });
});
