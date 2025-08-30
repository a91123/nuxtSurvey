<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-900">
    <header class="fixed top-0 inset-x-0 z-50 h-16 bg-white shadow">
      <div class="max-w-7xl mx-auto h-full px-4 flex justify-between items-center">
        <!-- 主導航 - 可點擊的標題 -->
        <div class="flex items-center space-x-6">
          <NuxtLink to="/" class="text-lg font-bold text-blue-600 hover:text-blue-700 transition-colors duration-200">
            SurveyFlow
          </NuxtLink>
        </div>

        <!-- 右側工具 -->
        <div class="flex items-center space-x-4">
          <!-- 語言切換 -->
          <LanguageSwitcher />
        </div>
      </div>
    </header>
    <main class="flex-1 pt-16 pb-12 min-h-screen">
      <slot />
    </main>
    <footer class="fixed bottom-0 inset-x-0 z-50 h-12 bg-white shadow">
      <div class="max-w-7xl mx-auto h-full px-4 text-center text-sm text-gray-500 flex items-center justify-center">
        © 2025 {{ $t('header.title') }}
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>
