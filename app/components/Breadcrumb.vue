<template>
  <nav class="flex items-center space-x-2 text-sm text-gray-600 mb-6" :aria-label="$t('breadcrumb.aria_label')">
    <ol class="flex items-center space-x-2" itemscope itemtype="https://schema.org/BreadcrumbList">
      <li
        v-for="(item, index) in breadcrumbs"
        :key="index"
        class="flex items-center"
        itemprop="itemListElement"
        itemscope
        itemtype="https://schema.org/ListItem"
      >
        <!-- 分隔符 -->
        <i v-if="index > 0" class="fa-solid fa-chevron-right text-gray-400 text-xs mx-2" aria-hidden="true"></i>

        <!-- 最後一項（當前頁面） -->
        <span
          v-if="index === breadcrumbs.length - 1"
          class="font-medium text-gray-800"
          itemprop="name"
          :aria-current="'page'"
        >
          <i v-if="item.icon" :class="item.icon" class="mr-1.5"></i>
          {{ item.label }}
          <meta itemprop="item" :content="getFullUrl(item.to || $route.path)" />
        </span>

        <!-- 可點擊的項目 -->
        <NuxtLink
          v-else
          :to="item.to"
          class="hover:text-blue-600 transition-colors duration-200 flex items-center"
          itemprop="item"
        >
          <span itemprop="name">
            <i v-if="item.icon" :class="item.icon" class="mr-1.5"></i>
            {{ item.label }}
          </span>
        </NuxtLink>
        <!-- SEO 結構化數據 -->
        <meta itemprop="position" :content="(index + 1).toString()" />
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
interface BreadcrumbItem {
  label: string
  to?: string
  icon?: string
}

interface Props {
  items: BreadcrumbItem[]
}

const props = defineProps<Props>()
const route = useRoute()

// 總是包含首頁的完整麵包屑
const breadcrumbs = computed(() => {
  const { t } = useI18n()
  const homeBreadcrumb: BreadcrumbItem = {
    label: t('common.home'),
    to: '/',
    icon: 'fa-solid fa-home',
  }

  // 如果沒有項目或第一個項目不是首頁，則加上首頁
  if (props.items.length === 0) {
    return [homeBreadcrumb] // 只有首頁
  }

  if (props.items[0]?.to !== '/') {
    return [homeBreadcrumb, ...props.items]
  }

  return props.items
})

// 生成完整 URL
const getFullUrl = (path: string) => {
  const config = useRuntimeConfig()
  const baseUrl = 'https://nuxt-survey.vercel.app'
  return `${baseUrl}${path}`
}
</script>

<style scoped>
/* 響應式設計 */
@media (max-width: 640px) {
  nav {
    font-size: 0.75rem;
  }

  .fa-chevron-right {
    margin-left: 0.25rem;
    margin-right: 0.25rem;
  }
}

/* hover 效果 */
a:hover {
  color: rgb(96 165 250);
}
</style>
