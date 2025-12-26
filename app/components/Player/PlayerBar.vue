<template>
  <div
    v-show="file"
    class="z-20 fixed bottom-0 left-0 right-0 bg-default border-t border-muted shadow-lg"
  >
    <div class="max-w-7xl mx-auto px-4 py-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <img
            class="size-14 rounded-md"
            :src="coverImage"
            :alt="title"
          >
          <div class="text-sm">
            <p class="font-semibold">
              {{ title || 'Untitled' }}
            </p>
            <p class="text-muted">
              {{ artist || 'Unknown Artist' }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <span class="text-xs text-toned">{{ currentTimeFormatted }} / {{ durationFormatted }}</span>

          <PlayerControls
            :is-playing="isPlaying"
            @cue-down="$emit('cue-down')"
            @cue-up="$emit('cue-up')"
            @play-pause="$emit('play-pause')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  file: File | null
  title: string
  artist: string
  coverImage: string
  currentTimeFormatted: string
  durationFormatted: string
  isPlaying: boolean
}>()

defineEmits<{
  'cue-down': []
  'cue-up': []
  'play-pause': []
}>()
</script>
