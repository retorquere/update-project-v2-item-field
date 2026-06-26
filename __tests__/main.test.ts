import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import * as core from '@actions/core'
import * as github from '@actions/github'

import { ExOctokit } from '../src/ex-octokit'
import { run } from '../src/main'

vi.mock('@actions/core')
vi.mock('@actions/github')

describe('run', () => {
  beforeEach(() => {
    vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
  })

  beforeEach(() => {
    vi.mocked(github.context).payload = {
      issue: {
        number: 1,
        html_url: 'https://github.com/myorg/update-project-v2-item-field/issues/74',
      },
      repository: {
        name: 'update-project-v2-item-field',
        owner: {
          login: 'myorg',
        },
      },
    }

    vi.mocked(core.info).mockImplementation(() => {})
    vi.mocked(core.debug).mockImplementation(() => {})
    vi.mocked(core.setFailed).mockImplementation(() => {})
  })

  afterEach(() => {
    vi.mocked(github.context).payload = {}
    vi.restoreAllMocks()
  })

  it('updates project v2 TEXT item field', async () => {
    mockGetInput({
      'project-url': 'https://github.com/orgs/nipe0324/projects/1',
      'github-token': 'gh_token',
      'field-name': 'Text Input Field',
      'field-value': 'Hello, World!',
    })

    vi.spyOn(ExOctokit.prototype, 'fetchProjectV2Id').mockResolvedValue('project-id')
    vi.spyOn(ExOctokit.prototype, 'addProjectV2ItemByContentId').mockResolvedValue({ id: 'item-id' } as any)
    vi.spyOn(ExOctokit.prototype, 'fetchProjectV2FieldByName').mockResolvedValue({ id: 'field-id', dataType: 'TEXT' } as any)
    vi.spyOn(ExOctokit.prototype, 'updateProjectV2ItemFieldValue').mockResolvedValue({ id: 'item-id' } as any)

    await run()

    expect(vi.mocked(core.info)).toHaveBeenCalledWith('Update the project V2 item field. item-id: item-id')
    expect(vi.mocked(core.debug)).toHaveBeenCalledWith('ProjectV2 ID: project-id')
    expect(vi.mocked(core.debug)).toHaveBeenCalledWith('Item ID: item-id')
    expect(vi.mocked(core.debug)).toHaveBeenCalledWith('Field ID: field-id')
    expect(vi.mocked(core.debug)).toHaveBeenCalledWith('Field Value: {"text":"Hello, World!"}')
  })

  it('updates project v2 SINGLE_SELECT item field', async () => {
    mockGetInput({
      'project-url': 'https://github.com/orgs/nipe0324/projects/1',
      'github-token': 'gh_token',
      'field-name': 'Status',
      'field-value': 'Done',
    })

    vi.spyOn(ExOctokit.prototype, 'fetchProjectV2Id').mockResolvedValue('project-id')
    vi.spyOn(ExOctokit.prototype, 'addProjectV2ItemByContentId').mockResolvedValue({ id: 'item-id' } as any)
    vi.spyOn(ExOctokit.prototype, 'fetchProjectV2FieldByName').mockResolvedValue({
      id: 'field-id',
      dataType: 'SINGLE_SELECT',
      options: [
        { id: '1', name: 'To Do' },
        { id: '2', name: 'In Progress' },
        { id: '3', name: 'Done' },
      ],
    } as any)
    vi.spyOn(ExOctokit.prototype, 'updateProjectV2ItemFieldValue').mockResolvedValue({ id: 'item-id' } as any)

    await run()

    expect(vi.mocked(core.info)).toHaveBeenCalledWith('Update the project V2 item field. item-id: item-id')
    expect(vi.mocked(core.debug)).toHaveBeenCalledWith('ProjectV2 ID: project-id')
    expect(vi.mocked(core.debug)).toHaveBeenCalledWith('Item ID: item-id')
    expect(vi.mocked(core.debug)).toHaveBeenCalledWith('Field ID: field-id')
    expect(vi.mocked(core.debug)).toHaveBeenCalledWith('Field Value: {"singleSelectOptionId":"3"}')
  })

  it('updates project v2 ITERATION item field', async () => {
    mockGetInput({
      'project-url': 'https://github.com/orgs/nipe0324/projects/1',
      'github-token': 'gh_token',
      'field-name': 'Iteration',
      'field-value': 'Iteration 2',
    })

    vi.spyOn(ExOctokit.prototype, 'fetchProjectV2Id').mockResolvedValue('project-id')
    vi.spyOn(ExOctokit.prototype, 'addProjectV2ItemByContentId').mockResolvedValue({ id: 'item-id' } as any)
    vi.spyOn(ExOctokit.prototype, 'fetchProjectV2FieldByName').mockResolvedValue({
      id: 'field-id',
      dataType: 'ITERATION',
      configuration: {
        completedIterations: [],
        iterations: [
          { id: '1', title: 'Iteration 1' },
          { id: '2', title: 'Iteration 2' },
        ],
      },
    } as any)
    vi.spyOn(ExOctokit.prototype, 'updateProjectV2ItemFieldValue').mockResolvedValue({ id: 'item-id' } as any)

    await run()

    expect(vi.mocked(core.info)).toHaveBeenCalledWith('Update the project V2 item field. item-id: item-id')
    expect(vi.mocked(core.debug)).toHaveBeenCalledWith('ProjectV2 ID: project-id')
    expect(vi.mocked(core.debug)).toHaveBeenCalledWith('Item ID: item-id')
    expect(vi.mocked(core.debug)).toHaveBeenCalledWith('Field ID: field-id')
    expect(vi.mocked(core.debug)).toHaveBeenCalledWith('Field Value: {"iterationId":"2"}')
  })

  it('updates project v2 DATE item field by field-value-script', async () => {
    mockGetInput({
      'project-url': 'https://github.com/orgs/nipe0324/projects/1',
      'github-token': 'gh_token',
      'field-name': 'My Date Field',
      'field-value-script': `
        const date = new Date(item.fieldValues['My Date Field'])
        date.setDate(date.getDate() + 1)
        return date.toISOString().split('T')[0]
      `,
    })

    vi.spyOn(ExOctokit.prototype, 'fetchProjectV2Id').mockResolvedValue('project-id')
    vi.spyOn(ExOctokit.prototype, 'addProjectV2ItemByContentId').mockResolvedValue({
      id: 'item-id',
      fieldValues: {
        nodes: [
          {
            __typename: 'ProjectV2ItemFieldDateValue',
            field: {
              name: 'My Date Field',
            },
            date: '2024-02-01',
          },
        ],
      },
    } as any)
    vi.spyOn(ExOctokit.prototype, 'fetchProjectV2FieldByName').mockResolvedValue({ id: 'field-id', dataType: 'DATE' } as any)
    vi.spyOn(ExOctokit.prototype, 'updateProjectV2ItemFieldValue').mockResolvedValue({ id: 'item-id' } as any)

    await run()

    expect(vi.mocked(core.info)).toHaveBeenCalledWith('Update the project V2 item field. item-id: item-id')
    expect(vi.mocked(core.debug)).toHaveBeenCalledWith('ProjectV2 ID: project-id')
    expect(vi.mocked(core.debug)).toHaveBeenCalledWith('Item ID: item-id')
    expect(vi.mocked(core.debug)).toHaveBeenCalledWith('Field ID: field-id')
    expect(vi.mocked(core.debug)).toHaveBeenCalledWith('Field Value: {"date":"2024-02-02"}')
  })

  it('updates project v2 all item fields when `all-items` is true', async () => {
    mockGetInput({
      'project-url': 'https://github.com/orgs/nipe0324/projects/1',
      'github-token': 'gh_token',
      'field-name': 'Text Input Field',
      'field-value': 'Hello, World!',
      'all-items': 'true',
    })

    vi.spyOn(ExOctokit.prototype, 'fetchProjectV2Id').mockResolvedValue('project-id')
    vi.spyOn(ExOctokit.prototype, 'fetchProjectV2FieldByName').mockResolvedValue({ id: 'field-id', dataType: 'TEXT' } as any)
    vi.spyOn(ExOctokit.prototype, 'fetchProjectV2ItemsWithPagination').mockResolvedValue([{ id: 'item-id-1' }, { id: 'item-id-2' }] as any)
    vi.spyOn(ExOctokit.prototype, 'updateProjectV2ItemFieldValue').mockResolvedValue({ id: 'item-id-2' } as any)

    await run()

    expect(vi.mocked(core.info)).toHaveBeenCalledWith('Update the project V2 item field. item-id: item-id-1')
    expect(vi.mocked(core.info)).toHaveBeenCalledWith('Update the project V2 item field. item-id: item-id-2')
    expect(vi.mocked(core.debug)).toHaveBeenCalledWith('ProjectV2 ID: project-id')
    expect(vi.mocked(core.debug)).toHaveBeenCalledWith('Item ID: item-id-1')
    expect(vi.mocked(core.debug)).toHaveBeenCalledWith('Item ID: item-id-2')
    expect(vi.mocked(core.debug)).toHaveBeenCalledWith('Field ID: field-id')
    expect(vi.mocked(core.debug)).toHaveBeenCalledWith('Field Value: {"text":"Hello, World!"}')
  })

  it('skip to update project v2 item field when condition-script is false', async () => {
    mockGetInput({
      'project-url': 'https://github.com/orgs/nipe0324/projects/1',
      'github-token': 'gh_token',
      'field-name': 'Text Input Field',
      'field-value': 'Hello, World!',
      'skip-update-script': 'return true',
    })

    vi.spyOn(ExOctokit.prototype, 'fetchProjectV2Id').mockResolvedValue('project-id')
    vi.spyOn(ExOctokit.prototype, 'addProjectV2ItemByContentId').mockResolvedValue({ id: 'item-id' } as any)
    vi.spyOn(ExOctokit.prototype, 'fetchProjectV2FieldByName').mockResolvedValue({ id: 'field-id', dataType: 'TEXT' } as any)
    vi.spyOn(ExOctokit.prototype, 'updateProjectV2ItemFieldValue').mockResolvedValue({ id: 'item-id' } as any)

    await run()

    expect(vi.mocked(core.info)).toHaveBeenCalledWith('Skip updating the field. item-id: item-id')
  })

  it('throws an error when field-value and field-value-script are blank', async () => {
    mockGetInput({
      'project-url': 'https://github.com/orgs/nipe0324/projects/1',
      'github-token': 'gh_token',
      'field-name': 'Text Input Field',
    })

    await run()

    expect(vi.mocked(core.setFailed)).toHaveBeenCalledWith('`field-value` or `field-value-script` is required.')
  })

  it("throws an error when url isn't a valid project url", async () => {
    mockGetInput({
      'project-url': 'https://github.com/orgs/github/repositories',
      'github-token': 'gh_token',
      'field-name': 'Text Input Field',
      'field-value': 'Hello, World!',
    })

    await run()

    expect(vi.mocked(core.setFailed)).toHaveBeenCalledWith('Invalid project URL: https://github.com/orgs/github/repositories.')
  })
})

function mockGetInput(mocks: Record<string, string>): void {
  vi.spyOn(core, 'getInput').mockImplementation((key: string) => mocks[key] ?? '')
}
