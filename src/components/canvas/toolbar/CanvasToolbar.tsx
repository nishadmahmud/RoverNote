'use client';

import React, { useRef } from 'react';
import {
  MousePointer2,
  Image as ImageIcon,
  Type,
  Smile,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Trash2,
  Copy,
  Layers,
  ChevronUp,
  ChevronDown,
  Lock,
  Unlock,
  RotateCcw,
} from 'lucide-react';
import { CanvasTool, CanvasElement } from '@/types/canvas';

interface CanvasToolbarProps {
  activeTool: CanvasTool;
  onToolChange: (tool: CanvasTool) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onAddImage: (file: File) => void;
  onAddText: () => void;
  selectedElement: CanvasElement | null;
  onDeleteElement: () => void;
  onDuplicateElement: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onToggleLock: () => void;
  onResetRotation: () => void;
}

export function CanvasToolbar({
  activeTool,
  onToolChange,
  zoom,
  onZoomChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onAddImage,
  onAddText,
  selectedElement,
  onDeleteElement,
  onDuplicateElement,
  onBringForward,
  onSendBackward,
  onToggleLock,
  onResetRotation,
}: CanvasToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAddImage(file);
    }
    e.target.value = '';
  };

  const tools: { id: CanvasTool; icon: React.ReactNode; label: string }[] = [
    { id: 'select', icon: <MousePointer2 size={20} />, label: 'Select' },
  ];

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-2">
      {/* Main Tools Row */}
      <div className="flex items-center gap-1 flex-wrap">
        {/* Selection Tool */}
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onToolChange(tool.id)}
            className={`p-2 rounded-lg transition-all ${
              activeTool === tool.id
                ? 'bg-purple-100 text-purple-600'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title={tool.label}
          >
            {tool.icon}
          </button>
        ))}

        <div className="w-px h-8 bg-gray-200 mx-1" />

        {/* Add Elements */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-lg hover:bg-green-100 text-green-600 transition-all"
          title="Add Image"
        >
          <ImageIcon size={20} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        <button
          onClick={onAddText}
          className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition-all"
          title="Add Text"
        >
          <Type size={20} />
        </button>

        <button
          onClick={() => {}}
          className="p-2 rounded-lg hover:bg-yellow-100 text-yellow-600 transition-all"
          title="Add Sticker (Coming Soon)"
        >
          <Smile size={20} />
        </button>

        <div className="w-px h-8 bg-gray-200 mx-1" />

        {/* Undo/Redo */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`p-2 rounded-lg transition-all ${
            canUndo ? 'hover:bg-gray-100 text-gray-600' : 'text-gray-300 cursor-not-allowed'
          }`}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={20} />
        </button>

        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={`p-2 rounded-lg transition-all ${
            canRedo ? 'hover:bg-gray-100 text-gray-600' : 'text-gray-300 cursor-not-allowed'
          }`}
          title="Redo (Ctrl+Y)"
        >
          <Redo2 size={20} />
        </button>

        <div className="w-px h-8 bg-gray-200 mx-1" />

        {/* Zoom Controls */}
        <button
          onClick={() => onZoomChange(zoom - 0.1)}
          disabled={zoom <= 0.25}
          className={`p-2 rounded-lg transition-all ${
            zoom > 0.25 ? 'hover:bg-gray-100 text-gray-600' : 'text-gray-300 cursor-not-allowed'
          }`}
          title="Zoom Out"
        >
          <ZoomOut size={20} />
        </button>

        <span className="text-sm font-medium text-gray-600 min-w-[50px] text-center">
          {Math.round(zoom * 100)}%
        </span>

        <button
          onClick={() => onZoomChange(zoom + 0.1)}
          disabled={zoom >= 2}
          className={`p-2 rounded-lg transition-all ${
            zoom < 2 ? 'hover:bg-gray-100 text-gray-600' : 'text-gray-300 cursor-not-allowed'
          }`}
          title="Zoom In"
        >
          <ZoomIn size={20} />
        </button>

        {/* Selected Element Actions */}
        {selectedElement && (
          <>
            <div className="w-px h-8 bg-gray-200 mx-1" />

            <button
              onClick={onBringForward}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-all"
              title="Bring Forward"
            >
              <ChevronUp size={20} />
            </button>

            <button
              onClick={onSendBackward}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-all"
              title="Send Backward"
            >
              <ChevronDown size={20} />
            </button>

            <button
              onClick={onResetRotation}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-all"
              title="Reset Rotation"
            >
              <RotateCcw size={20} />
            </button>

            <button
              onClick={onToggleLock}
              className={`p-2 rounded-lg transition-all ${
                selectedElement.locked
                  ? 'bg-orange-100 text-orange-600'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title={selectedElement.locked ? 'Unlock' : 'Lock'}
            >
              {selectedElement.locked ? <Lock size={20} /> : <Unlock size={20} />}
            </button>

            <button
              onClick={onDuplicateElement}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-all"
              title="Duplicate"
            >
              <Copy size={20} />
            </button>

            <button
              onClick={onDeleteElement}
              className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-all"
              title="Delete"
            >
              <Trash2 size={20} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
