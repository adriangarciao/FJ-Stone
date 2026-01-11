'use client';

import { Pencil, X } from 'lucide-react';
import { useEditModeOptional } from './EditModeContext';

export default function AdminEditToggle() {
  const editMode = useEditModeOptional();

  // Don't render if not admin or context not available
  if (!editMode || !editMode.isAdmin) {
    return null;
  }

  const { isEditMode, toggleEditMode } = editMode;

  return (
    <button
      onClick={toggleEditMode}
      className={`fixed bottom-4 left-4 z-50 flex items-center gap-2 px-4 py-2 text-sm font-medium shadow-lg transition-all ${
        isEditMode
          ? 'bg-[#990303] text-white'
          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
      }`}
      title={isEditMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
    >
      {isEditMode ? (
        <>
          <X size={16} />
          Exit Edit Mode
        </>
      ) : (
        <>
          <Pencil size={16} />
          Edit Mode
        </>
      )}
    </button>
  );
}
