import {
  defineConfig,
  minimal2023Preset as preset,
} from '@vite-pwa/assets-generator/config'

export default defineConfig({
  headLinkOptions: {
    preset: '2023',
  },
  preset: {
    ...preset,
    // Keep the generator defaults, but avoid the default white background on maskable icons.
    maskable: {
      ...preset.maskable,
      padding: 0.2,
      resizeOptions: {
        background: '#1B2028',
        fit: 'contain',
      },
    },
  },
  images: ['public/pwa-source.svg'],
})
