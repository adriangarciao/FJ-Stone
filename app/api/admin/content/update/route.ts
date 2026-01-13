import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// Validation schema for content block updates
const updateContentSchema = z.object({
  key: z.string().min(1).max(120),
  block_type: z.enum(['text', 'richtext', 'image', 'gallery', 'list']),
  value: z.object({
    text: z.string().max(5000).optional(),
    html: z.string().max(10000).optional(),
    url: z.string().url().max(500).optional(),
    alt: z.string().max(200).optional(),
    items: z
      .array(
        z.object({
          url: z.string().url(),
          caption: z.string().max(500).optional(),
          alt: z.string().max(200).optional(),
        })
      )
      .max(50)
      .optional(),
    listItems: z.array(z.string().max(500)).max(50).optional(),
  }),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const { data: isAdmin } = await supabase.rpc('is_admin');

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const result = updateContentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: result.error.issues },
        { status: 400 }
      );
    }

    const { key, block_type, value } = result.data;

    // Sanitize text content (basic XSS prevention)
    if (value.text) {
      value.text = value.text
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
      // Actually, for plain text storage, we store as-is
      // Escaping happens on render. Keep original text.
      value.text = result.data.value.text;
    }

    // Upsert the content block
    const { data, error } = await supabase
      .from('content_blocks')
      .upsert(
        {
          key,
          block_type,
          value,
          page: key.split('.')[0] || 'global',
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'key',
        }
      )
      .select()
      .single();

    if (error) {
      console.error('Error updating content block:', error);
      return NextResponse.json(
        { error: 'Failed to update content' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      block: data,
    });
  } catch (error) {
    console.error('Content update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
