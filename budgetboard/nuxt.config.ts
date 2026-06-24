// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    modules: [
        '@nuxt/eslint',
        '@nuxt/ui'
    ],
    css: ['~/assets/css/main.css'],
    devtools: {enabled: true},
    components: [
        { path: '~/shared/ui', pathPrefix: false }
    ],
    runtimeConfig: {
        public: {
            apiUrl: 'http://127.0.0.1:8000'
        }
    },
    vite: {
        plugins: [
            tailwindcss()
        ]
    }
})
