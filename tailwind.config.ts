import type { Config } from 'tailwindcss'

export default {
    content: [
        './app/**/*.{vue,js,ts}',
        './components/**/*.{vue,js,ts}',
        './layouts/**/*.{vue,js,ts}',
        './pages/**/*.{vue,js,ts}',
        './plugins/**/*.{js,ts}',
        './error.vue',
        './app.vue',
    ],
    theme: {
        extend: {},
    },
    plugins: [],
} satisfies Config


