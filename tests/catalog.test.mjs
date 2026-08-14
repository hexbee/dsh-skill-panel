/**
 * Catalog smoke tests: parse/create/scan/read/remove against a temporary
 * directory. Run with `node --test tests/catalog.test.mjs`.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

// Node's type stripping imports the TypeScript source directly.
const catalog = await import('../src/catalog.ts')

test('parseSkillBody accepts valid frontmatter', () => {
  const parsed = catalog.parseSkillBody('---\nname: my-helper\ndescription: helps out\n---\n\nbody text\n')
  assert.ok(parsed)
  assert.equal(parsed.name, 'my-helper')
  assert.equal(parsed.description, 'helps out')
  assert.equal(parsed.content, 'body text')
})

test('parseSkillBody rejects missing or invalid frontmatter', () => {
  assert.equal(catalog.parseSkillBody('plain text'), undefined)
  assert.equal(catalog.parseSkillBody('---\nname: Bad Name\ndescription: x\n---\n'), undefined)
  assert.equal(catalog.parseSkillBody('---\nname: ok-name\n---\n'), undefined)
})

test('symlinked skill directories are followed, and removal unlinks only the link', async () => {
  const root = await mkdtemp(join(tmpdir(), 'dsh-skill-panel-test-'))
  const target = await mkdtemp(join(tmpdir(), 'dsh-skill-panel-target-'))
  try {
    await writeFile(join(target, 'SKILL.md'), '---\nname: linked-skill\ndescription: via symlink\n---\n\nbody\n', 'utf8')
    const { symlink } = await import('node:fs/promises')
    await symlink(target, join(root, 'linked-skill'))

    const skills = await catalog.scanSkillsRoot(root)
    assert.equal(skills.length, 1)
    assert.equal(skills[0].kind, 'directory')
    assert.equal(skills[0].name, 'linked-skill')

    const detail = await catalog.readSkill(root, 'linked-skill')
    assert.ok(detail)
    assert.equal(detail.content, 'body')

    // removal unlinks the symlink, keeps the target
    assert.equal(await catalog.removeSkill(root, 'linked-skill'), true)
    const targetBody = await readFile(join(target, 'SKILL.md'), 'utf8')
    assert.match(targetBody, /linked-skill/)
  } finally {
    await rm(root, { recursive: true, force: true })
    await rm(target, { recursive: true, force: true })
  }
})

test('scan/read/remove round-trip', async () => {
  const root = await mkdtemp(join(tmpdir(), 'dsh-skill-panel-test-'))
  try {
    // scan empty/missing root
    assert.deepEqual(await catalog.scanSkillsRoot(join(root, 'missing')), [])

    // seed a directory skill and a flat-file skill, then scan both
    await mkdir(join(root, 'my-helper'), { recursive: true })
    await writeFile(join(root, 'my-helper', 'SKILL.md'), '---\nname: my-helper\ndescription: helps out\n---\n\n# my-helper\n\nbody\n', 'utf8')
    await writeFile(join(root, 'flat-one.md'), '---\nname: flat-one\ndescription: flat skill\n---\n\nflat body\n', 'utf8')
    const skills = await catalog.scanSkillsRoot(root)
    assert.equal(skills.length, 2)
    const dirSkill = skills.find((skill) => skill.address === 'my-helper')
    assert.ok(dirSkill)
    assert.equal(dirSkill.kind, 'directory')
    assert.ok(dirSkill.files.includes('SKILL.md'))
    const flatSkill = skills.find((skill) => skill.address === 'flat-one')
    assert.ok(flatSkill)
    assert.equal(flatSkill.kind, 'file')

    // read detail
    const detail = await catalog.readSkill(root, 'my-helper')
    assert.ok(detail)
    assert.equal(detail.description, 'helps out')
    assert.match(detail.content, /body/)

    // remove both
    assert.equal(await catalog.removeSkill(root, 'my-helper'), true)
    assert.equal(await catalog.removeSkill(root, 'flat-one'), true)
    assert.equal(await catalog.removeSkill(root, 'my-helper'), false)
    assert.deepEqual(await catalog.scanSkillsRoot(root), [])
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
