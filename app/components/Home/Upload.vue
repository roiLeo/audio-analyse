<template>
  <div>
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

    <MetadataDisplay
      :file="file"
      :metadata="metadata"
      :bpm="bpm"
      :song-key="songKey"
      :camelot-key="camelotKey"
      :camelot-color="camelotColor"
      :duration-formatted="formatTime(duration)"
      :current-time-formatted="formatTime(currentTime)"
      :is-playing="isPlaying"
      @clear="file = null"
    />

    <div v-show="file">
      <div id="waveform" class="my-4" />
    </div>

    <PlayerBar
      :file="file"
      :cover-image="metadata?.coverImage?.dataUrl || ''"
      :title="metadata?.title || 'Untitled'"
      :artist="metadata?.artist || 'Unknown Artist'"
      :current-time-formatted="formatTime(currentTime)"
      :duration-formatted="formatTime(duration)"
      :is-playing="isPlaying"
      @cue-down="onCueDown"
      @cue-up="onCueUp"
      @play-pause="onPlayPause"
    />
  </div>
</template>

<script lang="ts" setup>
const {
  file,
  bpm,
  isPlaying,
  duration,
  currentTime,
  metadata,
  songKey,
  camelotKey,
  camelotColor,
  formatTime,
  onPlayPause,
  onCueDown,
  onCueUp,
} = useAudioPlayer()
</script>
