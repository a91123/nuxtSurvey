<template>
  <el-dropdown trigger="click" @command="switchLanguage">
    <button class="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 p-2">
      <i class="fa-solid fa-globe text-sm"></i>
      <span class="text-xs">{{ currentLocale?.name }}</span>
    </button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="locale in availableLocales"
          :key="locale.code"
          :command="locale.code"
          :class="{ 'is-active': locale.code === $i18n.locale }"
        >
          {{ locale.name }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

// 可用語言列表 - 固定顯示語言名稱
const availableLocales = computed(() => {
  return locales.value.map((l: any) => ({
    code: l.code,
    name: l.name || (l.code === 'zh-TW' ? '繁體中文' : 'English'),
  }))
})

// 當前語言
const currentLocale = computed(() => {
  return availableLocales.value.find((l) => l.code === locale.value) || availableLocales.value[0]
})

// 切換語言
const switchLanguage = async (langCode: string) => {
  await setLocale(langCode as 'zh-TW' | 'en')
  // Nuxt i18n 會自動將語言設置保存到 cookie
}
</script>
