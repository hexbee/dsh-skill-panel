import type { Context } from '@deepseek-ai/cordis';
/** Cordis plugin name (the profile patch mounts the package under this id). */
export declare const name = "dsh-skill-panel";
/** The browser transport is a hard dependency: without it there is no panel. */
export declare const inject: string[];
/**
 * Compose the plugin body: one loopback-pinned RPC channel.
 * @param ctx - Host plugin context (connection service provided by injection).
 */
export declare function apply(ctx: Context): void;
