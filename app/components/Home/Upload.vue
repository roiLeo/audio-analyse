<template>
  <div class="my-6">
    <UFileUpload
      v-model="file"
      accept="audio/*"
      :max-size="10 * 1024 * 1024"
      :multiple="false"
      file-icon="i-lucide-music"
      label="Drop your audio here"
      description="MP3, WAV, or FLAC files only"
      class="min-h-48"
    />

    <div
      id="waveform"
      class="mt-2"
    />
    <div
      v-if="file"
      class="mt-4"
    >
      <h3 class="text-lg font-semibold">
        Uploaded File:
      </h3>
      <p>{{ file.name }} ({{ (file.size / 1024).toFixed(2) }} KB)</p>
      <p>BPM: {{ bpm }}</p>
      <p>Current time: {{ formatTime(currentTime) }}</p>
      <p>Total duration: {{ formatTime(duration) }}</p>

      <p>Status: {{ isPlaying ? 'Playing' : 'Paused' }}</p>
      <div class="progress-bar">
        <div
          class="progress"
          :style="{ width: `${(currentTime / duration) * 100}%` }"
        />
      </div>

      <UButton @click="onPlayPause">
        {{ isPlaying ? 'Pause' : 'Play' }}
      </UButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import WaveSurfer from 'wavesurfer.js'
import ZoomPlugin from 'wavesurfer.js/dist/plugins/zoom.esm.js'
import Minimap from 'wavesurfer.js/dist/plugins/minimap.esm.js'
import Hover from 'wavesurfer.js/dist/plugins/hover.esm.js'

const file = ref<File | null>(null)
const audioContext = ref<WaveSurfer | any>()
const bpm = ref<number | null>(null)
const bpmDetective = ref<any>(null)
const isPlaying = ref(false)
const duration = ref(0)
const currentTime = ref(0)

const formatTime = (seconds: number) => [seconds / 60, seconds % 60].map(v => `0${Math.floor(v)}`.slice(-2)).join(':')

const onPlayPause = () => {
  if (audioContext.value) {
    if (isPlaying.value) {
      audioContext.value.pause()
    }
    else {
      audioContext.value.play()
    }
  }
}

onMounted(() => {
  if (!audioContext.value) {
    initializeWaveSurfer()
  }
  if (typeof window !== 'undefined') {
    import('bpm-detective').then((module) => {
      bpmDetective.value = module.default
    })
  }
})
const initializeWaveSurfer = () => {
  if (audioContext.value) {
    audioContext.value.destroy()
  }
  audioContext.value = null

  audioContext.value = WaveSurfer.create({
    container: '#waveform',
    waveColor: '#ddd',
    progressColor: '#3b82f6',
    minPxPerSec: 100,
    plugins: [
      Hover.create({
        lineColor: '#ff0000',
        lineWidth: 2,
        labelBackground: '#555',
        labelColor: '#fff',
        labelSize: '11px',
        labelPreferLeft: false,
      }),
      Minimap.create({
        height: 30,
        waveColor: '#ddd',
        progressColor: '#999',
      }),
      ZoomPlugin.create({
        scale: 0.5,
        maxZoom: 100,
      }),
    ],
  })
  audioContext.value.on('click', () => {
    isPlaying.value = true
    audioContext.value.play()
  })
  audioContext.value.on('ready', () => {
    duration.value = audioContext.value.getDuration()
  })
  audioContext.value.on('audioprocess', () => {
    currentTime.value = audioContext.value.getCurrentTime()
  })
  audioContext.value.on('pause', () => {
    isPlaying.value = false
  })
  audioContext.value.on('play', () => {
    isPlaying.value = true
  })
}

watch(file, (newFile) => {
  if (newFile) {
    const reader = new FileReader()
    reader.onload = (e) => {
      audioContext.value.loadBlob(new Blob([e.target?.result as ArrayBuffer]))

      // Run BPM detection
      if (typeof window !== 'undefined' && bpmDetective.value) {
        const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
        audioContext.decodeAudioData(e.target?.result as ArrayBuffer, (buffer) => {
          bpm.value = bpmDetective.value(buffer)
          console.log(`Detected BPM: ${bpm.value}`)
        })

        console.log(`Detected BPM: ${bpm.value}`)
      }
    }
    reader.readAsArrayBuffer(newFile)
  }
})
</script>
