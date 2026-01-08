export function getProjectImageUrl(storagePath: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl || !storagePath) {
    return '';
  }
  return `${supabaseUrl}/storage/v1/object/public/portfolio/${storagePath}`;
}
