// Canvas Types for RoverNote Journey Editor

export interface CanvasData {
  version: 1;
  width: number;
  height: number;
  background: CanvasBackground;
  elements: CanvasElement[];
}

export interface CanvasBackground {
  type: 'color' | 'texture' | 'image';
  value: string; // hex color, texture name, or image URL
}

// Base element interface
export interface BaseCanvasElement {
  id: string;
  type: 'image' | 'text' | 'sticker';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  locked: boolean;
  opacity: number;
}

// Image element
export interface ImageElement extends BaseCanvasElement {
  type: 'image';
  src: string;
  // Optional filters
  brightness?: number;
  contrast?: number;
}

// Text element
export interface TextElement extends BaseCanvasElement {
  type: 'text';
  content: string;
  fontSize: number;
  fontFamily: CanvasFontFamily;
  color: string;
  align: 'left' | 'center' | 'right';
  fontStyle?: 'normal' | 'italic';
  fontWeight?: 'normal' | 'bold';
  textDecoration?: 'none' | 'underline';
}

// Sticker element
export interface StickerElement extends BaseCanvasElement {
  type: 'sticker';
  stickerId: string;
  stickerPack: string;
  src: string; // Sticker image URL
}

// Union type for all canvas elements
export type CanvasElement = ImageElement | TextElement | StickerElement;

// Available handwriting fonts
export type CanvasFontFamily = 
  | 'Caveat'
  | 'Kalam'
  | 'Permanent Marker'
  | 'Patrick Hand'
  | 'Indie Flower'
  | 'Shadows Into Light'
  | 'Dancing Script'
  | 'Pacifico';

// Available paper textures
export type PaperTexture = 
  | 'lined'
  | 'grid'
  | 'dotted'
  | 'plain'
  | 'vintage'
  | 'kraft';

// Tool types for the editor
export type CanvasTool = 
  | 'select'
  | 'pan'
  | 'image'
  | 'text'
  | 'sticker';

// Canvas editor state
export interface CanvasEditorState {
  canvasData: CanvasData;
  selectedElementId: string | null;
  activeTool: CanvasTool;
  zoom: number;
  isPanning: boolean;
  isDirty: boolean; // Has unsaved changes
  history: CanvasData[];
  historyIndex: number;
}

// Actions for canvas editor
export type CanvasAction =
  | { type: 'ADD_ELEMENT'; element: CanvasElement }
  | { type: 'UPDATE_ELEMENT'; id: string; updates: Partial<CanvasElement> }
  | { type: 'DELETE_ELEMENT'; id: string }
  | { type: 'SELECT_ELEMENT'; id: string | null }
  | { type: 'MOVE_ELEMENT'; id: string; x: number; y: number }
  | { type: 'RESIZE_ELEMENT'; id: string; width: number; height: number }
  | { type: 'ROTATE_ELEMENT'; id: string; rotation: number }
  | { type: 'REORDER_ELEMENT'; id: string; direction: 'forward' | 'backward' | 'front' | 'back' }
  | { type: 'SET_BACKGROUND'; background: CanvasBackground }
  | { type: 'SET_TOOL'; tool: CanvasTool }
  | { type: 'SET_ZOOM'; zoom: number }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'LOAD_CANVAS'; data: CanvasData }
  | { type: 'RESET_CANVAS' };

// Default canvas dimensions (diary page proportions)
export const DEFAULT_CANVAS_WIDTH = 800;
export const DEFAULT_CANVAS_HEIGHT = 1100;

// Create a blank canvas
export function createBlankCanvas(): CanvasData {
  return {
    version: 1,
    width: DEFAULT_CANVAS_WIDTH,
    height: DEFAULT_CANVAS_HEIGHT,
    background: {
      type: 'texture',
      value: 'lined',
    },
    elements: [],
  };
}

// Generate unique element ID
export function generateElementId(): string {
  return `el_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Create a new image element
export function createImageElement(
  src: string,
  x: number = 100,
  y: number = 100,
  width: number = 200,
  height: number = 200
): ImageElement {
  return {
    id: generateElementId(),
    type: 'image',
    x,
    y,
    width,
    height,
    rotation: 0,
    zIndex: Date.now(),
    locked: false,
    opacity: 1,
    src,
  };
}

// Create a new text element
export function createTextElement(
  content: string = 'Double-click to edit',
  x: number = 100,
  y: number = 100
): TextElement {
  return {
    id: generateElementId(),
    type: 'text',
    x,
    y,
    width: 200,
    height: 50,
    rotation: 0,
    zIndex: Date.now(),
    locked: false,
    opacity: 1,
    content,
    fontSize: 24,
    fontFamily: 'Caveat',
    color: '#374151',
    align: 'left',
    fontStyle: 'normal',
    fontWeight: 'normal',
  };
}

// Create a new sticker element
export function createStickerElement(
  stickerId: string,
  stickerPack: string,
  src: string,
  x: number = 100,
  y: number = 100,
  size: number = 80
): StickerElement {
  return {
    id: generateElementId(),
    type: 'sticker',
    x,
    y,
    width: size,
    height: size,
    rotation: 0,
    zIndex: Date.now(),
    locked: false,
    opacity: 1,
    stickerId,
    stickerPack,
    src,
  };
}
