/**
 * dsh-skill-panel Host plugin: a browser settings section for viewing and
 * managing the local skill roots (`~/.agents/skills` and each registered
 * workspace's `.agents/skills`). Mounts one loopback-pinned Connection RPC
 * channel (`/skill-panel`) whose endpoints scan the two managed roots, read
 * skill bodies, remove skills, and reveal them in the platform file manager.
 *
 * Project scopes are addressed exclusively by Host-registered workspace ids:
 * the client never submits a raw filesystem path, and every mutation is
 * confined to `<workspace>/.agents/skills` or the global `~/.agents/skills`.
 */
import { execFile } from 'node:child_process'
import { homedir } from 'node:os'
import { join } from 'node:path'
import type { Context } from '@deepseek-ai/cordis'
import type { ConnectionRpcHandler } from '@deepseek-ai/dsh-client-connection'
import { readSkill, removeSkill, revealTarget, scanSkillsRoot } from './catalog.ts'
import {
  fail,
  ok,
  readString,
  type Overview,
  type ProjectView,
  type SkillPanelHandler,
  type SkillPanelResult,
  type SkillView,
} from './contract.ts'

/** Cordis plugin name (the profile patch mounts the package under this id). */
export const name = 'dsh-skill-panel'
/** The browser transport is a hard dependency: without it there is no panel. */
export const inject = ['connection']

/** Structural face of `ctx.workspaceRegistry` (optional service, read via get). */
interface WorkspaceFace {
  readonly id: string
  readonly path: string
  readonly title: string
}
interface WorkspaceRegistryFace {
  list(): readonly WorkspaceFace[]
}

/** Absolute-path directory check. */
async function existsDir(path: string): Promise<boolean> {
  try {
    const { stat } = await import('node:fs/promises')
    return (await stat(path)).isDirectory()
  } catch {
    return false
  }
}

/** Open a path in the platform file manager (best effort, never fatal). */
async function reveal(path: string): Promise<void> {
  const runner = (command: string, args: string[]): Promise<void> => new Promise((resolve, reject) => {
    execFile(command, args, (error) => error === null ? resolve() : reject(error))
  })
  if (process.platform === 'darwin') return await runner('open', [path])
  if (process.platform === 'win32') return await runner('explorer', [path])
  return await runner('xdg-open', [path])
}

/**
 * Resolve one client-addressed scope to its managed skills root.
 * `global` maps to `~/.agents/skills` (DSH_AGENTS_HOME respected); any other
 * scope must be a registered workspace id.
 */
function resolveRoot(
  registry: WorkspaceRegistryFace | undefined,
  globalDir: string,
  scope: string,
): string | SkillPanelResult<never> {
  if (scope === 'global') return globalDir
  const workspace = registry?.list().find((candidate) => candidate.id === scope)
  if (workspace === undefined) {
    return registry === undefined
      ? fail('command-error', '项目级技能目录不可用：当前部署未挂载工作区注册表。', {})
      : fail('workspace-not-found', `工作区 "${scope}" 不存在或已被删除。`, { workspaceId: scope })
  }
  return join(workspace.path, '.agents', 'skills')
}

/**
 * Compose the plugin body: one loopback-pinned RPC channel.
 * @param ctx - Host plugin context (connection service provided by injection).
 */
export function apply(ctx: Context): void {
  const agentsHome = process.env.DSH_AGENTS_HOME ?? join(homedir(), '.agents')
  const globalDir = join(agentsHome, 'skills')

  const handler: SkillPanelHandler = async (endpoint, payload) => {
    try {
      const registry = ctx.get('workspaceRegistry') as WorkspaceRegistryFace | undefined
      switch (endpoint) {
        case 'overview': {
          const projects: ProjectView[] = []
          const projectSkills: Record<string, readonly SkillView[]> = {}
          for (const workspace of registry?.list() ?? []) {
            const skillsDir = join(workspace.path, '.agents', 'skills')
            const exists = await existsDir(skillsDir)
            projects.push({ id: workspace.id, title: workspace.title, path: workspace.path, skillsDir, exists })
            projectSkills[workspace.id] = await scanSkillsRoot(skillsDir)
          }
          const overview: Overview = {
            globalDir,
            globalExists: await existsDir(globalDir),
            globalSkills: await scanSkillsRoot(globalDir),
            projects,
            projectSkills,
            projectsUnavailable: registry === undefined,
          }
          return ok(overview)
        }
        case 'read': {
          const scope = readString(payload, 'scope')
          const address = readString(payload, 'address')
          if (scope === undefined || address === undefined) {
            return fail('bad-request', 'read 需要 scope 与 address。', { issues: [] })
          }
          const root = resolveRoot(registry, globalDir, scope)
          if (typeof root !== 'string') return root
          const detail = await readSkill(root, address)
          if (detail === undefined) return fail('command-error', `技能 "${address}" 不存在。`, {})
          return ok(detail)
        }
        case 'remove': {
          const scope = readString(payload, 'scope')
          const address = readString(payload, 'address')
          if (scope === undefined || address === undefined) {
            return fail('bad-request', 'remove 需要 scope 与 address。', { issues: [] })
          }
          const root = resolveRoot(registry, globalDir, scope)
          if (typeof root !== 'string') return root
          const removed = await removeSkill(root, address)
          if (!removed) return fail('command-error', `技能 "${address}" 不存在。`, {})
          return ok({ removed: true })
        }
        case 'reveal': {
          const scope = readString(payload, 'scope')
          if (scope === undefined) return fail('bad-request', 'reveal 需要 scope。', { issues: [] })
          const root = resolveRoot(registry, globalDir, scope)
          if (typeof root !== 'string') return root
          const target = await revealTarget(root, readString(payload, 'address'))
          try {
            await reveal(target)
            return ok({ path: target })
          } catch (error) {
            return fail('command-error', `无法打开目录：${error instanceof Error ? error.message : String(error)}`, {})
          }
        }
        default:
          return fail('bad-request', `未知端点 "${endpoint}"。`, { issues: [] })
      }
    } catch (error) {
      ctx.logger?.warn(`skill-panel: ${endpoint} failed: ${error instanceof Error ? error.message : String(error)}`)
      return fail('internal', error instanceof Error ? error.message : String(error), {})
    }
  }

  ctx.connection.rpc.handle('/skill-panel', handler as unknown as ConnectionRpcHandler, { authority: 'loopback' })
}
