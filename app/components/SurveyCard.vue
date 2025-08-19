<template>
  <el-card shadow="hover" class="relative h-full">
    <div class="text-base sm:text-lg font-semibold mb-2 pr-8">{{ survey.title }}</div>
    <div class="text-slate-600 mb-3 min-h-[1.5rem] text-sm">
      {{
        survey.description && survey.description.length > 50
          ? survey.description.substring(0, 47) + '...'
          : survey.description
      }}
    </div>
    <div class="text-sm text-slate-500 mb-2">
      {{ $t('survey.status') }}：<span :class="survey.status === 'published' ? 'text-green-600' : 'text-yellow-600'">
        {{ $t(`survey.${survey.status}`) }}
      </span>
    </div>
    <div class="text-xs sm:text-sm text-slate-500 mb-2">
      {{ $t('survey.questions') }}：{{ survey.questions }} · {{ $t('survey.responses') }}：{{ survey.responses }}
    </div>
    <div class="text-xs text-slate-400 mb-2">{{ $t('survey.updated_at') }}：{{ formatDateTime(survey.updatedAt) }}</div>
    <template #footer>
      <div class="flex flex-col sm:flex-row gap-2 justify-end">
        <div class="flex gap-2">
          <NuxtLink :to="`/editor/${survey.id}`" class="flex-1 sm:flex-none">
            <el-button size="small" plain class="w-full sm:w-auto">{{ $t('common.edit') }}</el-button>
          </NuxtLink>
          <NuxtLink v-if="survey.status === 'published'" :to="`/stats/${survey.id}`" class="flex-1 sm:flex-none">
            <el-button size="small" plain class="w-full sm:w-auto">{{ $t('header.statistics') }}</el-button>
          </NuxtLink>
        </div>
        <el-button
          v-if="survey.status === 'published'"
          size="small"
          plain
          class="w-full sm:w-auto"
          @click="$emit('copy-link', survey.id.toString())"
        >
          {{ $t('survey.copy_link') }}
        </el-button>
        <button
          class="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
          @click="$emit('delete', survey.id.toString(), survey.title)"
          :title="$t('survey.delete_confirm')"
        >
          <i class="fa-regular fa-trash-can text-sm"></i>
        </button>
      </div>
    </template>
  </el-card>
</template>

<script setup lang="ts">
import type { SurveyListAPIItem } from '~~/types/index'

defineProps<{
  survey: SurveyListAPIItem
}>()

defineEmits<{
  delete: [surveyId: string, surveyTitle: string]
  'copy-link': [surveyId: string]
}>()

const { t } = useI18n()
const { formatDateTime } = useDateFormatter()
</script>
