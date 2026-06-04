// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    modules: [
        '@nuxt/ui'
    ],
    css: ['~/assets/css/main.css'],
    devtools: {enabled: true},
    vite: {
        plugins: [
            tailwindcss()
        ]
    }
})
