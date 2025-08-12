<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-900">
    <header class="fixed top-0 inset-x-0 z-50 h-16 bg-white shadow">
      <div class="max-w-7xl mx-auto h-full px-4 flex justify-between items-center">
        <h1 class="text-lg font-bold">我的問卷系統</h1>
        <nav class="space-x-4">
          <NuxtLink to="/">首頁</NuxtLink>
          <NuxtLink to="/about">關於</NuxtLink>
        </nav>
      </div>
    </header>
    <main class="flex-1 min-h-0 pt-16 pb-12 px-6">
      <slot />
    </main>
    <footer class="fixed bottom-0 inset-x-0 z-50 h-12 bg-white shadow">
      <div class="max-w-7xl mx-auto h-full px-4 text-center text-sm text-gray-500 flex items-center justify-center">
        © 2025 我的問卷系統
      </div>
    </footer>
  </div>
</template>
