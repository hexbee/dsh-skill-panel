# dsh-skill-panel

[简体中文](README.zh.md)

A DeepSeek Harness plugin that adds a **Skills** panel to the settings page for managing and viewing the local skill directories:

- Global: `~/.agents/skills` (respects `DSH_AGENTS_HOME`)
- Project-level: `<workspace>/.agents/skills` for every workspace registered in the harness

The panel lists each skill, shows its description, body and directory contents, supports searching across the current scope, removing skills, and opening the directory in the system file manager. Chinese and English copy included.

![dsh-skill-panel settings panel](ScreenShot-dsh-skill-panel.png)

## Layout

- `src/` — TypeScript source. `src/index.ts` is the host plugin (one loopback-pinned Connection RPC channel `/skill-panel`); `src/catalog.ts` is the pure filesystem catalog (scan/read/remove/open); `src/client/` is the browser half (settings section, locales, styles); `src/contract.ts` is the shared wire contract.
- `lib/` — committed build artifacts (`lib/index.js`, `lib/invariant.js`, `lib/client.js`); the profile resolves `main`, `./client`, and `./invariant` from here.
- `tests/` — `node --test` suites over the catalog.

## Build

```
pnpm install
pnpm run build   # esbuild bundles + tsc declarations
node --test tests/catalog.test.mjs
```

## Integration

Install into a profile with the bundle route, from a local path:

```
dsh plugin --profile web add file:/path/to/dsh-skill-panel
```

or directly from GitHub:

```
dsh plugin --profile web add git+https://github.com/hexbee/dsh-skill-panel.git
```

## Security

- The RPC channel is pinned to loopback (`authority: 'loopback'`), like every settings surface.
- Project scopes are addressed only by Host-registered workspace ids — the browser never submits a raw filesystem path.
- Every mutation is confined to `~/.agents/skills` or `<workspace>/.agents/skills`.
- Removing a symlinked skill unlinks the link only; the linked target is untouched.
