import { defineConfig } from 'vitest/config'
import graphql from '@rollup/plugin-graphql'
import { PluginOption } from 'vite'

export default defineConfig({
  plugins: [graphql() as PluginOption],
  test: {
    globals: true,
    includeSource: ['src/**/*.{js,ts,jsx,tsx}'],
  },
})
