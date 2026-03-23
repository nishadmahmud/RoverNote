'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import { useCanvas } from '@/hooks/useCanvas';
import { CanvasToolbar } from './toolbar/CanvasToolbar';
import {
  CanvasData,
  CanvasElement,
  createImageElement,
  createTextElement,
  DEFAULT_CANVAS_WIDTH,
  DEFAULT_CANVAS_HEIGHT,
} from '@/types/canvas';
import { Loader2, Save } from 'lucide-react';

interface JourneyCanvasProps {
  initialData?: CanvasData;
  onSave?: (data: CanvasData) => Promise<void>;
  readOnly?: boolean;
}

// Dynamic import with ssr: false for the Konva component
const KonvaCanvas = dynamic(() => import('./KonvaCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p style={{ fontFamily: 'Kalam, cursive' }} className="text-gray-600">
          Loading canvas...
        </p>
      </div>
    </div>
  ),
});

export function JourneyCanvas({ initialData, onSave, readOnly = false }: JourneyCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  const [isSaving, setIsSaving] = useState(false);

  const {
    canvasData,
    selectedElementId,
    selectedElement,
    sortedElements,
    activeTool,
    zoom,
    isDirty,
    canUndo,
    canRedo,
    addElement,
    updateElement,
    deleteElement,
    selectElement,
    reorderElement,
    setTool,
    setZoom,
    undo,
    redo,
    loadCanvas,
  } = useCanvas(initialData);

  // Load initial data when it changes
  useEffect(() => {
    if (initialData) {
      loadCanvas(initialData);
    }
  }, [initialData, loadCanvas]);

  // Resize handler
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    if (readOnly) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't delete if we're editing text
      if (document.activeElement?.tagName === 'TEXTAREA' || document.activeElement?.tagName === 'INPUT') {
        return;
      }

      // Delete
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementId) {
        e.preventDefault();
        deleteElement(selectedElementId);
      }

      // Undo/Redo
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault();
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
        }
        if (e.key === 'y') {
          e.preventDefault();
          redo();
        }
      }

      // Escape to deselect
      if (e.key === 'Escape') {
        selectElement(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [readOnly, selectedElementId, deleteElement, undo, redo, selectElement]);

  // Calculate scale to fit canvas in container
  const scale = Math.min(
    containerSize.width / DEFAULT_CANVAS_WIDTH,
    containerSize.height / DEFAULT_CANVAS_HEIGHT,
    1
  ) * zoom;

  // Add image from file
  const handleAddImage = useCallback(async (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const maxSize = 300;
        let width = img.width;
        let height = img.height;

        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width *= ratio;
          height *= ratio;
        }

        const x = 100 + Math.random() * 200;
        const y = 100 + Math.random() * 200;

        const element = createImageElement(reader.result as string, x, y, width, height);
        addElement(element);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }, [addElement]);

  // Add text
  const handleAddText = useCallback(() => {
    const x = 100 + Math.random() * 200;
    const y = 100 + Math.random() * 200;
    const element = createTextElement('Double-click to edit', x, y);
    addElement(element);
  }, [addElement]);

  // Handle element changes
  const handleElementChange = useCallback(
    (id: string, updates: Partial<CanvasElement>) => {
      updateElement(id, updates);
    },
    [updateElement]
  );

  // Save handler
  const handleSave = async () => {
    if (!onSave || isSaving) return;
    setIsSaving(true);
    try {
      await onSave(canvasData);
    } catch (error) {
      console.error('Failed to save canvas:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Duplicate selected element
  const handleDuplicate = useCallback(() => {
    if (!selectedElement) return;
    const newElement = {
      ...selectedElement,
      id: `el_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      x: selectedElement.x + 20,
      y: selectedElement.y + 20,
      zIndex: Date.now(),
    };
    addElement(newElement as CanvasElement);
  }, [selectedElement, addElement]);

  // Toggle lock
  const handleToggleLock = useCallback(() => {
    if (!selectedElementId) return;
    updateElement(selectedElementId, { locked: !selectedElement?.locked });
  }, [selectedElementId, selectedElement, updateElement]);

  // Reset rotation
  const handleResetRotation = useCallback(() => {
    if (!selectedElementId) return;
    updateElement(selectedElementId, { rotation: 0 });
  }, [selectedElementId, updateElement]);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      {!readOnly && (
        <div className="flex items-center justify-between gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50">
          <CanvasToolbar
            activeTool={activeTool}
            onToolChange={setTool}
            zoom={zoom}
            onZoomChange={setZoom}
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={undo}
            onRedo={redo}
            onAddImage={handleAddImage}
            onAddText={handleAddText}
            selectedElement={selectedElement}
            onDeleteElement={() => selectedElementId && deleteElement(selectedElementId)}
            onDuplicateElement={handleDuplicate}
            onBringForward={() => selectedElementId && reorderElement(selectedElementId, 'forward')}
            onSendBackward={() => selectedElementId && reorderElement(selectedElementId, 'backward')}
            onToggleLock={handleToggleLock}
            onResetRotation={handleResetRotation}
          />

          {onSave && (
            <button
              onClick={handleSave}
              disabled={isSaving || !isDirty}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isDirty
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
              style={{ fontFamily: 'Permanent Marker, cursive' }}
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {isSaving ? 'Saving...' : isDirty ? 'Save' : 'Saved'}
            </button>
          )}
        </div>
      )}

      {/* Canvas Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto bg-gray-100 flex items-center justify-center p-4"
        style={{ minHeight: '500px' }}
      >
        <KonvaCanvas
          canvasData={canvasData}
          sortedElements={sortedElements}
          selectedElementId={selectedElementId}
          scale={scale}
          readOnly={readOnly}
          onSelectElement={selectElement}
          onElementChange={handleElementChange}
        />
      </div>

      {/* Helper text */}
      {!readOnly && (
        <div className="p-2 bg-gray-50 text-center text-sm text-gray-500">
          <span style={{ fontFamily: 'Kalam, cursive' }}>
            💡 Tip: Drag elements to move • Double-click text to edit • Use corners to resize & rotate
          </span>
        </div>
      )}
    </div>
  );
}
