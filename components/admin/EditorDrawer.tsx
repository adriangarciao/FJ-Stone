'use client';

import { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { useEditMode } from './EditModeContext';
import type { ContentBlock } from '@/lib/types';

export default function EditorDrawer() {
  const { activeBlock, closeEditor, setPendingUpdate, clearPendingUpdate } = useEditMode();
  const [value, setValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize value when block changes
  useEffect(() => {
    if (activeBlock) {
      const text = activeBlock.value?.text || '';
      setValue(text);
      setHasChanges(false);
      setError(null);
    }
  }, [activeBlock]);

  // Track changes
  useEffect(() => {
    if (activeBlock) {
      const originalText = activeBlock.value?.text || '';
      setHasChanges(value !== originalText);
    }
  }, [value, activeBlock]);

  const handleSave = async () => {
    if (!activeBlock || !hasChanges) return;

    setIsSaving(true);
    setError(null);

    // Optimistic update
    const optimisticBlock: ContentBlock = {
      ...activeBlock,
      value: { ...activeBlock.value, text: value },
      updated_at: new Date().toISOString(),
    };
    setPendingUpdate(activeBlock.key, optimisticBlock);

    try {
      const response = await fetch('/api/admin/content/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: activeBlock.key,
          block_type: activeBlock.block_type,
          value: { text: value },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save');
      }

      // Success - keep the optimistic update and close
      closeEditor();
    } catch (err) {
      // Rollback optimistic update
      clearPendingUpdate(activeBlock.key);
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (hasChanges) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to close?'
      );
      if (!confirmed) return;
    }
    closeEditor();
  };

  if (!activeBlock) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={handleClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Edit Content</h2>
            <p className="text-sm text-gray-500 font-mono">{activeBlock.key}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              {activeBlock.block_type === 'text' && (
                activeBlock.key.includes('headline') ||
                activeBlock.key.includes('title') ||
                activeBlock.key.includes('cta') ? (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-[#990303]"
                    placeholder="Enter text..."
                  />
                ) : (
                  <textarea
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-[#990303] resize-none"
                    placeholder="Enter text..."
                  />
                )
              )}
            </div>

            <div className="text-xs text-gray-400">
              <p>Type: {activeBlock.block_type}</p>
              <p>Page: {activeBlock.page}</p>
              <p>
                Last updated:{' '}
                {new Date(activeBlock.updated_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            onClick={handleClose}
            disabled={isSaving}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className="px-6 py-2 bg-[#990303] hover:bg-[#71706e] disabled:bg-gray-300 text-white font-medium transition-colors flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
