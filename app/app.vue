<template>
  <NuxtLoadingIndicator />
  <el-config-provider :locale="elementLocale">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </el-config-provider>
</template>
<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import zhTw from 'element-plus/es/locale/lang/zh-tw'
import en from 'element-plus/es/locale/lang/en'

const { locale } = useI18n()

const elementLocale = computed(() => {
  switch (locale.value) {
    case 'zh-TW':
      return zhTw
    case 'en':
      return en
    default:
      return zhTw
  }
})
</script>
