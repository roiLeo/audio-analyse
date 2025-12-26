<template>
  <div class="flex items-center gap-4">
    <UButton
      class="rounded-full"
      size="xl"
      color="warning"
      @mousedown="$emit('cue-down')"
      @mouseup="$emit('cue-up')"
      @mouseleave="$emit('cue-up')"
    >
      CUE
    </UButton>
    <UButton
      :icon="isPlaying ? 'i-lucide-pause' : 'i-lucide-play'"
      class="rounded-full"
      size="xl"
      @click="$emit('play-pause')"
    >
      {{ isPlaying ? 'Pause' : 'Play' }}
    </UButton>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  isPlaying: boolean
}>()

defineEmits<{
  'cue-down': []
  'cue-up': []
  'play-pause': []
}>()
</script>
