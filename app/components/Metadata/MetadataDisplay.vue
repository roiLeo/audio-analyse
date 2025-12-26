<template>
  <div
    v-if="file"
    class="space-y-4"
  >
    <h3 class="text-lg font-semibold mb-4">
      Uploaded File: <span class="text-sm">{{ file.name }} ({{ (file.size / 1024).toFixed(2) }} KB)</span>
      <UButton
        size="xs"
        variant="subtle"
        color="neutral"
        icon="i-lucide-circle-x"
        class="rounded-full"
        @click="$emit('clear')"
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
        <MetadataItem label="Title" :value="metadata?.title" />
        <MetadataItem label="Artist" :value="metadata?.artist" />
        <MetadataItem label="Year" :value="metadata?.year" />
        <MetadataItem label="Genre" :value="metadata?.genre?.join(', ')" />
        <MetadataItem label="BPM" :value="bpm" />
        <div>
          <dt class="text-muted text-xs">Key</dt>
          <dd>
            {{ songKey }}
            <span
              v-if="camelotKey !== '-'"
              class="ml-2 px-2 py-1 rounded-lg font-semibold"
              :style="{ background: camelotColor, color: '#181717' }"
            >
              {{ camelotKey }}
            </span>
          </dd>
        </div>
        <MetadataItem label="Total duration" :value="durationFormatted" />
        <MetadataItem label="Current time" :value="currentTimeFormatted" />
        <MetadataItem label="Status" :value="isPlaying ? 'Playing' : 'Paused'" />
      </dl>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { MP3Metadata } from '~/types'

defineProps<{
  file: File | null
  metadata: MP3Metadata | null
  bpm: number | null
  songKey: string | null
  camelotKey: string
  camelotColor: string
  durationFormatted: string
  currentTimeFormatted: string
  isPlaying: boolean
}>()

defineEmits<{
  clear: []
}>()
</script>
