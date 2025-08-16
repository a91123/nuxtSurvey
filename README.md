# 🧾 我的問卷系統

> 現代化線上問卷調查平台，提供直觀的問卷建立、數據收集和統計分析功能

## ✨ 功能特色

### 📝 問卷管理

- **拖拽式問卷建立** - 支援多種題型（文字、數字、日期、時間、單選、多選）
- **即時預覽** - 建立過程中即時查看問卷效果
- **草稿與發布** - 支援草稿保存和正式發布管理
- **問卷複製與分享** - 一鍵複製問卷連結

### 📊 數據分析

- **即時統計** - 回覆數據即時更新
- **響應詳情** - 查看每一筆問卷回覆詳情

### 🎨 用戶體驗

- **響應式設計** - 完美適配桌面和行動裝置
- **現代化 UI** - 使用 Element Plus + Tailwind CSS
- **流暢動畫** - 提供優雅的過渡效果
- **SEO 優化** - 完整的 Meta 標籤和結構化數據

## 🛠️ 技術架構

### 前端技術

- **[Nuxt 4](https://nuxt.com/)** - Vue.js 全端框架
- **[Vue 3](https://vuejs.org/)** - 漸進式 JavaScript 框架
- **[TypeScript](https://www.typescriptlang.org/)** - 型別安全的 JavaScript
- **[Element Plus](https://element-plus.org/)** - Vue 3 UI 組件庫
- **[Tailwind CSS](https://tailwindcss.com/)** - 實用程式優先的 CSS 框架
- **[FontAwesome](https://fontawesome.com/)** - 圖標庫

### 開發工具

- **[VueUse](https://vueuse.org/)** - Vue 組合式工具集
- **[VueDraggable](https://github.com/SortableJS/vue.draggable.next)** - 拖拽功能

## 🚀 快速開始

### 環境需求

- Node.js 18+
- npm / yarn / pnpm

### 安裝依賴

```bash
# 使用 npm
npm install

# 使用 yarn
yarn install

# 使用 pnpm
pnpm install
```

### 開發環境

```bash
# 啟動開發服務器 (http://localhost:3000)
npm run dev
```

### 生產構建

```bash
# 構建應用
npm run build

# 預覽生產版本
npm run preview
```

## 📁 專案結構

```
nuxt_survey/
├── app/                      # 應用程式主目錄
│   ├── assets/              # 靜態資源
│   │   └── css/            # 樣式文件
│   ├── components/         # Vue 組件
│   ├── layouts/           # 佈局模板
│   ├── pages/            # 頁面組件 (自動路由)
│   │   ├── creator.vue   # 問卷建立頁面
│   │   ├── editor/       # 問卷編輯
│   │   ├── stats/        # 統計分析
│   │   └── survey/       # 問卷填寫
│   └── app.vue          # 根組件
├── server/                # 服務端 API
│   ├── api/              # API 路由
│   │   └── surveys/     # 問卷相關 API
│   └── utils/           # 服務端工具
├── types/                # TypeScript 類型定義
├── utils/                # 工具函數
├── public/               # 公共靜態文件
└── nuxt.config.ts       # Nuxt 配置文件
```

## 🔗 主要頁面

- **`/`** - 問卷管理首頁
- **`/creator`** - 新建問卷頁面
- **`/editor/[id]`** - 編輯問卷頁面
- **`/survey/[id]`** - 問卷填寫頁面
- **`/stats/[id]`** - 統計分析頁面

## 📡 API 接口

### 問卷管理

- `GET /api/surveys` - 獲取問卷列表
- `POST /api/surveys` - 創建新問卷
- `GET /api/surveys/[id]` - 獲取單個問卷
- `PUT /api/surveys/[id]` - 更新問卷
- `DELETE /api/surveys/[id]` - 刪除問卷

### 數據收集

- `POST /api/surveys/[id]/responses` - 提交問卷回覆
- `GET /api/surveys/[id]/stats` - 獲取統計數據

## 🎯 使用指南

### 1. 創建問卷

1. 點擊「新增問卷」按鈕
2. 填寫問卷標題和描述
3. 使用拖拽功能添加和排序題目
4. 設置題目類型和選項
5. 預覽並發布問卷
6. 使用cookie 模擬資料庫實現數據持久化

### 2. 收集回覆

1. 複製問卷分享連結
2. 分享給目標受眾
3. 即時查看回覆統計

### 3. 分析數據

1. 進入統計頁面
2. 查看各種統計圖表
3. 瀏覽詳細回覆記錄

## 🔧 自定義配置

### 樣式自定義

編輯 `app/assets/css/custom.css` 來自定義樣式

### 功能擴展

- 在 `server/api/` 目錄下添加新的 API 路由
- 在 `types/` 目錄下定義新的 TypeScript 類型
- 在 `utils/` 目錄下添加工具函數

## 📈 SEO 優化

- ✅ 完整的 Meta 標籤配置
- ✅ Open Graph 和 Twitter Card 支援
- ✅ 結構化數據 (JSON-LD)
- ✅ 語義化 HTML 結構
- ✅ robots.txt 和 sitemap 支援
