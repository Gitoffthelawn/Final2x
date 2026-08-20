import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { readCoreVersion, replaceCoreVersion } from './core-version.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const packagePath = path.join(root, 'package.json')
const pyprojectPath = path.join(root, 'core', 'pyproject.toml')
const args = process.argv.slice(2)
const check = args.includes('--check')
const tagIndex = args.indexOf('--tag')
const tag = tagIndex >= 0 ? args[tagIndex + 1] : undefined

const { version } = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
if (!version || typeof version !== 'string') {
  throw new TypeError('package.json must contain a string version')
}

const pyproject = fs.readFileSync(pyprojectPath, 'utf8')
const coreVersion = readCoreVersion(pyproject)
if (check && coreVersion !== version) {
  throw new Error(`Version mismatch: package.json=${version}, Python core=${coreVersion}`)
}

if (!check && coreVersion !== version) {
  fs.writeFileSync(pyprojectPath, replaceCoreVersion(pyproject, version))
  console.log(`Updated Python core version: ${coreVersion} -> ${version}`)
}

if (tag && tag !== `v${version}`) {
  throw new Error(`Release tag ${tag} does not match package version v${version}`)
}

console.log(`Final2x desktop and Python core version: ${version}`)
