// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  alias: {
    // Задаем алиас для корня проекта
    '~': '/',
    '@': '/',
  },
  vite: {
    assetsInclude: ['**/*.glb', '**/*.gltf'], // Добавляем обработку .glb и .gltf файлов как ассеты
  },
});
