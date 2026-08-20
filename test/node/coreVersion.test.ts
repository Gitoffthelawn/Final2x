import { describe, expect, it } from 'vitest'
import { readCoreVersion, replaceCoreVersion } from '../../scripts/core-version.mjs'

describe('core version helpers', () => {
  it('reads the project version with flexible TOML whitespace', () => {
    const pyproject = '[project]\n  version   =   "4.0.0"  # shared release version\n'

    expect(readCoreVersion(pyproject)).toBe('4.0.0')
  })

  it('updates the version without changing formatting or comments', () => {
    const pyproject = '[project]\n\tversion = "4.0.0" # keep this comment\n'

    expect(replaceCoreVersion(pyproject, '4.1.0'))
      .toBe('[project]\n\tversion = "4.1.0" # keep this comment\n')
  })

  it('rejects a document without a project version', () => {
    const pyproject = '[tool.example]\nversion = "9.9.9"\n\n[project]\nname = "Final2x_core"\n'

    expect(() => readCoreVersion(pyproject))
      .toThrow('Could not find [project].version')
  })
})
