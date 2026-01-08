<template>
  <UApp>
    <div class="flex flex-col min-h-screen">
      <DefaultNavbar />

      <div class="flex-1 mx-auto max-w-7xl overflow-x-visible py-8 md:px-8 w-full">
        <UContainer class="w-full">
          <!-- FILE UPLOAD -->
          <HomeUpload />
        </UContainer>
      </div>

      <DefaultFooter />
    </div>
  </UApp>
</template>
