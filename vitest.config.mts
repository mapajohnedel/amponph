import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const rootDir = fileURLToPath(new URL('./', import.meta.url))

export default defineConfig({
  resolve: {
    alias: [
      { find: /^@\//, replacement: rootDir },
      { find: /^server-only$/, replacement: fileURLToPath(new URL('./tests/stubs/server-only.ts', import.meta.url)) },
    ],
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
})
