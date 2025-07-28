<template>
  <header class="sticky top-0 inset-x-0 flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full text-sm">
    <nav class="gap-2 mt-4 relative py-2.5 flex items-center justify-between px-4 mx-auto bg-muted/80 backdrop-blur-sm rounded-full border border-muted/50 shadow-lg shadow-neutral-950/5">
      <NuxtLink
        class="group relative w-full flex items-center gap-1.5 font-medium text-sm before:absolute before:z-[-1] before:rounded-md focus:outline-none focus-visible:outline-none dark:focus-visible:outline-none focus-visible:before:ring-inset focus-visible:before:ring-2 focus-visible:before:ring-inverted before:inset-x-px before:inset-y-0 text-highlighted px-2 py-1"
        to="/"
      >
        Home
      </NuxtLink>
      <div class="flex">
        <ColorModeButton />
      </div>
    </nav>
  </header>
</template>
