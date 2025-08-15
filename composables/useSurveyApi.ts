// API 模擬服務 - 使用 store 來模擬後端行為
import type { CreateSurveyPayload, UpdateSurveyPayload } from '../stores/surveys'
import { useSurveysStore } from '../stores/surveys'
import { computed } from 'vue'
export function useSurveyApi() {
  const surveysStore = useSurveysStore()

  const api = {
    // GET /api/surveys
    async getSurveys() {
      try {
        return await surveysStore.fetchSurveys()
      } catch (error: any) {
        throw new Error(error.message || '獲取問卷列表失敗')
      }
    },

    // GET /api/surveys/:id
    async getSurvey(id: string) {
      try {
        return await surveysStore.fetchSurvey(id)
      } catch (error: any) {
        const err = new Error(error.message || '獲取問卷失敗')
        if (error.statusCode) {
          ;(err as any).statusCode = error.statusCode
        }
        throw err
      }
    },

    // POST /api/surveys
    async createSurvey(payload: CreateSurveyPayload) {
      try {
        const result = await surveysStore.createSurvey(payload)
        return {
          success: true,
          message: '問卷創建成功',
          data: result
        }
      } catch (error: any) {
        const err = new Error(error.message || '創建問卷失敗')
        if (error.statusCode) {
          ;(err as any).statusCode = error.statusCode
        }
        throw err
      }
    },

    // PUT /api/surveys/:id
    async updateSurvey(id: string, payload: UpdateSurveyPayload) {
      try {
        const result = await surveysStore.updateSurvey(id, payload)
        return {
          success: true,
          message: '問卷更新成功',
          data: result
        }
      } catch (error: any) {
        const err = new Error(error.message || '更新問卷失敗')
        if (error.statusCode) {
          ;(err as any).statusCode = error.statusCode
        }
        throw err
      }
    },

    // DELETE /api/surveys/:id
    async deleteSurvey(id: string) {
      try {
        return await surveysStore.deleteSurvey(id)
      } catch (error: any) {
        const err = new Error(error.message || '刪除問卷失敗')
        if (error.statusCode) {
          ;(err as any).statusCode = error.statusCode
        }
        throw err
      }
    }
  }

  return {
    ...api,
    loading: computed(() => surveysStore.loading),
    error: computed(() => surveysStore.error),
    clearError: surveysStore.clearError
  }
}
