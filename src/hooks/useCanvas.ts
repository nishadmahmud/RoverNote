'use client';

import { useReducer, useCallback, useMemo } from 'react';
import {
  CanvasData,
  CanvasElement,
  CanvasBackground,
  CanvasTool,
  CanvasEditorState,
  CanvasAction,
  createBlankCanvas,
} from '@/types/canvas';

const MAX_HISTORY_SIZE = 50;

function canvasReducer(state: CanvasEditorState, action: CanvasAction): CanvasEditorState {
  switch (action.type) {
    case 'ADD_ELEMENT': {
      const newCanvasData = {
        ...state.canvasData,
        elements: [...state.canvasData.elements, action.element],
      };
      return {
        ...state,
        canvasData: newCanvasData,
        selectedElementId: action.element.id,
        isDirty: true,
        history: [...state.history.slice(0, state.historyIndex + 1), newCanvasData].slice(-MAX_HISTORY_SIZE),
        historyIndex: Math.min(state.historyIndex + 1, MAX_HISTORY_SIZE - 1),
      };
    }

    case 'UPDATE_ELEMENT': {
      const newElements = state.canvasData.elements.map((el) =>
        el.id === action.id ? { ...el, ...action.updates } : el
      );
      const newCanvasData = { ...state.canvasData, elements: newElements };
      return {
        ...state,
        canvasData: newCanvasData,
        isDirty: true,
        history: [...state.history.slice(0, state.historyIndex + 1), newCanvasData].slice(-MAX_HISTORY_SIZE),
        historyIndex: Math.min(state.historyIndex + 1, MAX_HISTORY_SIZE - 1),
      };
    }

    case 'DELETE_ELEMENT': {
      const newElements = state.canvasData.elements.filter((el) => el.id !== action.id);
      const newCanvasData = { ...state.canvasData, elements: newElements };
      return {
        ...state,
        canvasData: newCanvasData,
        selectedElementId: state.selectedElementId === action.id ? null : state.selectedElementId,
        isDirty: true,
        history: [...state.history.slice(0, state.historyIndex + 1), newCanvasData].slice(-MAX_HISTORY_SIZE),
        historyIndex: Math.min(state.historyIndex + 1, MAX_HISTORY_SIZE - 1),
      };
    }

    case 'SELECT_ELEMENT': {
      return {
        ...state,
        selectedElementId: action.id,
      };
    }

    case 'MOVE_ELEMENT': {
      const newElements = state.canvasData.elements.map((el) =>
        el.id === action.id ? { ...el, x: action.x, y: action.y } : el
      );
      return {
        ...state,
        canvasData: { ...state.canvasData, elements: newElements },
        isDirty: true,
      };
    }

    case 'RESIZE_ELEMENT': {
      const newElements = state.canvasData.elements.map((el) =>
        el.id === action.id ? { ...el, width: action.width, height: action.height } : el
      );
      return {
        ...state,
        canvasData: { ...state.canvasData, elements: newElements },
        isDirty: true,
      };
    }

    case 'ROTATE_ELEMENT': {
      const newElements = state.canvasData.elements.map((el) =>
        el.id === action.id ? { ...el, rotation: action.rotation } : el
      );
      return {
        ...state,
        canvasData: { ...state.canvasData, elements: newElements },
        isDirty: true,
      };
    }

    case 'REORDER_ELEMENT': {
      const elements = [...state.canvasData.elements];
      const index = elements.findIndex((el) => el.id === action.id);
      if (index === -1) return state;

      const element = elements[index];
      const zIndexes = elements.map((el) => el.zIndex).sort((a, b) => a - b);

      let newZIndex = element.zIndex;
      switch (action.direction) {
        case 'forward':
          newZIndex = Math.max(...zIndexes) + 1;
          break;
        case 'backward':
          newZIndex = Math.min(...zIndexes) - 1;
          break;
        case 'front':
          newZIndex = Math.max(...zIndexes) + 10;
          break;
        case 'back':
          newZIndex = Math.min(...zIndexes) - 10;
          break;
      }

      const newElements = elements.map((el) =>
        el.id === action.id ? { ...el, zIndex: newZIndex } : el
      );

      return {
        ...state,
        canvasData: { ...state.canvasData, elements: newElements },
        isDirty: true,
      };
    }

    case 'SET_BACKGROUND': {
      const newCanvasData = { ...state.canvasData, background: action.background };
      return {
        ...state,
        canvasData: newCanvasData,
        isDirty: true,
        history: [...state.history.slice(0, state.historyIndex + 1), newCanvasData].slice(-MAX_HISTORY_SIZE),
        historyIndex: Math.min(state.historyIndex + 1, MAX_HISTORY_SIZE - 1),
      };
    }

    case 'SET_TOOL': {
      return {
        ...state,
        activeTool: action.tool,
      };
    }

    case 'SET_ZOOM': {
      return {
        ...state,
        zoom: Math.max(0.25, Math.min(2, action.zoom)),
      };
    }

    case 'UNDO': {
      if (state.historyIndex <= 0) return state;
      const newIndex = state.historyIndex - 1;
      return {
        ...state,
        canvasData: state.history[newIndex],
        historyIndex: newIndex,
        isDirty: true,
      };
    }

    case 'REDO': {
      if (state.historyIndex >= state.history.length - 1) return state;
      const newIndex = state.historyIndex + 1;
      return {
        ...state,
        canvasData: state.history[newIndex],
        historyIndex: newIndex,
        isDirty: true,
      };
    }

    case 'LOAD_CANVAS': {
      return {
        ...state,
        canvasData: action.data,
        selectedElementId: null,
        isDirty: false,
        history: [action.data],
        historyIndex: 0,
      };
    }

    case 'RESET_CANVAS': {
      const blankCanvas = createBlankCanvas();
      return {
        ...state,
        canvasData: blankCanvas,
        selectedElementId: null,
        isDirty: false,
        history: [blankCanvas],
        historyIndex: 0,
      };
    }

    default:
      return state;
  }
}

function createInitialState(initialData?: CanvasData): CanvasEditorState {
  const canvasData = initialData || createBlankCanvas();
  return {
    canvasData,
    selectedElementId: null,
    activeTool: 'select',
    zoom: 1,
    isPanning: false,
    isDirty: false,
    history: [canvasData],
    historyIndex: 0,
  };
}

export function useCanvas(initialData?: CanvasData) {
  const [state, dispatch] = useReducer(canvasReducer, initialData, createInitialState);

  // Action creators
  const addElement = useCallback((element: CanvasElement) => {
    dispatch({ type: 'ADD_ELEMENT', element });
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    dispatch({ type: 'UPDATE_ELEMENT', id, updates });
  }, []);

  const deleteElement = useCallback((id: string) => {
    dispatch({ type: 'DELETE_ELEMENT', id });
  }, []);

  const selectElement = useCallback((id: string | null) => {
    dispatch({ type: 'SELECT_ELEMENT', id });
  }, []);

  const moveElement = useCallback((id: string, x: number, y: number) => {
    dispatch({ type: 'MOVE_ELEMENT', id, x, y });
  }, []);

  const resizeElement = useCallback((id: string, width: number, height: number) => {
    dispatch({ type: 'RESIZE_ELEMENT', id, width, height });
  }, []);

  const rotateElement = useCallback((id: string, rotation: number) => {
    dispatch({ type: 'ROTATE_ELEMENT', id, rotation });
  }, []);

  const reorderElement = useCallback(
    (id: string, direction: 'forward' | 'backward' | 'front' | 'back') => {
      dispatch({ type: 'REORDER_ELEMENT', id, direction });
    },
    []
  );

  const setBackground = useCallback((background: CanvasBackground) => {
    dispatch({ type: 'SET_BACKGROUND', background });
  }, []);

  const setTool = useCallback((tool: CanvasTool) => {
    dispatch({ type: 'SET_TOOL', tool });
  }, []);

  const setZoom = useCallback((zoom: number) => {
    dispatch({ type: 'SET_ZOOM', zoom });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);

  const loadCanvas = useCallback((data: CanvasData) => {
    dispatch({ type: 'LOAD_CANVAS', data });
  }, []);

  const resetCanvas = useCallback(() => {
    dispatch({ type: 'RESET_CANVAS' });
  }, []);

  // Derived state
  const selectedElement = useMemo(() => {
    if (!state.selectedElementId) return null;
    return state.canvasData.elements.find((el) => el.id === state.selectedElementId) || null;
  }, [state.selectedElementId, state.canvasData.elements]);

  const sortedElements = useMemo(() => {
    return [...state.canvasData.elements].sort((a, b) => a.zIndex - b.zIndex);
  }, [state.canvasData.elements]);

  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  return {
    // State
    canvasData: state.canvasData,
    selectedElementId: state.selectedElementId,
    selectedElement,
    sortedElements,
    activeTool: state.activeTool,
    zoom: state.zoom,
    isDirty: state.isDirty,
    canUndo,
    canRedo,

    // Actions
    addElement,
    updateElement,
    deleteElement,
    selectElement,
    moveElement,
    resizeElement,
    rotateElement,
    reorderElement,
    setBackground,
    setTool,
    setZoom,
    undo,
    redo,
    loadCanvas,
    resetCanvas,
  };
}

export type UseCanvasReturn = ReturnType<typeof useCanvas>;
