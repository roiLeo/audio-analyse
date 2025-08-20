<template>
  <UApp>
    <div class="flex flex-col min-h-screen">

    <DefaultNavbar />

    <div class="flex-1 mx-auto max-w-screen-xl overflow-x-visible py-8 md:px-8 w-full">
      <UContainer class="w-full">
        <!-- PROFILE AVATAR -->
        <!-- <HomeProfile /> -->

        <!-- FILE UPLOAD -->
        <HomeUpload />
      </UContainer>
    </div>

      <DefaultFooter />
    </div>
  </UApp>
</template>
