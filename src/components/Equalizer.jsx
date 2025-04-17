import React, { useState, useEffect, useRef } from 'react';
import EqualizerEngine from '../utils/Equalizer';

const BAND_LABELS = [
  '60Hz', '170Hz', '350Hz', '1kHz', '3.5kHz', '10kHz'
];
const SEGMENTS = 12; // Number of visual segments per slider

const USER_PRESETS_KEY = 'musicdj_eq_presets';

function Equalizer({ audioRef }) {
  const [bands, setBands] = useState([0, 0, 0, 0, 0, 0]);
  const [preset, setPreset] = useState('flat');
  const [engine, setEngine] = useState(null);
  const [sliderAnims, setSliderAnims] = useState([false, false, false, false, false, false]);
  const [oscVals, setOscVals] = useState(Array(6).fill(Array(SEGMENTS).fill(0)));
  const [userPresets, setUserPresets] = useState([]);
  const [presetName, setPresetName] = useState('');
  const rafRef = useRef();
  const analyserRef = useRef();
  const dataArrayRef = useRef();

  // Load user presets from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(USER_PRESETS_KEY);
    if (stored) {
      setUserPresets(JSON.parse(stored));
    }
  }, []);

  // Save user presets to localStorage
  useEffect(() => {
    localStorage.setItem(USER_PRESETS_KEY, JSON.stringify(userPresets));
  }, [userPresets]);

  useEffect(() => {
    if (audioRef?.current && !engine) {
      setEngine(new EqualizerEngine(audioRef.current));
    }
  }, [audioRef, engine]);

  // Animate slider thumb briefly when changed
  const handleBandChange = (idx, value) => {
    const newBands = bands.slice();
    newBands[idx] = value;
    setBands(newBands);
    if (engine) engine.setBand(idx, value);
    setPreset('custom');
    setSliderAnims(anims => {
      const arr = [...anims];
      arr[idx] = true;
      setTimeout(() => {
        setSliderAnims(a => { const b = [...a]; b[idx] = false; return b; });
      }, 350);
      return arr;
    });
  };

  const handlePreset = (name, customBands) => {
    if (name && customBands) {
      setBands(customBands);
      if (engine) customBands.forEach((v, i) => engine.setBand(i, v));
      setPreset(name);
      return;
    }
    if (engine) engine.setPreset(name);
    setBands(engine ? engine.getBands() : [0,0,0,0,0,0]);
    setPreset(name);
  };

  // Setup analyser for oscillating segment animation
  useEffect(() => {
    if (!engine || !audioRef?.current) return;
    if (!analyserRef.current) {
      analyserRef.current = engine.ctx.createAnalyser();
      analyserRef.current.fftSize = 256;
      engine.filters[engine.filters.length - 1].connect(analyserRef.current);
      dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
    }
    let running = true;
    function animateSegments() {
      if (!running) return;
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      // Map frequency bins to each band slider
      const vals = BAND_LABELS.map((_, bandIdx) => {
        // Each band maps to a range of bins
        const binStart = Math.floor((bandIdx/6) * dataArrayRef.current.length);
        const binEnd = Math.floor(((bandIdx+1)/6) * dataArrayRef.current.length);
        const bins = dataArrayRef.current.slice(binStart, binEnd);
        // Fill segments with normalized values (simulate oscillation)
        let segs = [];
        for (let i = 0; i < SEGMENTS; i++) {
          const segBinStart = Math.floor((i/SEGMENTS) * bins.length);
          const segBinEnd = Math.floor(((i+1)/SEGMENTS) * bins.length);
          const segBins = bins.slice(segBinStart, segBinEnd);
          const avg = segBins.length ? segBins.reduce((a,b) => a+b, 0)/segBins.length : 0;
          segs.push(avg/255);
        }
        return segs;
      });
      setOscVals(vals);
      rafRef.current = requestAnimationFrame(animateSegments);
    }
    animateSegments();
    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [engine, audioRef]);

  // Save user-defined preset
  const saveUserPreset = () => {
    if (!presetName.trim()) return;
    const exists = userPresets.find(p => p.name === presetName.trim());
    if (exists) {
      alert('Preset name already exists.');
      return;
    }
    setUserPresets([...userPresets, { name: presetName.trim(), bands: [...bands] }]);
    setPresetName('');
  };
  // Delete user-defined preset
  const deleteUserPreset = (name) => {
    setUserPresets(userPresets.filter(p => p.name !== name));
    if (preset === name) handlePreset('flat');
  };

  return (
    <div className="equalizer-metallic" style={{
      background: 'linear-gradient(110deg, #e6e6e6 0%, #b8b8b8 60%, #f7f7f7 100%)',
      borderRadius: 14,
      boxShadow: '0 2px 8px #c9c9c9',
      padding: '16px 16px 26px 16px',
      maxWidth: 420,
      margin: '10px auto 0 auto',
      border: '1.5px solid #b0b0b0',
      position: 'relative',
      overflow: 'hidden',
      minHeight: 220,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      transition: 'box-shadow 0.2s',
      aspectRatio: '3/1',
      gap: 0,
      justifyContent: 'flex-start',
    }}>
      <h2 style={{
        marginBottom: 20,
        marginTop: 6,
        color: '#313131',
        letterSpacing: 1,
        textShadow: '0 1px 0 #fff, 0 2px 8px #bbb',
        fontWeight: 700,
        fontSize: 20,
      }}>Equalizer</h2>
      {/* Sliders Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        gap: 32,
        margin: '0 0 10px 0',
        width: '100%',
        maxWidth: 380,
        minHeight: 100,
        padding: '0 12px',
      }}>
        {BAND_LABELS.map((label, idx) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 38, position: 'relative', height: 100, justifyContent: 'flex-end' }}>
            <label htmlFor={`eq-band-${idx}`} style={{ fontSize: 13, color: '#444', marginBottom: 6 }}>{label}</label>
            {/* Animated green segments */}
            <div style={{
              position: 'absolute',
              left: '50%',
              top: 28,
              transform: 'translateX(-50%)',
              zIndex: 1,
              height: 68,
              width: 18,
              display: 'flex',
              flexDirection: 'column-reverse',
              justifyContent: 'flex-start',
              pointerEvents: 'none',
            }}>
              {oscVals[idx]?.map((v, i) => (
                <div key={i} style={{
                  height: 68/SEGMENTS,
                  width: '100%',
                  borderRadius: 2,
                  margin: '0 0 1.5px 0',
                  background: `linear-gradient(90deg, #39e27d 40%, #1fc47b 100%)`,
                  opacity: v > 0.15 ? v : 0.12,
                  filter: v > 0.5 ? 'drop-shadow(0 0 4px #2aff8a)' : 'none',
                  transition: 'opacity 0.13s, filter 0.13s',
                }} />
              ))}
            </div>
            <input
              id={`eq-band-${idx}`}
              type="range"
              min={-12}
              max={12}
              step={0.5}
              value={bands[idx]}
              onChange={e => handleBandChange(idx, Number(e.target.value))}
              style={{
                writingMode: 'bt-lr',
                WebkitAppearance: 'slider-vertical',
                height: 68,
                width: 14,
                background:
                  'linear-gradient(180deg, #f7f7f7 0%, #d7d7d7 40%, #b0b0b0 100%)',
                borderRadius: 7,
                border: '1px solid #b0b0b0',
                accentColor: '#b0b0b0',
                marginBottom: 3,
                transition: 'box-shadow 0.25s',
                outline: sliderAnims[idx] ? '2px solid #ffd700' : undefined,
                boxShadow: sliderAnims[idx] ? '0 0 10px 2px #ffd700, 0 1px 4px #bbb inset' : '0 1px 4px #bbb inset',
                position: 'relative',
                zIndex: 0,
                backgroundColor: 'transparent',
              }}
              aria-label={`${label} gain`}
            />
            <span style={{ fontSize: 12, color: '#555', marginTop: 2 }}>{bands[idx]} dB</span>
          </div>
        ))}
      </div>
      {/* Presets and Reset Row */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, justifyContent: 'center', flexWrap: 'wrap', width: '100%', maxWidth: 390 }}>
        {['flat', 'pop', 'rock', 'jazz', 'classical'].map(p => (
          <button
            key={p}
            onClick={() => handlePreset(p)}
            style={{
              background: 'linear-gradient(90deg, #b0b0b0 0%, #e0e0e0 100%)',
              color: '#222',
              border: '1.2px solid #b0b0b0',
              borderRadius: 7,
              padding: '3px 14px',
              cursor: 'pointer',
              fontWeight: preset === p ? 700 : 400,
              boxShadow: preset === p
                ? '0 0 0 1.5px #00bcd4, 0 1px 4px #bbb'
                : '0 1px 2px #bbb',
              textShadow: '0 1px 0 #fff',
              transition: 'background 0.2s, box-shadow 0.2s',
              fontSize: 14,
              marginBottom: 3,
              outline: 'none',
            }}
            aria-pressed={preset === p}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
        {/* User Presets Dropdown */}
        {userPresets.length > 0 && (
          <select
            value={preset.startsWith('custom') || ['flat','pop','rock','jazz','classical'].includes(preset) ? '' : preset}
            onChange={e => {
              const sel = userPresets.find(p => p.name === e.target.value);
              if (sel) handlePreset(sel.name, sel.bands);
            }}
            style={{
              marginLeft: 10,
              padding: '3px 8px',
              borderRadius: 7,
              border: '1.2px solid #b0b0b0',
              fontSize: 14,
              minWidth: 80,
              background: '#fafafa',
              color: '#222',
              fontWeight: 500,
              marginBottom: 3,
            }}
            aria-label="User presets"
          >
            <option value="">User Presets</option>
            {userPresets.map(p => (
              <option key={p.name} value={p.name}>{p.name}</option>
            ))}
          </select>
        )}
        {/* Reset Button */}
        <button
          onClick={() => handlePreset('flat')}
          style={{
            background: 'linear-gradient(90deg, #b0b0b0 0%, #e0e0e0 100%)',
            color: '#d00',
            border: '1.2px solid #b0b0b0',
            borderRadius: 7,
            padding: '3px 14px',
            cursor: 'pointer',
            fontWeight: 700,
            marginLeft: 10,
            boxShadow: preset === 'flat'
              ? '0 0 0 1.5px #00bcd4, 0 1px 4px #eee'
              : '0 1px 2px #eee',
            textShadow: '0 1px 0 #fff',
            fontSize: 14,
            marginBottom: 3,
            transition: 'background 0.2s, box-shadow 0.2s',
            outline: 'none',
          }}
          aria-label="Reset equalizer"
        >
          Reset
        </button>
      </div>
      {/* User Preset Save/Delete */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
        <input
          type="text"
          value={presetName}
          onChange={e => setPresetName(e.target.value)}
          placeholder="Save as..."
          style={{
            borderRadius: 6,
            border: '1.2px solid #b0b0b0',
            padding: '2px 8px',
            fontSize: 13,
            width: 110,
          }}
          aria-label="Preset name"
        />
        <button
          onClick={saveUserPreset}
          style={{
            background: '#b0e6b0',
            color: '#1c5',
            border: '1.2px solid #b0b0b0',
            borderRadius: 7,
            padding: '3px 10px',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          Save Preset
        </button>
        {userPresets.length > 0 && (
          <button
            onClick={() => {
              if (!preset || ['flat','pop','rock','jazz','classical','custom'].includes(preset)) return;
              deleteUserPreset(preset);
            }}
            style={{
              background: '#fbe3e3',
              color: '#c00',
              border: '1.2px solid #b0b0b0',
              borderRadius: 7,
              padding: '3px 10px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: 13,
            }}
            disabled={!preset || ['flat','pop','rock','jazz','classical','custom'].includes(preset)}
          >
            Delete Preset
          </button>
        )}
      </div>
      <div style={{ color: '#888', fontSize: 13, marginTop: 3, marginBottom: 0 }}>{preset === 'custom' ? 'Custom' : `Preset: ${preset}`}</div>
      <div style={{ position: 'absolute', left: 18, bottom: 8, fontSize: 11, color: '#aaa', letterSpacing: 1 }}>
        <span role="img" aria-label="metallic">⚙️</span> Studio EQ
      </div>
      {/* Mobile adjustments */}
      <style>{`
        @media (max-width: 600px) {
          .equalizer-metallic {
            max-width: 99vw !important;
            min-width: 0 !important;
            padding: 8px 1vw 8px 1vw !important;
          }
          .equalizer-metallic h2 {
            font-size: 1rem !important;
            margin-bottom: 4px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Equalizer;
