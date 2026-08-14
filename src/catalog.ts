/**
 * Host-side skill catalog: scans the two managed roots
 * (`~/.agents/skills` and each registered workspace's `.agents/skills`),
 * reads skill bodies, and performs the remove mutation. Pure node:fs code
 * with no cordis dependencies so the logic stays unit-testable; the plugin
 * body wraps it in the RPC channel.
 */
import { mkdir, readdir, readFile, rm, stat } from 'node:fs/promises'
import type { Dirent } from 'node:fs'
import { join } from 'node:path'
import { parse as parseYaml } from 'yaml'
import { SKILL_NAME, type SkillDetail, type SkillView } from './contract.ts'

/** Frontmatter parse outcome for one skill body. */
export interface ParsedSkill {
  readonly name: string
  readonly description: string
  readonly whenToUse?: string
  readonly frontmatter: Readonly<Record<string, unknown>>
  readonly content: string
}

/**
 * Parse `---` frontmatter from a skill body. Mirrors the harness parser's
 * acceptance rule: frontmatter is required and must carry a kebab-case `name`
 * and a `description`; anything else (missing block, YAML failure, invalid
 * name) means the entry is not a skill.
 * @param raw - raw file text.
 * @returns the parsed skill, or undefined when the entry is not a valid skill.
 */
export function parseSkillBody(raw: string): ParsedSkill | undefined {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(raw)
  if (match === null) return undefined
  let data: unknown
  try {
    data = parseYaml(match[1])
  } catch {
    return undefined
  }
  if (data === null || typeof data !== 'object' || Array.isArray(data)) return undefined
  const record = data as Record<string, unknown>
  const name = record.name
  const description = record.description
  if (typeof name !== 'string' || typeof description !== 'string') return undefined
  if (!SKILL_NAME.test(name)) return undefined
  const whenToUse = typeof record.whenToUse === 'string' ? record.whenToUse : undefined
  return {
    name,
    description,
    ...whenToUse === undefined ? {} : { whenToUse },
    frontmatter: record,
    content: raw.slice(match[0].length).trim(),
  }
}

/** One-level entry listing for a directory, directory names suffixed with `/`. */
async function listEntryNames(dir: string): Promise<readonly string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  return entries
    .map((entry) => entry.isDirectory() ? `${entry.name}/` : entry.name)
    .sort((a, b) => a.localeCompare(b))
}

/**
 * Classify one root entry by following symbolic links (installed skills are
 * frequently symlinks to versioned directories, mirroring the harness's own
 * `nodeEntryKind` behavior).
 */
async function entryKindOf(skillsRoot: string, entry: Dirent): Promise<'directory' | 'file' | 'other'> {
  if (entry.isDirectory()) return 'directory'
  if (entry.isFile()) return 'file'
  if (entry.isSymbolicLink()) {
    try {
      const target = await stat(join(skillsRoot, entry.name))
      if (target.isDirectory()) return 'directory'
      if (target.isFile()) return 'file'
    } catch {
      return 'other'
    }
  }
  return 'other'
}

/** Build the absolute body path for a discovered directory entry. */
function directoryBodyPath(skillsRoot: string, dirName: string): string {
  return join(skillsRoot, dirName, 'SKILL.md')
}

/**
 * Discover the skills inside one managed root. Directory bundles win over a
 * same-named flat file; entries that fail frontmatter validation are skipped
 * silently (they are simply not skills).
 * @param skillsRoot - absolute managed root.
 * @returns skill views sorted by address.
 */
export async function scanSkillsRoot(skillsRoot: string): Promise<readonly SkillView[]> {
  let entries
  try {
    entries = await readdir(skillsRoot, { withFileTypes: true })
  } catch (error) {
    if (isAbsentError(error)) return []
    throw error
  }
  const views: SkillView[] = []
  for (const entry of entries) {
    const kind = await entryKindOf(skillsRoot, entry)
    if (kind === 'directory') {
      const path = directoryBodyPath(skillsRoot, entry.name)
      const parsed = await readSkillBody(path)
      if (parsed === undefined) continue
      const files = await listEntryNames(join(skillsRoot, entry.name)).catch(() => [])
      views.push({
        address: entry.name,
        name: parsed.name,
        description: parsed.description,
        ...parsed.whenToUse === undefined ? {} : { whenToUse: parsed.whenToUse },
        kind: 'directory',
        path,
        files,
        size: parsed.content.length,
      })
      continue
    }
    if (kind === 'file' && entry.name.endsWith('.md')) {
      const path = join(skillsRoot, entry.name)
      const parsed = await readSkillBody(path)
      if (parsed === undefined) continue
      views.push({
        address: entry.name.slice(0, -3),
        name: parsed.name,
        description: parsed.description,
        ...parsed.whenToUse === undefined ? {} : { whenToUse: parsed.whenToUse },
        kind: 'file',
        path,
        files: [],
        size: parsed.content.length,
      })
    }
  }
  return views.sort((a, b) => a.address.localeCompare(b.address))
}

async function readSkillBody(path: string): Promise<ParsedSkill | undefined> {
  let raw: string
  try {
    raw = await readFile(path, 'utf8')
  } catch (error) {
    if (isAbsentError(error)) return undefined
    throw error
  }
  return parseSkillBody(raw)
}

/** Resolve one skill's body path and directory inside a managed root. */
async function resolveEntry(skillsRoot: string, address: string): Promise<{ path: string; dir: string; kind: 'directory' | 'file' } | undefined> {
  if (address.length === 0 || address.includes('/') || address.includes('\\') || address === '.' || address === '..') return undefined
  const dirCandidate = join(skillsRoot, address)
  try {
    const info = await stat(dirCandidate)
    if (info.isDirectory()) return { path: directoryBodyPath(skillsRoot, address), dir: dirCandidate, kind: 'directory' }
  } catch {
    // not a directory; fall through to the flat-file branch
  }
  const fileCandidate = join(skillsRoot, `${address}.md`)
  try {
    const info = await stat(fileCandidate)
    if (info.isFile()) return { path: fileCandidate, dir: skillsRoot, kind: 'file' }
  } catch {
    return undefined
  }
  return undefined
}

/**
 * Read one skill in full.
 * @param skillsRoot - absolute managed root.
 * @param address - skill address (directory name or flat file name).
 * @returns the skill detail, or undefined when it does not exist or is invalid.
 */
export async function readSkill(skillsRoot: string, address: string): Promise<SkillDetail | undefined> {
  const entry = await resolveEntry(skillsRoot, address)
  if (entry === undefined) return undefined
  const parsed = await readSkillBody(entry.path)
  if (parsed === undefined) return undefined
  const files = entry.kind === 'directory' ? await listEntryNames(entry.dir).catch(() => []) : []
  return {
    address,
    name: parsed.name,
    description: parsed.description,
    ...parsed.whenToUse === undefined ? {} : { whenToUse: parsed.whenToUse },
    kind: entry.kind,
    path: entry.path,
    files,
    frontmatter: parsed.frontmatter,
    content: parsed.content,
  }
}

/**
 * Remove one skill (its whole directory for bundles, the file for flat skills).
 * @param skillsRoot - absolute managed root.
 * @param address - skill address.
 * @returns true when something was removed, false when absent.
 */
export async function removeSkill(skillsRoot: string, address: string): Promise<boolean> {
  const entry = await resolveEntry(skillsRoot, address)
  if (entry === undefined) return false
  await rm(entry.kind === 'directory' ? entry.dir : entry.path, { recursive: true, force: true })
  return true
}

/** Resolve the path a reveal should open for a scope/address pair. */
export async function revealTarget(skillsRoot: string, address?: string): Promise<string> {
  if (address === undefined || address.length === 0) {
    await mkdir(skillsRoot, { recursive: true })
    return skillsRoot
  }
  const entry = await resolveEntry(skillsRoot, address)
  return entry === undefined ? skillsRoot : entry.kind === 'directory' ? entry.dir : entry.path
}

function isAbsentError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT'
}
