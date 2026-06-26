import { describe, expect, it } from 'vitest'

import { mustGetOwnerTypeQuery } from '../src/utils'

describe('mustGetOwnerTypeQuery', () => {
  it('returns organization for orgs ownerType', () => {
    expect(mustGetOwnerTypeQuery('orgs')).toBe('organization')
  })

  it('returns user for users ownerType', () => {
    expect(mustGetOwnerTypeQuery('users')).toBe('user')
  })

  it('throws an error when an unsupported ownerType is set', () => {
    expect(() => mustGetOwnerTypeQuery('unknown')).toThrow("Unsupported ownerType: unknown. Must be one of 'orgs' or 'users'")
  })
})
