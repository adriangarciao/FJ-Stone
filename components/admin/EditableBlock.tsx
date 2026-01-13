'use client';

import { type ReactNode } from 'react';
import { Pencil } from 'lucide-react';
import { useEditModeOptional } from './EditModeContext';
import type { ContentBlock } from '@/lib/types';

interface EditableBlockProps {
  block: ContentBlock | null;
  fallback?: string;
  children: ReactNode;
  className?: string;
  as?: 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3';
}

/**
 * Wrapper component that makes content editable in admin edit mode.
 * In normal mode, just renders children.
 * In edit mode, shows hover outline and edit button.
 */
export default function EditableBlock({
  block,
  fallback,
  children,
  className = '',
  as: Component = 'span',
}: EditableBlockProps) {
  const editMode = useEditModeOptional();

  // Not in edit mode or no context - just render children
  if (!editMode || !editMode.isEditMode || !block) {
    return <Component className={className}>{children}</Component>;
  }

  const { openEditor, pendingUpdates } = editMode;

  // Check for pending optimistic update
  const displayBlock = pendingUpdates[block.key] || block;
  const displayText = displayBlock.value?.text || fallback || '';

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openEditor(displayBlock);
  };

  return (
    <Component
      className={`group relative cursor-pointer ${className}`}
      onClick={handleClick}
    >
      {/* Edit mode outline */}
      <span className="absolute inset-0 border-2 border-transparent group-hover:border-[#990303] group-hover:bg-[#990303]/5 pointer-events-none transition-all" />
      
      {/* Edit button */}
      <span className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 bg-[#990303] text-white p-1 shadow-lg transition-opacity z-10">
        <Pencil size={12} />
      </span>

      {/* Content - show optimistic update if available */}
      {pendingUpdates[block.key] ? displayText : children}
    </Component>
  );
}

/**
 * Simple text editable block that renders text directly
 */
interface EditableTextProps {
  block: ContentBlock | null;
  fallback: string;
  className?: string;
  as?: 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3';
}

export function EditableText({
  block,
  fallback,
  className = '',
  as: Component = 'span',
}: EditableTextProps) {
  const editMode = useEditModeOptional();

  // Get the text to display
  const pendingBlock = block && editMode?.pendingUpdates[block.key];
  const text = pendingBlock?.value?.text || block?.value?.text || fallback;

  // Not in edit mode - just render text
  if (!editMode || !editMode.isEditMode || !block) {
    return <Component className={className}>{text}</Component>;
  }

  const { openEditor } = editMode;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openEditor(pendingBlock || block);
  };

  return (
    <Component
      className={`group relative cursor-pointer ${className}`}
      onClick={handleClick}
    >
      {/* Edit mode outline */}
      <span className="absolute inset-0 border-2 border-transparent group-hover:border-[#990303] group-hover:bg-[#990303]/5 pointer-events-none transition-all" />
      
      {/* Edit button */}
      <span className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 bg-[#990303] text-white p-1 shadow-lg transition-opacity z-10">
        <Pencil size={12} />
      </span>

      {text}
    </Component>
  );
}
