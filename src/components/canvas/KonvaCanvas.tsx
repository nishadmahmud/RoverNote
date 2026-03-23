'use client';

import React, { useState, useRef, useCallback } from 'react';
import {
  CanvasData,
  CanvasElement,
  ImageElement,
  TextElement,
  StickerElement,
  DEFAULT_CANVAS_WIDTH,
  DEFAULT_CANVAS_HEIGHT,
} from '@/types/canvas';

interface KonvaCanvasProps {
  canvasData: CanvasData;
  sortedElements: CanvasElement[];
  selectedElementId: string | null;
  scale: number;
  readOnly: boolean;
  onSelectElement: (id: string | null) => void;
  onElementChange: (id: string, updates: Partial<CanvasElement>) => void;
}

// CSS-based draggable element
function DraggableElement({
  element,
  isSelected,
  scale,
  readOnly,
  onSelect,
  onChange,
}: {
  element: CanvasElement;
  isSelected: boolean;
  scale: number;
  readOnly: boolean;
  onSelect: () => void;
  onChange: (updates: Partial<CanvasElement>) => void;
}) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, elementX: 0, elementY: 0 });
  const [isEditingText, setIsEditingText] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (readOnly || element.locked || isEditingText) return;
    e.stopPropagation();
    onSelect();
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      elementX: element.x,
      elementY: element.y,
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || readOnly) return;
    
    const dx = (e.clientX - dragStart.x) / scale;
    const dy = (e.clientY - dragStart.y) / scale;
    
    onChange({
      x: dragStart.elementX + dx,
      y: dragStart.elementY + dy,
    });
  }, [isDragging, dragStart, scale, onChange, readOnly]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  // Add global mouse listeners when dragging
  React.useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const handleResizeMouseDown = (e: React.MouseEvent, corner: string) => {
    if (readOnly || element.locked) return;
    e.stopPropagation();
    setIsResizing(true);
    // TODO: Implement resize logic
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (element.type === 'text' && !readOnly && !element.locked) {
      e.stopPropagation();
      setIsEditingText(true);
    }
  };

  const handleTextBlur = (newContent: string) => {
    setIsEditingText(false);
    onChange({ content: newContent } as Partial<TextElement>);
  };

  const renderContent = () => {
    switch (element.type) {
      case 'image': {
        const imgEl = element as ImageElement;
        return (
          <img
            src={imgEl.src}
            alt="Canvas element"
            className="w-full h-full object-cover pointer-events-none"
            draggable={false}
          />
        );
      }
      case 'text': {
        const textEl = element as TextElement;
        if (isEditingText) {
          return (
            <textarea
              autoFocus
              defaultValue={textEl.content}
              onBlur={(e) => handleTextBlur(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleTextBlur((e.target as HTMLTextAreaElement).value);
                }
                if (e.key === 'Escape') {
                  setIsEditingText(false);
                }
              }}
              className="w-full h-full bg-transparent border-none outline-none resize-none"
              style={{
                fontFamily: textEl.fontFamily,
                fontSize: textEl.fontSize,
                color: textEl.color,
                textAlign: textEl.align,
              }}
            />
          );
        }
        return (
          <div
            className="w-full h-full overflow-hidden"
            style={{
              fontFamily: textEl.fontFamily,
              fontSize: textEl.fontSize,
              color: textEl.color,
              textAlign: textEl.align,
            }}
          >
            {textEl.content}
          </div>
        );
      }
      case 'sticker': {
        const stickerEl = element as StickerElement;
        return (
          <img
            src={stickerEl.src}
            alt="Sticker"
            className="w-full h-full object-contain pointer-events-none"
            draggable={false}
          />
        );
      }
      default:
        return null;
    }
  };

  return (
    <div
      ref={elementRef}
      className={`absolute ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} ${
        isSelected && !readOnly ? 'ring-2 ring-purple-500 ring-offset-2' : ''
      }`}
      style={{
        left: element.x * scale,
        top: element.y * scale,
        width: element.width * scale,
        height: element.height * scale,
        transform: `rotate(${element.rotation}deg)`,
        opacity: element.opacity,
        zIndex: element.zIndex,
        boxShadow: element.type === 'image' ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Polaroid frame for images */}
      {element.type === 'image' && (
        <div className="absolute inset-0 bg-white p-2 pb-8 shadow-lg" style={{ margin: -8 }}>
          <div className="w-full h-full overflow-hidden">
            {renderContent()}
          </div>
        </div>
      )}
      
      {element.type !== 'image' && renderContent()}

      {/* Resize handles */}
      {isSelected && !readOnly && !element.locked && (
        <>
          <div
            className="absolute -top-1 -left-1 w-3 h-3 bg-white border-2 border-purple-500 rounded-full cursor-nw-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
          />
          <div
            className="absolute -top-1 -right-1 w-3 h-3 bg-white border-2 border-purple-500 rounded-full cursor-ne-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
          />
          <div
            className="absolute -bottom-1 -left-1 w-3 h-3 bg-white border-2 border-purple-500 rounded-full cursor-sw-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
          />
          <div
            className="absolute -bottom-1 -right-1 w-3 h-3 bg-white border-2 border-purple-500 rounded-full cursor-se-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
          />
        </>
      )}
    </div>
  );
}

export default function KonvaCanvas({
  canvasData,
  sortedElements,
  selectedElementId,
  scale,
  readOnly,
  onSelectElement,
  onElementChange,
}: KonvaCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleCanvasClick = () => {
    onSelectElement(null);
  };

  // Render background texture
  const renderBackground = () => {
    const { background } = canvasData;
    
    if (background.type === 'color') {
      return { backgroundColor: background.value };
    }
    
    if (background.type === 'texture') {
      switch (background.value) {
        case 'lined':
          return {
            backgroundColor: '#f9f6f0',
            backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #e5d5c5 31px, #e5d5c5 32px)',
          };
        case 'grid':
          return {
            backgroundColor: '#f9f6f0',
            backgroundImage: `
              linear-gradient(#e5d5c5 1px, transparent 1px),
              linear-gradient(90deg, #e5d5c5 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px',
          };
        case 'dotted':
          return {
            backgroundColor: '#f9f6f0',
            backgroundImage: 'radial-gradient(#d1c4b8 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          };
        default:
          return { backgroundColor: '#f9f6f0' };
      }
    }
    
    return { backgroundColor: '#f9f6f0' };
  };

  return (
    <div
      ref={canvasRef}
      className="relative overflow-hidden"
      style={{
        width: DEFAULT_CANVAS_WIDTH * scale,
        height: DEFAULT_CANVAS_HEIGHT * scale,
        ...renderBackground(),
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        borderRadius: '4px',
      }}
      onClick={handleCanvasClick}
    >
      {/* Paper texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px',
        }}
      />

      {/* Render elements */}
      {sortedElements.map((element) => (
        <DraggableElement
          key={element.id}
          element={element}
          isSelected={element.id === selectedElementId}
          scale={scale}
          readOnly={readOnly}
          onSelect={() => onSelectElement(element.id)}
          onChange={(updates) => onElementChange(element.id, updates)}
        />
      ))}
    </div>
  );
}
