'use client';

import { useState, useRef, useCallback } from 'react';
import TabBar from '@/components/TabBar';

type Direction = 'LONG' | 'SHORT';

const POPULAR_COINS = ['BTC', 'ETH', 'SOL', 'DOGE', 'PEPE', 'WIF', 'ARB', 'AVAX'];
const LEVERAGE_PRESETS = [1, 2, 3, 5, 10, 20, 50, 100];

interface TradeForm {
  ticker: string;
  direction: Direction;
  leverage: number;
  entry: string;
  target: string;
  stopLoss: string;
  risk: string;
  caption: string;
}

const EMPTY_FORM: TradeForm = {
  ticker: '',
  direction: 'LONG',
  leverage: 5,
  entry: '',
  target: '',
  stopLoss: '',
  risk: '',
  caption: '',
};

export default function PostPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [form, setForm] = useState<TradeForm>(EMPTY_FORM);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVideoSelect = useCallback((file: File) => {
    if (!file.type.startsWith('video/')) return;
    setVideoFile(file);
    setVideoUrl(URL.createObjectURL(file));
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleVideoSelect(file);
  }, [handleVideoSelect]);

  const set = (key: keyof TradeForm, val: string | number) =>
    setForm((f) => ({ ...f, [key]: val }));

  // Derived: auto-calculate % gain/loss for target and stop
  const entryNum = parseFloat(form.entry);
  const targetNum = parseFloat(form.target);
  const stopNum = parseFloat(form.stopLoss);
  const targetPct = !isNaN(entryNum) && !isNaN(targetNum) && entryNum > 0
    ? (((targetNum - entryNum) / entryNum) * 100 * (form.direction === 'SHORT' ? -1 : 1))
    : null;
  const stopPct = !isNaN(entryNum) && !isNaN(stopNum) && entryNum > 0
    ? (((stopNum - entryNum) / entryNum) * 100 * (form.direction === 'SHORT' ? -1 : 1))
    : null;

  const canPost = form.ticker && form.entry && form.target && form.stopLoss;

  return (
    <div className="fixed inset-0 bg-black flex justify-center">
      <div className="relative w-full max-w-[430px] h-full flex flex-col">

        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 pt-12 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          {step === 2 ? (
            <button onClick={() => setStep(1)} className="text-white/60 active:text-white transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
            </button>
          ) : (
            <div className="w-6" />
          )}

          <span className="text-white font-semibold text-base">
            {step === 1 ? 'New Trade Post' : 'Trade Details'}
          </span>

          {step === 1 ? (
            <button
              onClick={() => videoFile && setStep(2)}
              className="text-sm font-bold px-4 py-1.5 rounded-full transition-all active:scale-95"
              style={{
                background: videoFile ? '#FF1493' : 'rgba(255,255,255,0.1)',
                color: videoFile ? 'white' : 'rgba(255,255,255,0.3)',
              }}
            >
              Next
            </button>
          ) : (
            <button
              disabled={!canPost}
              className="text-sm font-bold px-4 py-1.5 rounded-full transition-all active:scale-95"
              style={{
                background: canPost ? '#FF1493' : 'rgba(255,255,255,0.1)',
                color: canPost ? 'white' : 'rgba(255,255,255,0.3)',
                boxShadow: canPost ? '0 0 16px rgba(255,20,147,0.4)' : 'none',
              }}
            >
              Post
            </button>
          )}
        </div>

        {/* Step indicator */}
        <div className="flex-shrink-0 flex gap-1.5 px-5 py-3">
          {[1, 2].map((s) => (
            <div
              key={s}
              className="h-1 flex-1 rounded-full transition-all duration-300"
              style={{ background: step >= s ? '#FF1493' : 'rgba(255,255,255,0.12)' }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex flex-col">

          {/* ── STEP 1: VIDEO ── */}
          {step === 1 && (
            <div className="px-5 py-4 space-y-4 flex flex-col justify-center min-h-full">

              {/* Upload zone */}
              <div
                className="relative rounded-2xl overflow-hidden cursor-pointer transition-all"
                style={{
                  aspectRatio: '9/16',
                  maxHeight: 420,
                  background: dragOver ? 'rgba(255,20,147,0.08)' : '#0d0d0d',
                  border: dragOver
                    ? '2px dashed #FF1493'
                    : videoUrl
                    ? '2px solid rgba(255,20,147,0.3)'
                    : '2px dashed rgba(255,255,255,0.15)',
                }}
                onClick={() => !videoUrl && fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                {videoUrl ? (
                  <>
                    <video
                      src={videoUrl}
                      className="absolute inset-0 w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                    {/* Replace overlay */}
                    <button
                      onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                      className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-semibold"
                      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Replace
                    </button>
                    {/* Filename */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="px-3 py-1.5 rounded-lg text-xs text-white/80 truncate"
                        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
                        {videoFile?.name}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{ background: 'rgba(255,20,147,0.12)', border: '1px solid rgba(255,20,147,0.2)' }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF1493" strokeWidth="1.8">
                        <path d="M15 10l4.553-2.069A1 1 0 0 1 21 8.87v6.26a1 1 0 0 1-1.447.894L15 14" />
                        <rect x="2" y="6" width="13" height="12" rx="2" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-base">Upload your trade video</p>
                      <p className="text-white/40 text-sm mt-1">Tap to browse · MP4, MOV, AVI</p>
                    </div>
                    <div className="flex items-center gap-2 text-white/20 text-xs">
                      <div className="h-px flex-1 bg-white/10" />
                      or drag & drop
                      <div className="h-px flex-1 bg-white/10" />
                    </div>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleVideoSelect(f); }}
              />

              {!videoUrl && (
                <p className="text-center text-white/30 text-xs">
                  A video is required to post a trade
                </p>
              )}
            </div>
          )}

          {/* ── STEP 2: TRADE DETAILS ── */}
          {step === 2 && (
            <div className="px-5 py-4 space-y-5 pb-8 flex-1">

              {/* Video thumbnail strip */}
              {videoUrl && (
                <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <video src={videoUrl} className="w-full h-full object-cover" muted playsInline />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{videoFile?.name}</p>
                    <p className="text-white/40 text-xs mt-0.5">
                      {videoFile ? (videoFile.size / (1024 * 1024)).toFixed(1) + ' MB' : ''}
                    </p>
                  </div>
                  <button onClick={() => setStep(1)} className="text-white/30 hover:text-white/60 transition-colors flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Coin */}
              <Section label="Coin / Token">
                <input
                  type="text"
                  placeholder="e.g. BTC"
                  value={form.ticker}
                  onChange={(e) => set('ticker', e.target.value.toUpperCase())}
                  className="w-full bg-transparent text-white text-base font-semibold placeholder-white/20 outline-none uppercase"
                  style={{ caretColor: '#FF1493' }}
                />
                <div className="flex flex-wrap gap-2 mt-3">
                  {POPULAR_COINS.map((coin) => (
                    <button
                      key={coin}
                      onClick={() => set('ticker', coin)}
                      className="px-3 py-1 rounded-full text-xs font-semibold transition-all active:scale-95"
                      style={{
                        background: form.ticker === coin ? '#FF1493' : 'rgba(255,255,255,0.07)',
                        color: form.ticker === coin ? 'white' : 'rgba(255,255,255,0.5)',
                        border: form.ticker === coin ? 'none' : '1px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      {coin}
                    </button>
                  ))}
                </div>
              </Section>

              {/* Direction */}
              <Section label="Direction">
                <div className="flex gap-3">
                  {(['LONG', 'SHORT'] as Direction[]).map((dir) => {
                    const active = form.direction === dir;
                    const isLong = dir === 'LONG';
                    return (
                      <button
                        key={dir}
                        onClick={() => set('direction', dir)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
                        style={{
                          background: active
                            ? isLong ? 'rgba(34,197,94,0.18)' : 'rgba(239,68,68,0.18)'
                            : 'rgba(255,255,255,0.05)',
                          color: active
                            ? isLong ? '#4ade80' : '#f87171'
                            : 'rgba(255,255,255,0.3)',
                          border: active
                            ? `1px solid ${isLong ? 'rgba(74,222,128,0.35)' : 'rgba(248,113,113,0.35)'}`
                            : '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          {isLong
                            ? <path d="M12 2l8 16H4z"/>
                            : <path d="M12 22l8-16H4z"/>
                          }
                        </svg>
                        {dir}
                      </button>
                    );
                  })}
                </div>
              </Section>

              {/* Leverage */}
              <Section label="Leverage">
                <div className="flex flex-wrap gap-2">
                  {LEVERAGE_PRESETS.map((lev) => (
                    <button
                      key={lev}
                      onClick={() => set('leverage', lev)}
                      className="px-3 py-1.5 rounded-lg text-sm font-bold transition-all active:scale-95"
                      style={{
                        background: form.leverage === lev ? '#FF1493' : 'rgba(255,255,255,0.07)',
                        color: form.leverage === lev ? 'white' : 'rgba(255,255,255,0.45)',
                        border: form.leverage === lev ? 'none' : '1px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      {lev}x
                    </button>
                  ))}
                </div>
              </Section>

              {/* Entry / Target / Stop Loss */}
              <Section label="Price Levels">
                <div className="space-y-3">
                  <PriceInput
                    label="Entry Price"
                    value={form.entry}
                    onChange={(v) => set('entry', v)}
                    hint={null}
                  />
                  <PriceInput
                    label="Target"
                    value={form.target}
                    onChange={(v) => set('target', v)}
                    hint={targetPct !== null ? {
                      text: `${targetPct >= 0 ? '+' : ''}${targetPct.toFixed(1)}%`,
                      positive: targetPct >= 0,
                    } : null}
                  />
                  <PriceInput
                    label="Stop Loss"
                    value={form.stopLoss}
                    onChange={(v) => set('stopLoss', v)}
                    hint={stopPct !== null ? {
                      text: `${stopPct >= 0 ? '+' : ''}${stopPct.toFixed(1)}%`,
                      positive: stopPct >= 0,
                    } : null}
                  />
                </div>
              </Section>

              {/* Risk % */}
              <Section label={`Risk per trade — ${form.risk || '0'}%`}>
                <input
                  type="range"
                  min={0.5}
                  max={10}
                  step={0.5}
                  value={form.risk || 0}
                  onChange={(e) => set('risk', e.target.value)}
                  className="w-full h-1.5 rounded-full appearance-none outline-none"
                  style={{
                    background: `linear-gradient(to right, #FF1493 ${((parseFloat(form.risk || '0') - 0.5) / 9.5) * 100}%, rgba(255,255,255,0.1) 0%)`,
                    accentColor: '#FF1493',
                  }}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-white/25 text-[10px]">0.5%</span>
                  <span className="text-white/25 text-[10px]">10%</span>
                </div>
              </Section>

              {/* Caption */}
              <Section label="Caption">
                <textarea
                  placeholder="Describe your setup, thesis, key levels..."
                  value={form.caption}
                  onChange={(e) => set('caption', e.target.value)}
                  rows={3}
                  className="w-full bg-transparent text-white text-sm placeholder-white/20 outline-none resize-none leading-relaxed"
                  style={{ caretColor: '#FF1493' }}
                />
                <p className="text-white/25 text-xs text-right mt-1">{form.caption.length}/280</p>
              </Section>

              {/* Post button */}
              <button
                disabled={!canPost}
                className="w-full py-4 rounded-2xl font-bold text-base text-white transition-all active:scale-95"
                style={{
                  background: canPost
                    ? 'linear-gradient(135deg, #FF1493, #cc0070)'
                    : 'rgba(255,255,255,0.07)',
                  color: canPost ? 'white' : 'rgba(255,255,255,0.25)',
                  boxShadow: canPost ? '0 4px 24px rgba(255,20,147,0.35)' : 'none',
                }}
              >
                Post Trade
              </button>
            </div>
          )}

        </div>

        {/* Tab bar */}
        <div className="flex-shrink-0 z-50">
          <TabBar activeTab="post" />
        </div>

      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-4" style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.07)' }}>
      <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">{label}</p>
      {children}
    </div>
  );
}

function PriceInput({
  label, value, onChange, hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint: { text: string; positive: boolean } | null;
}) {
  return (
    <div className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <span className="text-white/40 text-sm w-24 flex-shrink-0">{label}</span>
      <div className="flex items-center gap-2 flex-1 justify-end">
        {hint && (
          <span className="text-xs font-semibold" style={{ color: hint.positive ? '#4ade80' : '#f87171' }}>
            {hint.text}
          </span>
        )}
        <div className="flex items-center gap-1">
          <span className="text-white/30 text-sm">$</span>
          <input
            type="number"
            inputMode="decimal"
            placeholder="0.00"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="bg-transparent text-white text-sm font-semibold text-right outline-none w-28 placeholder-white/20"
            style={{ caretColor: '#FF1493' }}
          />
        </div>
      </div>
    </div>
  );
}
