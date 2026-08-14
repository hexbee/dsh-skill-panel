/**
 * Single-file client + ESM host build for dsh-skill-panel.
 *
 * The web server serves exactly one file per plugin (/plugins/dsh-skill-panel/client.js),
 * so the client half is one CJS bundle wrapped in the ModuleLoader factory
 * handshake; @deepseek-ai/dsh-* and react stay external (the profile's healed
 * node_modules and the app's module system provide them). The host half is
 * plain ESM for Node, externalizing @deepseek-ai/dsh-* plus cordis.
 */
import { build } from 'esbuild'
import { mkdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

mkdirSync('lib', { recursive: true })

const dshExternal = ['@deepseek-ai/cordis', '@deepseek-ai/dsh-*']
// yaml must stay external on the host side: bundling it into an ESM entry
// leaves its `require("process")` dynamic requires in place, which the
// loader's ESM import rejects ("Dynamic require of ... is not supported").
// The profile resolves the declared dependency from its hoisted node_modules.
const hostExternal = [...dshExternal, 'yaml']

await build({
  entryPoints: ['src/index.ts'],
  outfile: 'lib/index.js',
  bundle: true,
  format: 'esm',
  platform: 'node',
  target: ['node22'],
  sourcemap: true,
  external: hostExternal,
  logLevel: 'info',
})

await build({
  entryPoints: ['src/invariant.ts'],
  outfile: 'lib/invariant.js',
  bundle: true,
  format: 'esm',
  platform: 'node',
  target: ['node22'],
  sourcemap: true,
  external: hostExternal,
  logLevel: 'info',
})

await build({
  entryPoints: ['src/client/index.ts'],
  outfile: 'lib/client.js',
  bundle: true,
  format: 'cjs',
  platform: 'browser',
  target: ['es2022'],
  sourcemap: true,
  jsx: 'automatic',
  external: [...dshExternal, 'react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'scheduler'],
  banner: {
    js: "window.__ModuleLoader__.load({ id: 'dsh-skill-panel', factory: (require) => { var module = { exports: {} }; var exports = module.exports;",
  },
  footer: {
    js: 'return module.exports; } });',
  },
  logLevel: 'info',
})

execFileSync('node_modules/.bin/tsc', ['-p', 'tsconfig.json'], { stdio: 'inherit' })
