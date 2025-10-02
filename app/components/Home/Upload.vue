<template>
  <div class="my-6">
    <UFileUpload
      v-if="!file"
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
      v-if="file"
      class="mt-4 space-y-4"
    >
      <h3 class="text-lg font-semibold mb-4">
        Uploaded File: <span class="text-sm">{{ file.name }} ({{ (file.size / 1024).toFixed(2) }} KB)</span>
        <UButton
          size="xs"
          variant="subtle"
          color="neutral"
          icon="i-lucide-circle-x"
          class="rounded-full"
          @click="file = null"
        />
      </h3>

      <div class="grid sm:grid-cols-2 gap-4">
        <div class="space-y-2">
          <img
            :src="metadata?.coverImage?.dataUrl"
            :alt="file.name"
          >
        </div>
        <dl class="py-4 space-y-2">
          <div>
            <dt class="text-muted text-xs">
              Title
            </dt>
            <dd>{{ metadata?.title }}</dd>
          </div>

          <div>
            <dt class="text-muted text-xs">
              Artist
            </dt>
            <dd>{{ metadata?.artist }}</dd>
          </div>

          <div>
            <dt class="text-muted text-xs">
              Year
            </dt>
            <dd>{{ metadata?.year }}</dd>
          </div>

          <div>
            <dt class="text-muted text-xs">
              Genre
            </dt>
            <dd>{{ metadata?.genre?.join(', ') }}</dd>
          </div>

          <div>
            <dt class="text-muted text-xs">
              BPM
            </dt>
            <dd>{{ bpm }}</dd>
          </div>

          <div>
            <dt class="text-muted text-xs">
              Key
            </dt>
            <dd>
              {{ songKey }}
              <span
                v-if="camelotKey !== '-'"
                class="ml-2 px-2 py-1 rounded-lg font-semibold"
                :style="{
                  background: camelotColor,
                  color: '#181717',
                }"
              >
                {{ camelotKey }}
              </span>
            </dd>
          </div>

          <div>
            <dt class="text-muted text-xs">
              Total duration
            </dt>
            <dd>{{ formatTime(duration) }}</dd>
          </div>

          <div>
            <dt class="text-muted text-xs">
              Current time
            </dt>
            <dd>{{ formatTime(currentTime) }}</dd>
          </div>

          <div>
            <dt class="text-muted text-xs">
              Status
            </dt>
            <dd>{{ isPlaying ? 'Playing' : 'Paused' }}</dd>
          </div>
        </dl>
      </div>
    </div>

    <div v-show="file">
      <div
        id="waveform"
        class="my-4"
      />
      <div class="flex items-center gap-4">
        <UButton
          class="rounded-full"
          size="xl"
          color="warning"
          @mousedown="onCueDown"
          @mouseup="onCueUp"
          @mouseleave="onCueUp"
        >
          CUE
        </UButton>
        <UButton
          :icon="isPlaying ? 'i-lucide-pause' : 'i-lucide-play'"
          class="rounded-full"
          size="xl"
          @click="onPlayPause"
        >
          {{ isPlaying ? 'Pause' : 'Play' }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Meyda from 'meyda'
import WaveSurfer from 'wavesurfer.js'
import ZoomPlugin from 'wavesurfer.js/dist/plugins/zoom.esm.js'
import Minimap from 'wavesurfer.js/dist/plugins/minimap.esm.js'
import Hover from 'wavesurfer.js/dist/plugins/hover.esm.js'
import type { MP3Metadata } from '~/types'

const camelotMap: Record<string, string> = {
  'C': '8B', 'C#': '3B', 'D': '10B', 'D#': '5B', 'E': '12B', 'F': '7B',
  'F#': '2B', 'G': '9B', 'G#': '4B', 'A': '11B', 'A#': '6B', 'B': '1B',
}

const camelotColors: Record<string, string> = {
  '1A': '#56f1da', '2A': '#7df2aa', '3A': '#aef589', '4A': '#e8daa1',
  '1B': '#01edca', '2B': '#3cee81', '3B': '#86f24f', '4B': '#dfca73',
  '5A': '#febfa7', '6A': '#fdafb7', '7A': '#fdaacc', '8A': '#f2abe4',
  '5B': '#ffa07c', '6B': '#ff8894', '7B': '#ff81b4', '8B': '#ee82d9',
  '9A': '#ddb4fd', '10A': '#becdfd', '11A': '#8ee4f9', '12A': '#55f0f0',
  '9B': '#ce8fff', '10B': '#9fb6ff', '11B': '#56d9f9', '12B': '#00ebeb',
}

const file = ref<File | null>(null)
const audioContext = ref<WaveSurfer>()
const bpm = ref<number | null>(null)
const bpmDetective = ref<unknown | null>(null)
const isPlaying = ref(false)
const duration = ref(0)
const cuePoint = ref(0)
const currentTime = ref(0)
const metadata = ref<MP3Metadata | null>(null)
const songKey = ref<string | null>(null)

const camelotKey = computed(() => songKey.value ? camelotMap[songKey.value] ?? '-' : '-')
const camelotColor = computed(() => camelotColors[camelotKey.value] ?? '#ccc')

const formatTime = (seconds: number) => [seconds / 60, seconds % 60].map(v => `0${Math.floor(v)}`.slice(-2)).join(':')

const onPlayPause = () => {
  if (!audioContext.value) return

  if (isPlaying.value) {
    audioContext.value.pause()
  }
  else {
    audioContext.value.play()
  }
}

const onCueDown = () => {
  if (!audioContext.value) return

  audioContext.value.seekTo(cuePoint.value)
  audioContext.value.play()
  isPlaying.value = true

  if (!isPlaying.value) {
    cuePoint.value = audioContext.value.getCurrentTime()
  }
}

const onCueUp = () => {
  if (!audioContext.value) return

  audioContext.value.pause()
  audioContext.value.seekTo(cuePoint.value)
  isPlaying.value = false
  currentTime.value = cuePoint.value
}

const detectKey = async (audioBuffer: AudioBuffer) => {
  const channelData = audioBuffer.getChannelData(0)
  const windowSize = 2048
  const chromaSum = Array(12).fill(0)
  for (let i = 0; i < channelData.length - windowSize; i += windowSize) {
    const frame = channelData.slice(i, i + windowSize)
    const features = Meyda.extract('chroma', frame)
    const chroma = Array.isArray(features) ? features : (features && (features as unknown).chroma)
    if (Array.isArray(chroma)) {
      chroma.forEach((v, idx) => (chromaSum[idx] += v))
    }
  }
  const maxIdx = chromaSum.indexOf(Math.max(...chromaSum))
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  songKey.value = notes[maxIdx] ?? null
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
  audioContext.value = undefined

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
  audioContext.value.on('ready', () => {
    duration.value = audioContext.value?.getDuration() ?? 0
  })
  audioContext.value.on('audioprocess', () => {
    currentTime.value = audioContext.value?.getCurrentTime() ?? 0
  })
  audioContext.value.on('pause', () => {
    isPlaying.value = false
  })
  audioContext.value.on('play', () => {
    isPlaying.value = true
  })
}

watch(file, async (newFile) => {
  if (newFile) {
    try {
      metadata.value = await extractMetadata(newFile)
      console.log('Extracted metadata:', metadata.value)
    }
    catch (error) {
      console.error('Error extracting metadata:', error)
      metadata.value = null
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      audioContext.value?.loadBlob(new Blob([e.target?.result as ArrayBuffer]))

      // Run BPM & Key detection
      if (typeof window !== 'undefined' && bpmDetective.value) {
        const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
        audioContext.decodeAudioData(e.target?.result as ArrayBuffer, (buffer) => {
          bpm.value = bpmDetective.value(buffer)
          detectKey(buffer)
          console.log(`Detected BPM: ${bpm.value}`)
        })

        console.log(`Detected BPM: ${bpm.value}`)
      }
    }
    reader.readAsArrayBuffer(newFile)
  }
})
</script>
