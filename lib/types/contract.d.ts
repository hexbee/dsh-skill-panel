/**
 * Shared wire contract between the dsh-skill-panel Host half and its browser
 * settings section. Plain JSON only — every shape crossing the RPC channel is
 * declared here, together with the small hand-rolled guards the Host uses to
 * validate payloads (the client never submits a raw filesystem path: project
 * scopes are addressed by the Host's registered workspace id, and every skill
 * mutation is addressed by a name inside one of the two managed roots).
 */
/** kebab-case skill-name grammar, mirrored from `@deepseek-ai/dsh-skill`. */
export declare const SKILL_NAME: RegExp;
/** Scope discriminant: the global root or one registered workspace. */
export type ScopeId = 'global' | (string & {});
/** One skill discovered in a managed root (directory bundle or flat markdown). */
export interface SkillView {
    /** Address used by read/remove/reveal: directory name or file name without `.md`. */
    readonly address: string;
    /** Frontmatter `name` (kebab-case). */
    readonly name: string;
    /** Frontmatter `description`. */
    readonly description: string;
    /** Optional frontmatter `whenToUse`. */
    readonly whenToUse?: string;
    /** Directory bundle (SKILL.md) or flat markdown file. */
    readonly kind: 'directory' | 'file';
    /** Absolute path of the skill body (SKILL.md or the .md file). */
    readonly path: string;
    /** Sibling files inside a directory bundle (not for flat files). */
    readonly files: readonly string[];
    /** Body size in bytes (informational). */
    readonly size: number;
}
/** A registered workspace as surfaced to the panel's project picker. */
export interface ProjectView {
    readonly id: string;
    readonly title: string;
    readonly path: string;
    /** Absolute `.agents/skills` directory for this project. */
    readonly skillsDir: string;
    /** Whether the skills directory currently exists on disk. */
    readonly exists: boolean;
}
/** `overview` response: everything the panel lists in one call. */
export interface Overview {
    /** Absolute `~/.agents/skills` root (DSH_AGENTS_HOME respected). */
    readonly globalDir: string;
    /** Whether the global root exists on disk. */
    readonly globalExists: boolean;
    /** Skills in the global root. */
    readonly globalSkills: readonly SkillView[];
    /** Registered workspaces (empty when the registry is absent). */
    readonly projects: readonly ProjectView[];
    /** Project-scoped skills, one entry per registered workspace. */
    readonly projectSkills: Readonly<Record<string, readonly SkillView[]>>;
    /** True when no workspace registry is mounted, so project scopes are unavailable. */
    readonly projectsUnavailable: boolean;
}
/** `read` response: one skill's frontmatter, body, and directory listing. */
export interface SkillDetail {
    readonly address: string;
    readonly name: string;
    readonly description: string;
    readonly whenToUse?: string;
    readonly kind: 'directory' | 'file';
    readonly path: string;
    readonly files: readonly string[];
    readonly frontmatter: Readonly<Record<string, unknown>>;
    readonly content: string;
}
/** `overview` request payload. */
export interface OverviewRequest {
}
/** `read` request payload. */
export interface ReadRequest {
    readonly scope: ScopeId;
    readonly address: string;
}
/** `remove` request payload. */
export interface RemoveRequest {
    readonly scope: ScopeId;
    readonly address: string;
}
/** `reveal` request payload: with `address` reveals the skill, without it the root. */
export interface RevealRequest {
    readonly scope: ScopeId;
    readonly address?: string;
}
/**
 * Host-side RPC error codes for this channel. Restricted to the closed
 * RpcErrorCode union the browser Connection carrier validates against:
 * `bad-request` (invalid payloads, details `{issues: []}`),
 * `workspace-not-found` (unknown project scope, details `{workspaceId}`),
 * `command-error` (skill-level failures: missing, conflicting, reveal
 * refused; details `{}`), and `internal` (details `{}`). The human-readable
 * `message` carries the distinction the panel displays.
 */
export type SkillPanelErrorCode = 'bad-request' | 'workspace-not-found' | 'command-error' | 'internal';
export interface SkillPanelError {
    readonly code: SkillPanelErrorCode;
    readonly message: string;
    readonly details: Readonly<Record<string, unknown>>;
}
export type SkillPanelResult<T> = {
    readonly ok: true;
    readonly value: T;
} | {
    readonly ok: false;
    readonly error: SkillPanelError;
};
/** Host handler signature for one Connection RPC channel. */
export type SkillPanelHandler = (endpoint: string, payload: unknown, signal: AbortSignal) => Promise<SkillPanelResult<unknown>>;
/** Fold helpers used by both halves. */
export declare function ok<T>(value: T): SkillPanelResult<T>;
export declare function fail<T>(code: SkillPanelErrorCode, message: string, details?: Readonly<Record<string, unknown>>): SkillPanelResult<T>;
/** Read a string field from an unknown payload, tolerating absent payloads. */
export declare function readString(payload: unknown, field: string): string | undefined;
