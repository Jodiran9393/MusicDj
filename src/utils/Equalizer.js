// Equalizer utility using Web Audio API
// Usage: eq = new Equalizer(audioElement); eq.setBand(0, value); eq.setPreset('pop');

const BAND_CONFIG = [
  { freq: 60, type: 'lowshelf' },
  { freq: 170, type: 'peaking' },
  { freq: 350, type: 'peaking' },
  { freq: 1000, type: 'peaking' },
  { freq: 3500, type: 'peaking' },
  { freq: 10000, type: 'highshelf' }
];

const PRESETS = {
  flat:   [0, 0, 0, 0, 0, 0],
  pop:    [0, 2, 4, 2, 0, -2],
  rock:   [4, 2, -2, -2, 2, 4],
  jazz:   [3, 2, 0, 2, 3, 4],
  classical: [0, 0, 2, 4, 2, 0],
};

export default class Equalizer {
  constructor(audioElement) {
    this.audioElement = audioElement;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.source = this.ctx.createMediaElementSource(audioElement);
    this.filters = BAND_CONFIG.map(({ freq, type }) => {
      const f = this.ctx.createBiquadFilter();
      f.type = type;
      f.frequency.value = freq;
      f.gain.value = 0;
      return f;
    });
    // Connect filters in series
    this.source.connect(this.filters[0]);
    for (let i = 0; i < this.filters.length - 1; i++) {
      this.filters[i].connect(this.filters[i + 1]);
    }
    this.filters[this.filters.length - 1].connect(this.ctx.destination);
  }

  setBand(idx, value) {
    if (this.filters[idx]) {
      this.filters[idx].gain.value = value;
    }
  }

  setBands(values) {
    values.forEach((v, i) => this.setBand(i, v));
  }

  setPreset(name) {
    if (PRESETS[name]) {
      this.setBands(PRESETS[name]);
    }
  }

  getBands() {
    return this.filters.map(f => f.gain.value);
  }

  getPresets() {
    return Object.keys(PRESETS);
  }

  reset() {
    this.setPreset('flat');
  }
}
