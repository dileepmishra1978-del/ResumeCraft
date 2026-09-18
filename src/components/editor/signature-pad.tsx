'use client';

import React, { useRef, useState, useEffect } from 'react';
import { PenTool, Type, Upload, RotateCcw, Check, Trash2, Image as ImageIcon } from 'lucide-react';

interface SignaturePadProps {
  value?: string;
  defaultName?: string;
  initialMode?: 'draw' | 'type' | 'upload';
  onChange: (signatureDataUrl: string | undefined, mode: 'draw' | 'type' | 'upload') => void;
}

export function SignaturePad({
  value,
  defaultName = '',
  initialMode = 'draw',
  onChange,
}: SignaturePadProps) {
  const [mode, setMode] = useState<'draw' | 'type' | 'upload'>(initialMode);
  const [penColor, setPenColor] = useState<'#0f2b5c' | '#111827'>('#0f2b5c');
  const [typedName, setTypedName] = useState(defaultName);
  const [typedStyle, setTypedStyle] = useState<'script' | 'cursive' | 'formal'>('script');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const hasStrokesRef = useRef(false);

  useEffect(() => {
    if (!typedName && defaultName) {
      setTypedName(defaultName);
    }
  }, [defaultName]);

  const getCanvasContext = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    return ctx;
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = getCanvasContext();
    if (!ctx) return;

    isDrawingRef.current = true;
    hasStrokesRef.current = true;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.strokeStyle = penColor;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = getCanvasContext();
    if (!ctx) return;

    if ('touches' in e) {
      e.preventDefault();
    }

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    exportDrawnSignature();
  };

  const exportDrawnSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasStrokesRef.current) return;
    const dataUrl = canvas.toDataURL('image/png');
    onChange(dataUrl, 'draw');
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = getCanvasContext();
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasStrokesRef.current = false;
    onChange(undefined, 'draw');
  };

  const applyTypedSignature = (nameToRender: string, style: 'script' | 'cursive' | 'formal') => {
    if (!nameToRender.trim()) {
      onChange(undefined, 'type');
      return;
    }

    const offscreen = document.createElement('canvas');
    offscreen.width = 400;
    offscreen.height = 120;
    const ctx = offscreen.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, offscreen.width, offscreen.height);
    ctx.fillStyle = penColor;

    if (style === 'script') {
      ctx.font = 'italic 38px "Times New Roman", Georgia, serif';
    } else if (style === 'cursive') {
      ctx.font = 'italic 34px "Brush Script MT", "Segoe Script", cursive';
    } else {
      ctx.font = 'italic 30px "Palatino Linotype", "Book Antiqua", serif';
    }

    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(nameToRender, offscreen.width / 2, offscreen.height / 2);

    ctx.strokeStyle = penColor;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    const textWidth = ctx.measureText(nameToRender).width;
    const startX = (offscreen.width - textWidth) / 2 - 8;
    const endX = (offscreen.width + textWidth) / 2 + 12;
    ctx.moveTo(startX, offscreen.height / 2 + 20);
    ctx.quadraticCurveTo(offscreen.width / 2, offscreen.height / 2 + 24, endX, offscreen.height / 2 + 18);
    ctx.stroke();

    const dataUrl = offscreen.toDataURL('image/png');
    onChange(dataUrl, 'type');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onChange(dataUrl, 'upload');
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setMode('draw')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              mode === 'draw' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Draw</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('type');
              applyTypedSignature(typedName || defaultName, typedStyle);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              mode === 'type' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Type Script</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              mode === 'upload' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
          <span>Ink:</span>
          <button
            type="button"
            onClick={() => {
              setPenColor('#0f2b5c');
              if (mode === 'type') applyTypedSignature(typedName, typedStyle);
            }}
            className={`w-4 h-4 rounded-full bg-[#0f2b5c] transition-all ${
              penColor === '#0f2b5c' ? 'ring-2 ring-indigo-500 ring-offset-1' : 'opacity-60 hover:opacity-100'
            }`}
            title="Official Blue Ink"
          />
          <button
            type="button"
            onClick={() => {
              setPenColor('#111827');
              if (mode === 'type') applyTypedSignature(typedName, typedStyle);
            }}
            className={`w-4 h-4 rounded-full bg-[#111827] transition-all ${
              penColor === '#111827' ? 'ring-2 ring-indigo-500 ring-offset-1' : 'opacity-60 hover:opacity-100'
            }`}
            title="Classic Black Ink"
          />
        </div>
      </div>

      {mode === 'draw' && (
        <div className="space-y-2">
          <div className="relative border border-gray-300 rounded-xl bg-white overflow-hidden shadow-2xs">
            <canvas
              ref={canvasRef}
              width={400}
              height={120}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-[120px] cursor-crosshair touch-none"
            />
            <div className="absolute bottom-3 left-6 right-6 border-b border-dashed border-gray-300 pointer-events-none flex justify-between text-[9px] text-gray-400">
              <span>Sign above this line</span>
              <span>Online Signature</span>
            </div>
          </div>
          <div className="flex justify-between items-center text-[11px] text-gray-500">
            <span>Use mouse or touchscreen to draw</span>
            <button
              type="button"
              onClick={clearCanvas}
              className="inline-flex items-center gap-1 text-gray-500 hover:text-red-600 px-2 py-0.5 rounded transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Clear
            </button>
          </div>
        </div>
      )}

      {mode === 'type' && (
        <div className="space-y-3 p-3 bg-white border border-gray-300 rounded-xl">
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Type your signature text</label>
            <input
              type="text"
              value={typedName}
              onChange={(e) => {
                const val = e.target.value;
                setTypedName(val);
                applyTypedSignature(val, typedStyle);
              }}
              placeholder="Candidate Full Name"
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs outline-none focus:border-indigo-600"
            />
          </div>

          <div className="space-y-1.5">
            <span className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Choose signature style</span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'script', name: 'Classic Script', font: 'font-serif italic tracking-wide text-sm' },
                { id: 'cursive', name: 'Flowing Cursive', font: 'font-mono italic tracking-tight text-xs' },
                { id: 'formal', name: 'Executive Script', font: 'font-serif text-xs font-semibold' },
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => {
                    const newStyle = st.id as any;
                    setTypedStyle(newStyle);
                    applyTypedSignature(typedName, newStyle);
                  }}
                  className={`p-2 border rounded-lg text-center transition-all ${
                    typedStyle === st.id
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 ring-1 ring-indigo-600'
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50/50 text-gray-700'
                  }`}
                >
                  <div className={`${st.font} truncate text-gray-900`}>{typedName || 'Signature'}</div>
                  <div className="text-[9px] text-gray-400 mt-1">{st.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {mode === 'upload' && (
        <div className="p-4 border-2 border-dashed border-gray-300 hover:border-indigo-500 rounded-xl bg-white text-center transition-colors">
          <input
            type="file"
            id="signature-upload-input"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileUpload}
            className="hidden"
          />
          <label htmlFor="signature-upload-input" className="cursor-pointer block space-y-1">
            <ImageIcon className="w-6 h-6 text-gray-400 mx-auto" />
            <div className="text-xs font-semibold text-indigo-600">Upload signature image</div>
            <p className="text-[10px] text-gray-400">PNG or JPG scanned signature (transparent or white background)</p>
          </label>
        </div>
      )}

      {value && (
        <div className="flex items-center justify-between p-2.5 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs animate-fade-in">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
              <Check className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="font-semibold text-emerald-950 text-xs">Signature attached</div>
              <div className="text-[10px] text-emerald-700">Renders on both ATS preview and downloaded PDF</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <img src={value} alt="Active Signature" className="h-7 max-w-[120px] object-contain border border-emerald-200 rounded bg-white px-1" />
            <button
              type="button"
              onClick={() => {
                clearCanvas();
                onChange(undefined, mode);
              }}
              className="text-gray-400 hover:text-red-600 p-1"
              title="Remove signature"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}