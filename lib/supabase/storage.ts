export function getProjectImageUrl(storagePath: string): string {
  if (!storagePath) {
    return '';
  }

  // If the path starts with /images/, it's a local image
  if (storagePath.startsWith('/images/')) {
    return storagePath;
  }

  // Otherwise, it's a Supabase storage path
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    return '';
  }
  return `${supabaseUrl}/storage/v1/object/public/portfolio/${storagePath}`;
}
