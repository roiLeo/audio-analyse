<template>
  <div>
    <dt class="text-muted text-xs">
      {{ label }}
    </dt>
    <dd>{{ value || '-' }}</dd>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  label: string
  value: string | number | null | undefined
}>()
</script>
