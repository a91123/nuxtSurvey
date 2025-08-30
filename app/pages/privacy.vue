<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <!-- 麵包屑導航 -->
      <div class="mb-8">
        <Breadcrumb :items="breadcrumbs" />
      </div>

      <!-- 內容區域 -->
      <div class="bg-white rounded-lg shadow-sm p-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">隱私權政策</h1>

        <div class="prose prose-lg max-w-none">
          <p class="text-gray-600 mb-6">最後更新日期：2025年1月</p>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">1. 政策概述</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              SurveyFlow（以下簡稱「我們」或「本服務」）非常重視您的隱私權。本隱私權政策說明我們如何收集、使用、儲存和保護您的個人資訊。
            </p>
            <p class="text-gray-700 leading-relaxed">
              使用本服務即表示您同意本隱私權政策的條款。如果您不同意本政策，請勿使用本服務。
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">2. 資訊收集</h2>
            <h3 class="text-xl font-medium text-gray-900 mb-3">2.1 自動收集的資訊</h3>
            <ul class="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>瀏覽器類型和版本</li>
              <li>作業系統資訊</li>
              <li>IP 位址（已匿名化處理）</li>
              <li>訪問時間和頁面瀏覽記錄</li>
              <li>使用功能的統計資訊</li>
            </ul>

            <h3 class="text-xl font-medium text-gray-900 mb-3">2.2 您主動提供的資訊</h3>
            <ul class="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>創建的問卷內容和設定</li>
              <li>問卷回應數據</li>
              <li>本地儲存的偏好設定</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">3. 資訊使用</h2>
            <p class="text-gray-700 leading-relaxed mb-4">我們收集的資訊僅用於以下目的：</p>
            <ul class="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>提供和改善服務功能</li>
              <li>分析使用模式以優化用戶體驗</li>
              <li>確保服務的安全性和穩定性</li>
              <li>回應用戶的技術支援需求</li>
              <li>進行匿名化的統計分析</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">4. 資料儲存與安全</h2>
            <h3 class="text-xl font-medium text-gray-900 mb-3">4.1 本地儲存</h3>
            <p class="text-gray-700 leading-relaxed mb-4">
              您的問卷數據主要儲存在您的瀏覽器本地儲存空間中，我們無法直接訪問這些數據。這確保了您的資料隱私和安全。
            </p>

            <h3 class="text-xl font-medium text-gray-900 mb-3">4.2 安全措施</h3>
            <ul class="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>使用 HTTPS 加密傳輸</li>
              <li>定期進行安全漏洞檢查</li>
              <li>實施適當的技術和組織安全措施</li>
              <li>限制員工對用戶數據的訪問權限</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">5. 資訊分享</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              我們不會出售、交易或以其他方式轉讓您的個人資訊給第三方，除非：
            </p>
            <ul class="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>獲得您的明確同意</li>
              <li>法律要求或法院命令</li>
              <li>保護我們的權利、財產或安全</li>
              <li>與可信任的服務提供商合作（在嚴格的保密協議下）</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">6. Cookie 和追蹤技術</h2>
            <p class="text-gray-700 leading-relaxed mb-4">我們使用 Cookie 和類似技術來：</p>
            <ul class="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>記住您的語言偏好</li>
              <li>分析網站使用情況</li>
              <li>改善用戶體驗</li>
            </ul>
            <p class="text-gray-700 leading-relaxed">
              您可以通過瀏覽器設定控制 Cookie 的使用，但這可能會影響某些功能的正常運作。
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">7. 您的權利</h2>
            <p class="text-gray-700 leading-relaxed mb-4">您有權：</p>
            <ul class="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>訪問您的個人資訊</li>
              <li>要求更正不準確的資訊</li>
              <li>要求刪除您的個人資訊</li>
              <li>反對處理您的個人資訊</li>
              <li>要求資料可攜性</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">8. 兒童隱私</h2>
            <p class="text-gray-700 leading-relaxed">
              本服務不針對 13 歲以下的兒童。我們不會有意收集 13
              歲以下兒童的個人資訊。如果我們發現收集了此類資訊，將立即刪除。
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">9. 政策變更</h2>
            <p class="text-gray-700 leading-relaxed">
              我們可能會不時更新本隱私權政策。任何重大變更都會在本頁面上公佈，並在適當情況下通過其他方式通知您。建議您定期查看本政策以了解最新變更。
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">10. 聯絡我們</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              如果您對本隱私權政策有任何疑問或需要行使您的權利，請透過以下方式聯絡我們：
            </p>
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-gray-700">
                <strong>SurveyFlow 團隊</strong><br />
                網站：<a href="https://nuxt-survey.vercel.app" class="text-blue-600 hover:underline"
                  >https://nuxt-survey.vercel.app</a
                ><br />
                如有隱私相關問題，我們將在 7 個工作天內回覆您的詢問。
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// SEO 設定
useSeoMeta({
  title: '隱私權政策 - SurveyFlow',
  description:
    'SurveyFlow 隱私權政策。了解我們如何收集、使用、儲存和保護您的個人資訊。我們重視您的隱私權，採用本地儲存和加密傳輸等安全措施保護您的數據。',
  keywords: 'SurveyFlow,隱私權政策,個人資訊保護,資料安全,本地儲存,加密傳輸,privacy policy',
  ogTitle: '隱私權政策 - SurveyFlow',
  ogDescription: 'SurveyFlow 隱私權政策，了解我們如何保護您的個人資訊和數據安全。',
  ogImage: 'https://nuxt-survey.vercel.app/og-image.svg',
  ogUrl: 'https://nuxt-survey.vercel.app/privacy',
  robots: 'index, follow',
})

const { t } = useI18n()

const breadcrumbs = [
  {
    label: t('common.home'),
    to: '/',
    icon: 'fa-solid fa-home',
  },
  {
    label: '隱私權政策',
    icon: 'fa-solid fa-shield-halved',
  },
]
</script>

<style scoped>
.prose {
  color: inherit;
}
.prose h2 {
  color: inherit;
  font-weight: 600;
}
.prose h3 {
  color: inherit;
  font-weight: 500;
}
.prose a {
  color: #2563eb;
}
.prose a:hover {
  text-decoration: underline;
}
</style>
