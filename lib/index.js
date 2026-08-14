// src/index.ts
import { execFile } from "node:child_process";
import { homedir } from "node:os";
import { join as join2 } from "node:path";

// src/catalog.ts
import { mkdir, readdir, readFile, rm, stat } from "node:fs/promises";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";

// src/contract.ts
var SKILL_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
function ok(value) {
  return { ok: true, value };
}
function fail(code, message, details = {}) {
  const error = { code, message, details };
  return { ok: false, error };
}
function readString(payload, field) {
  if (payload === null || typeof payload !== "object" || Array.isArray(payload)) return void 0;
  const value = payload[field];
  return typeof value === "string" ? value : void 0;
}

// src/catalog.ts
function parseSkillBody(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(raw);
  if (match === null) return void 0;
  let data;
  try {
    data = parseYaml(match[1]);
  } catch {
    return void 0;
  }
  if (data === null || typeof data !== "object" || Array.isArray(data)) return void 0;
  const record = data;
  const name2 = record.name;
  const description = record.description;
  if (typeof name2 !== "string" || typeof description !== "string") return void 0;
  if (!SKILL_NAME.test(name2)) return void 0;
  const whenToUse = typeof record.whenToUse === "string" ? record.whenToUse : void 0;
  return {
    name: name2,
    description,
    ...whenToUse === void 0 ? {} : { whenToUse },
    frontmatter: record,
    content: raw.slice(match[0].length).trim()
  };
}
async function listEntryNames(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return entries.map((entry) => entry.isDirectory() ? `${entry.name}/` : entry.name).sort((a, b) => a.localeCompare(b));
}
async function entryKindOf(skillsRoot, entry) {
  if (entry.isDirectory()) return "directory";
  if (entry.isFile()) return "file";
  if (entry.isSymbolicLink()) {
    try {
      const target = await stat(join(skillsRoot, entry.name));
      if (target.isDirectory()) return "directory";
      if (target.isFile()) return "file";
    } catch {
      return "other";
    }
  }
  return "other";
}
function directoryBodyPath(skillsRoot, dirName) {
  return join(skillsRoot, dirName, "SKILL.md");
}
async function scanSkillsRoot(skillsRoot) {
  let entries;
  try {
    entries = await readdir(skillsRoot, { withFileTypes: true });
  } catch (error) {
    if (isAbsentError(error)) return [];
    throw error;
  }
  const views = [];
  for (const entry of entries) {
    const kind = await entryKindOf(skillsRoot, entry);
    if (kind === "directory") {
      const path = directoryBodyPath(skillsRoot, entry.name);
      const parsed = await readSkillBody(path);
      if (parsed === void 0) continue;
      const files = await listEntryNames(join(skillsRoot, entry.name)).catch(() => []);
      views.push({
        address: entry.name,
        name: parsed.name,
        description: parsed.description,
        ...parsed.whenToUse === void 0 ? {} : { whenToUse: parsed.whenToUse },
        kind: "directory",
        path,
        files,
        size: parsed.content.length
      });
      continue;
    }
    if (kind === "file" && entry.name.endsWith(".md")) {
      const path = join(skillsRoot, entry.name);
      const parsed = await readSkillBody(path);
      if (parsed === void 0) continue;
      views.push({
        address: entry.name.slice(0, -3),
        name: parsed.name,
        description: parsed.description,
        ...parsed.whenToUse === void 0 ? {} : { whenToUse: parsed.whenToUse },
        kind: "file",
        path,
        files: [],
        size: parsed.content.length
      });
    }
  }
  return views.sort((a, b) => a.address.localeCompare(b.address));
}
async function readSkillBody(path) {
  let raw;
  try {
    raw = await readFile(path, "utf8");
  } catch (error) {
    if (isAbsentError(error)) return void 0;
    throw error;
  }
  return parseSkillBody(raw);
}
async function resolveEntry(skillsRoot, address) {
  if (address.length === 0 || address.includes("/") || address.includes("\\") || address === "." || address === "..") return void 0;
  const dirCandidate = join(skillsRoot, address);
  try {
    const info = await stat(dirCandidate);
    if (info.isDirectory()) return { path: directoryBodyPath(skillsRoot, address), dir: dirCandidate, kind: "directory" };
  } catch {
  }
  const fileCandidate = join(skillsRoot, `${address}.md`);
  try {
    const info = await stat(fileCandidate);
    if (info.isFile()) return { path: fileCandidate, dir: skillsRoot, kind: "file" };
  } catch {
    return void 0;
  }
  return void 0;
}
async function readSkill(skillsRoot, address) {
  const entry = await resolveEntry(skillsRoot, address);
  if (entry === void 0) return void 0;
  const parsed = await readSkillBody(entry.path);
  if (parsed === void 0) return void 0;
  const files = entry.kind === "directory" ? await listEntryNames(entry.dir).catch(() => []) : [];
  return {
    address,
    name: parsed.name,
    description: parsed.description,
    ...parsed.whenToUse === void 0 ? {} : { whenToUse: parsed.whenToUse },
    kind: entry.kind,
    path: entry.path,
    files,
    frontmatter: parsed.frontmatter,
    content: parsed.content
  };
}
async function removeSkill(skillsRoot, address) {
  const entry = await resolveEntry(skillsRoot, address);
  if (entry === void 0) return false;
  await rm(entry.kind === "directory" ? entry.dir : entry.path, { recursive: true, force: true });
  return true;
}
async function revealTarget(skillsRoot, address) {
  if (address === void 0 || address.length === 0) {
    await mkdir(skillsRoot, { recursive: true });
    return skillsRoot;
  }
  const entry = await resolveEntry(skillsRoot, address);
  return entry === void 0 ? skillsRoot : entry.kind === "directory" ? entry.dir : entry.path;
}
function isAbsentError(error) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}

// src/index.ts
var name = "dsh-skill-panel";
var inject = ["connection"];
async function existsDir(path) {
  try {
    const { stat: stat2 } = await import("node:fs/promises");
    return (await stat2(path)).isDirectory();
  } catch {
    return false;
  }
}
async function reveal(path) {
  const runner = (command, args) => new Promise((resolve, reject) => {
    execFile(command, args, (error) => error === null ? resolve() : reject(error));
  });
  if (process.platform === "darwin") return await runner("open", [path]);
  if (process.platform === "win32") return await runner("explorer", [path]);
  return await runner("xdg-open", [path]);
}
function resolveRoot(registry, globalDir, scope) {
  if (scope === "global") return globalDir;
  const workspace = registry?.list().find((candidate) => candidate.id === scope);
  if (workspace === void 0) {
    return registry === void 0 ? fail("command-error", "\u9879\u76EE\u7EA7\u6280\u80FD\u76EE\u5F55\u4E0D\u53EF\u7528\uFF1A\u5F53\u524D\u90E8\u7F72\u672A\u6302\u8F7D\u5DE5\u4F5C\u533A\u6CE8\u518C\u8868\u3002", {}) : fail("workspace-not-found", `\u5DE5\u4F5C\u533A "${scope}" \u4E0D\u5B58\u5728\u6216\u5DF2\u88AB\u5220\u9664\u3002`, { workspaceId: scope });
  }
  return join2(workspace.path, ".agents", "skills");
}
function apply(ctx) {
  const agentsHome = process.env.DSH_AGENTS_HOME ?? join2(homedir(), ".agents");
  const globalDir = join2(agentsHome, "skills");
  const handler = async (endpoint, payload) => {
    try {
      const registry = ctx.get("workspaceRegistry");
      switch (endpoint) {
        case "overview": {
          const projects = [];
          const projectSkills = {};
          for (const workspace of registry?.list() ?? []) {
            const skillsDir = join2(workspace.path, ".agents", "skills");
            const exists = await existsDir(skillsDir);
            projects.push({ id: workspace.id, title: workspace.title, path: workspace.path, skillsDir, exists });
            projectSkills[workspace.id] = await scanSkillsRoot(skillsDir);
          }
          const overview = {
            globalDir,
            globalExists: await existsDir(globalDir),
            globalSkills: await scanSkillsRoot(globalDir),
            projects,
            projectSkills,
            projectsUnavailable: registry === void 0
          };
          return ok(overview);
        }
        case "read": {
          const scope = readString(payload, "scope");
          const address = readString(payload, "address");
          if (scope === void 0 || address === void 0) {
            return fail("bad-request", "read \u9700\u8981 scope \u4E0E address\u3002", { issues: [] });
          }
          const root = resolveRoot(registry, globalDir, scope);
          if (typeof root !== "string") return root;
          const detail = await readSkill(root, address);
          if (detail === void 0) return fail("command-error", `\u6280\u80FD "${address}" \u4E0D\u5B58\u5728\u3002`, {});
          return ok(detail);
        }
        case "remove": {
          const scope = readString(payload, "scope");
          const address = readString(payload, "address");
          if (scope === void 0 || address === void 0) {
            return fail("bad-request", "remove \u9700\u8981 scope \u4E0E address\u3002", { issues: [] });
          }
          const root = resolveRoot(registry, globalDir, scope);
          if (typeof root !== "string") return root;
          const removed = await removeSkill(root, address);
          if (!removed) return fail("command-error", `\u6280\u80FD "${address}" \u4E0D\u5B58\u5728\u3002`, {});
          return ok({ removed: true });
        }
        case "reveal": {
          const scope = readString(payload, "scope");
          if (scope === void 0) return fail("bad-request", "reveal \u9700\u8981 scope\u3002", { issues: [] });
          const root = resolveRoot(registry, globalDir, scope);
          if (typeof root !== "string") return root;
          const target = await revealTarget(root, readString(payload, "address"));
          try {
            await reveal(target);
            return ok({ path: target });
          } catch (error) {
            return fail("command-error", `\u65E0\u6CD5\u6253\u5F00\u76EE\u5F55\uFF1A${error instanceof Error ? error.message : String(error)}`, {});
          }
        }
        default:
          return fail("bad-request", `\u672A\u77E5\u7AEF\u70B9 "${endpoint}"\u3002`, { issues: [] });
      }
    } catch (error) {
      ctx.logger?.warn(`skill-panel: ${endpoint} failed: ${error instanceof Error ? error.message : String(error)}`);
      return fail("internal", error instanceof Error ? error.message : String(error), {});
    }
  };
  ctx.connection.rpc.handle("/skill-panel", handler, { authority: "loopback" });
}
export {
  apply,
  inject,
  name
};
//# sourceMappingURL=index.js.map
