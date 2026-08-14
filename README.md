# dsh-skill-panel

A DeepSeek Harness web plugin that adds a **Skills** panel to the settings page for viewing and managing the local skill directories:

- Global: `~/.agents/skills` (respects `DSH_AGENTS_HOME`)
- Project-level: `<workspace>/.agents/skills` for every workspace registered in the harness

The panel lists each skill (directory bundles with `SKILL.md` and flat `.md` files — symbolic links are followed, matching the harness's own discovery), shows its description, body and directory contents, searches across the active scope, removes skills, and reveals them in the platform file manager. Chinese and English copy included.

## Layout

- `src/` — TypeScript source. `src/index.ts` is the host plugin (one loopback-pinned Connection RPC channel `/skill-panel`); `src/catalog.ts` is the pure filesystem catalog (scan/read/remove/reveal); `src/client/` is the browser half (settings section, locales, styles); `src/contract.ts` is the shared wire contract.
- `lib/` — committed build artifacts (`lib/index.js`, `lib/invariant.js`, `lib/client.js`); the profile resolves `main`, `./client`, and `./invariant` from here.
- `tests/` — `node --test` suites over the catalog.

## Build

```
pnpm install
pnpm run build   # esbuild bundles + tsc declarations
node --test tests/catalog.test.mjs
```

## Integration

Install into a profile with the bundle route:

```
dsh plugin --profile <name> add file:/path/to/dsh-skill-panel
```

The package's `dsh.bundle.patch` inserts one row; the profile's healed `node_modules` resolves the bare name. Host plugin-set changes take effect on server restart; client bundle changes are served from `lib/client.js` after a rebuild (page refresh).

## Security

- The RPC channel is pinned to loopback (`authority: 'loopback'`), like every settings surface.
- Project scopes are addressed only by Host-registered workspace ids — the browser never submits a raw filesystem path.
- Every mutation is confined to `~/.agents/skills` or `<workspace>/.agents/skills`.
- Removing a symlinked skill unlinks the link only; the linked target is untouched.
