<template>
  <section class="flex items-center gap-x-3">
    <UAvatar
      :src="global.picture.dark"
      :alt="global.picture.alt"
      size="3xl"
    />

    <div class="grow">
      <h1 class="text-lg font-medium text-neutral-800 dark:text-neutral-200">
        {{ global.name }}
      </h1>
      <p class="text-sm text-neutral-600 dark:text-neutral-400">
        {{ global.title }}
      </p>
    </div>

    <div>
      <UButton
        :color="global.available ? 'success' : 'error'"
        size="xl"
        variant="ghost"
        class="gap-2"
        :to="global.available ? global.meetingLink : ''"
        :label="global.available ? 'Available' : 'Not available'"
      >
        <template #leading>
          <span class="relative flex size-2">
            <span
              class="absolute inline-flex size-full rounded-full opacity-75"
              :class="global.available ? 'bg-success animate-ping' : 'bg-error'"
            />
            <span
              class="relative inline-flex size-2 scale-90 rounded-full"
              :class="global.available ? 'bg-success' : 'bg-error'"
            />
          </span>
        </template>
      </UButton>
    </div>
  </section>
</template>

<script lang="ts" setup>
const { global } = useAppConfig()
</script>
