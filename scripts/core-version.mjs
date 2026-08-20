const projectVersionPattern = /^([ \t]*version[ \t]*=[ \t]*")([^"]+)("[ \t]*(?:#.*)?)$/m
const projectHeaderPattern = /^[ \t]*\[project\][ \t]*(?:#.*)?$/m
const tableHeaderPattern = /^[ \t]*\[/m

function findCoreVersion(pyproject) {
  const projectHeader = pyproject.match(projectHeaderPattern)
  if (!projectHeader || projectHeader.index === undefined) {
    throw new Error('Could not find [project].version in core/pyproject.toml')
  }

  const sectionStart = projectHeader.index + projectHeader[0].length
  const remainder = pyproject.slice(sectionStart)
  const nextTable = remainder.match(tableHeaderPattern)
  const sectionEnd = nextTable?.index === undefined
    ? pyproject.length
    : sectionStart + nextTable.index
  const projectSection = pyproject.slice(sectionStart, sectionEnd)
  const versionMatch = projectSection.match(projectVersionPattern)

  if (!versionMatch || versionMatch.index === undefined) {
    throw new Error('Could not find [project].version in core/pyproject.toml')
  }

  return {
    end: sectionStart + versionMatch.index + versionMatch[0].length,
    match: versionMatch,
    start: sectionStart + versionMatch.index,
  }
}

export function readCoreVersion(pyproject) {
  return findCoreVersion(pyproject).match[2]
}

export function replaceCoreVersion(pyproject, version) {
  const { end, match, start } = findCoreVersion(pyproject)
  return `${pyproject.slice(0, start)}${match[1]}${version}${match[3]}${pyproject.slice(end)}`
}
