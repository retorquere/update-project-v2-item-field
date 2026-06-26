import { afterEach, describe, expect, it, vi } from 'vitest'

import * as core from '@actions/core'

import { getInputs } from '../src/inputs'

vi.mock('@actions/core')

describe('getInputs', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns inputs', () => {
    mockGetInput({
      'project-url': 'https://github.com/orgs/nipe0324/projects/1',
      'github-token': 'gh_token',
      'field-name': 'Text Input Field',
      'field-value': 'Hello, World!',
    })

    expect(getInputs()).toEqual({
      projectUrl: 'https://github.com/orgs/nipe0324/projects/1',
      ghToken: 'gh_token',
      fieldName: 'Text Input Field',
      fieldValue: 'Hello, World!',
      fieldValueScript: '',
      skipUpdateScript: null,
      allItems: false,
    })
  })

  it('returns skipUpdateScript when `sckip-update-script` is present', () => {
    mockGetInput({
      'project-url': 'https://github.com/orgs/nipe0324/projects/1',
      'github-token': 'gh_token',
      'field-name': 'Text Input Field',
      'field-value-script': 'return "Hello, World!"',
      'skip-update-script': 'return true',
    })

    expect(getInputs()).toEqual({
      projectUrl: 'https://github.com/orgs/nipe0324/projects/1',
      ghToken: 'gh_token',
      fieldName: 'Text Input Field',
      fieldValue: '',
      fieldValueScript: 'return "Hello, World!"',
      skipUpdateScript: 'return true',
      allItems: false,
    })
  })

  it('returns allItems true when `all-items` is `true`', () => {
    mockGetInput({
      'project-url': 'https://github.com/orgs/nipe0324/projects/1',
      'github-token': 'gh_token',
      'field-name': 'Text Input Field',
      'field-value-script': 'return "Hello, World!"',
      'all-items': 'true',
    })

    expect(getInputs()).toEqual({
      projectUrl: 'https://github.com/orgs/nipe0324/projects/1',
      ghToken: 'gh_token',
      fieldName: 'Text Input Field',
      fieldValue: '',
      fieldValueScript: 'return "Hello, World!"',
      skipUpdateScript: null,
      allItems: true,
    })
  })
})

function mockGetInput(mocks: Record<string, string>): void {
  vi.mocked(core.getInput).mockImplementation((key: string) => mocks[key] ?? '')
}
