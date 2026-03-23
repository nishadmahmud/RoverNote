'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { CanvasData, createBlankCanvas } from '@/types/canvas';

import { JourneyCanvas } from '@/components/canvas';

export default function CanvasEditorPage() {
  const [savedData, setSavedData] = useState<CanvasData | null>(null);

  const handleSave = async (data: CanvasData) => {
    // For demo purposes, just log and store locally
    console.log('Saving canvas data:', data);
    setSavedData(data);
    
    // Simulate save delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // In production, you would save to Supabase:
    // await supabase.from('journeys').update({ canvas_data: data }).eq('id', journeyId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <ArrowLeft size={20} />
              <span style={{ fontFamily: 'Kalam, cursive' }}>Back</span>
            </Link>
            <div className="w-px h-6 bg-gray-300" />
            <h1
              style={{ fontFamily: 'Permanent Marker, cursive' }}
              className="text-xl text-purple-600 flex items-center gap-2"
            >
              <Sparkles size={24} />
              Canvas Editor Demo
            </h1>
          </div>
          
          <div className="text-sm text-gray-500" style={{ fontFamily: 'Kalam, cursive' }}>
            {savedData ? '✓ Changes saved!' : 'Make changes and click Save'}
          </div>
        </div>
      </header>

      {/* Instructions */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-purple-100">
          <h2 style={{ fontFamily: 'Permanent Marker, cursive' }} className="text-purple-600 mb-2">
            🎨 How to use:
          </h2>
          <ul style={{ fontFamily: 'Kalam, cursive' }} className="text-gray-600 space-y-1 text-sm">
            <li>📷 Click the <strong>Image</strong> button to add photos</li>
            <li>✏️ Click the <strong>Text</strong> button to add text boxes</li>
            <li>🖱️ <strong>Drag</strong> elements to move them anywhere</li>
            <li>↔️ Use <strong>corner handles</strong> to resize</li>
            <li>🔄 Use the <strong>rotation handle</strong> (top) to rotate</li>
            <li>⌨️ <strong>Double-click</strong> text to edit it</li>
            <li>🗑️ Select an element and press <strong>Delete</strong> to remove it</li>
            <li>⟲ <strong>Ctrl+Z</strong> to undo, <strong>Ctrl+Y</strong> to redo</li>
          </ul>
        </div>
      </div>

      {/* Canvas Editor */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden" style={{ height: '70vh', minHeight: '600px' }}>
          <JourneyCanvas
            initialData={createBlankCanvas()}
            onSave={handleSave}
            readOnly={false}
          />
        </div>
      </div>

      {/* Debug: Show saved data */}
      {savedData && (
        <div className="max-w-7xl mx-auto px-4 pb-8">
          <details className="bg-gray-900 text-green-400 rounded-xl p-4 font-mono text-xs">
            <summary className="cursor-pointer mb-2">📦 Saved Canvas Data (JSON)</summary>
            <pre className="overflow-auto max-h-60">
              {JSON.stringify(savedData, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
