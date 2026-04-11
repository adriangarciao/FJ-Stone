/**
 * Backfill blur_data_url for existing project_images rows that don't have one.
 *
 * Run with:
 *   npx tsx scripts/backfill-blur-data.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from '@supabase/supabase-js';
import { getPlaiceholder } from 'plaiceholder';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function generateBlurDataUrl(buffer: Buffer): Promise<string | null> {
  try {
    const { base64 } = await getPlaiceholder(buffer, { size: 10 });
    return base64;
  } catch {
    return null;
  }
}

async function main() {
  console.log('Fetching images without blur_data_url...');

  const { data: images, error } = await supabase
    .from('project_images')
    .select('id, storage_path')
    .is('blur_data_url', null);

  if (error) {
    console.error('Failed to fetch images:', error.message);
    process.exit(1);
  }

  if (!images || images.length === 0) {
    console.log('All images already have blur data. Nothing to do.');
    return;
  }

  console.log(`Processing ${images.length} image(s)...`);

  let success = 0;
  let failed = 0;

  for (const image of images) {
    const url = `${supabaseUrl}/storage/v1/object/public/portfolio/${image.storage_path}`;
    process.stdout.write(`  ${image.id} (${image.storage_path})... `);

    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.log(`SKIP (HTTP ${res.status})`);
        failed++;
        continue;
      }

      const buffer = Buffer.from(await res.arrayBuffer());
      const blur_data_url = await generateBlurDataUrl(buffer);

      if (!blur_data_url) {
        console.log('SKIP (blur generation failed)');
        failed++;
        continue;
      }

      const { error: updateError } = await supabase
        .from('project_images')
        .update({ blur_data_url })
        .eq('id', image.id);

      if (updateError) {
        console.log(`FAIL (${updateError.message})`);
        failed++;
      } else {
        console.log('OK');
        success++;
      }
    } catch (err) {
      console.log(`ERROR (${err instanceof Error ? err.message : String(err)})`);
      failed++;
    }
  }

  console.log(`\nDone. ${success} updated, ${failed} failed/skipped.`);
}

main();
