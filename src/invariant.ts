/**
 * Package-owned invariant companion for `dsh-skill-panel`.
 * @module dsh-skill-panel/invariant
 */

/* jscpd:ignore-start */
import type { Context } from '@deepseek-ai/cordis'
import type { InvariantInstaller } from '@deepseek-ai/dsh-invariants'

const PACKAGE_NAME = 'dsh-skill-panel'

/** Cordis companion plugin name. */
export const name = 'dsh-skill-panel-invariant'
/** Service required before the companion can reserve package ownership. */
export const inject = ['invariants']

/**
 * No runtime invariant: the plugin owns no mutable cross-plugin state. Every
 * filesystem mutation stays inside the two managed skill roots, the RPC
 * channel registers on the caller fiber (connection-owned disposal), and the
 * client section keeps its UI state in component-local React state.
 */
const install: InvariantInstaller = () => {}

/**
 * Register this package's invariant companion.
 * @param ctx - Cordis context carrying the invariant service.
 * @returns the installed registration's disposer after setup succeeds.
 */
export const apply = (ctx: Context): Promise<() => void> =>
  Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install))
/* jscpd:ignore-end */
