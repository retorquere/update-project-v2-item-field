import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('index', () => {
  it('calls run when imported', () => {
    const src = readFileSync(join(__dirname, '../src/index.ts'), 'utf8')
    expect(src).toMatch(/run\(\)/)
  })
})
