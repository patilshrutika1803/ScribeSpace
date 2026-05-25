let ctx = null
let gain = null
let source = null
let filter = null

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function stopNodes() {
  if (source) {
    try {
      source.stop()
      source.disconnect()
    } catch {
      /* already stopped */
    }
    source = null
  }
}

export function stopAmbient() {
  stopNodes()
  if (gain) {
    gain.disconnect()
    gain = null
  }
  if (filter) {
    filter.disconnect()
    filter = null
  }
}

function createNoiseBuffer(audioCtx, seconds = 2) {
  const bufferSize = audioCtx.sampleRate * seconds
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate)
  const data = buffer.getChannelData(0)
  let last = 0
  for (let i = 0; i < bufferSize; i += 1) {
    const white = Math.random() * 2 - 1
    last = (last + 0.02 * white) / 1.02
    data[i] = last * 3.5
  }
  return buffer
}

export function startAmbient(mode) {
  stopAmbient()
  if (!mode || mode === 'silence') return

  const audioCtx = getCtx()
  gain = audioCtx.createGain()
  gain.gain.value = 0.04

  filter = audioCtx.createBiquadFilter()
  source = audioCtx.createBufferSource()
  source.buffer = createNoiseBuffer(audioCtx)
  source.loop = true

  if (mode === 'rain') {
    filter.type = 'lowpass'
    filter.frequency.value = 800
    gain.gain.value = 0.06
  } else if (mode === 'forest') {
    filter.type = 'bandpass'
    filter.frequency.value = 400
    filter.Q.value = 0.8
    gain.gain.value = 0.05
  } else if (mode === 'lofi') {
    filter.type = 'lowpass'
    filter.frequency.value = 1200
    gain.gain.value = 0.035
  }

  source.connect(filter)
  filter.connect(gain)
  gain.connect(audioCtx.destination)
  source.start()
}

export const AMBIENT_MODES = ['silence', 'rain', 'lofi', 'forest']
