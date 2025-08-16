import type { Config } from 'tailwindcss'

export default {
    content: [
        './app/**/*.{vue,js,ts}',
        './components/**/*.{vue,js,ts}',
        './layouts/**/*.{vue,js,ts}',
        './pages/**/*.{vue,js,ts}',
        './plugins/**/*.{js,ts}',
        './utils/**/*.{js,ts}',
        './error.vue',
        './app.vue',
    ],
    safelist: [
        'bg-gradient-to-r',
        'from-blue-500',
        'to-blue-600',
        'text-blue-600',
        'from-orange-500',
        'to-orange-600',
        'text-orange-600',
        'from-cyan-500',
        'to-cyan-600',
        'text-cyan-600',
        'from-gray-500',
        'to-gray-600',
        'text-gray-600',
        'from-red-500',
        'to-red-600',
        'text-red-600',
        'from-purple-500',
        'to-purple-600',
        'text-purple-600',
        'from-indigo-500',
        'to-indigo-600',
        'text-indigo-600',
    ],
    theme: {
        extend: {},
    },
    plugins: [],
} satisfies Config


