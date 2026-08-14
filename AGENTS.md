# AGENTS.md

Standing orders for this repository. The product contract lives in [README.md](README.md); these rules govern how the repo is changed.

## Layout

- `src/` — TypeScript source. `src/index.ts` is the host plugin (the `/skill-panel` Connection RPC channel); `src/catalog.ts` is the pure filesystem catalog; `src/contract.ts` is the shared wire contract both halves use; `src/client/` is the browser half (settings section + locales + styles).
- `lib/` — committed build artifacts. The harness profile resolves `main`, `./client`, and `./invariant` from here; **every source change that should be installable must rebuild and commit `lib/` in the same commit**.
- `tests/` — `node --test` suites importing the catalog source directly.

## Build and checks

- `pnpm run typecheck`, `pnpm run build`, and `node --test tests/catalog.test.mjs` must all be green before a commit claims completion.
- `yaml` MUST stay external in the host ESM build (`hostExternal` in build.mjs): bundling it leaves `require("process")` dynamic requires in the ESM entry and the loader refuses to import the plugin, failing the whole tree at boot. The client build never includes yaml.
- Before declaring a change installable, import the built `lib/index.js` and `lib/invariant.js` through their `file://` URLs from a neutral cwd (exactly the loader's path) and exercise the overview endpoint with the stub cordis context.
- The catalog is pure node:fs code and unit-tested (frontmatter acceptance, directory/flat discovery, symlink following, read/remove).

## Wire discipline

- The client never submits a raw filesystem path: project scopes are workspace ids resolved Host-side; skill mutations are addressed by a name inside one of the two managed roots.
- The channel returns only codes from the closed RpcErrorCode union the browser Connection carrier validates: `bad-request` (`{issues: []}`), `workspace-not-found` (`{workspaceId}`), `command-error` (`{}`), `internal` (`{}`).

## Integration

- The plugin mounts into a dsh profile via `dsh plugin --profile <name> add file:/path/to/dsh-skill-panel` (bundle route). Its `dsh.bundle.patch` inserts one row; the profile's healed `node_modules` resolves the bare name.
- Host plugin-set changes take effect on server restart; client bundle changes are served from `lib/client.js` after a rebuild (page refresh).
- The harness checkout that feeds type checking is the installed profile (`link:` devDependencies into `~/.dsh/profiles/node_modules`). When that snapshot moves, re-run `pnpm install`, `pnpm run build`, and fix API drift before integrating.
