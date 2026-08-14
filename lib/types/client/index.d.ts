/**
 * dsh-skill-panel client plugin: the browser half of the skill manager.
 * Registers the `skills` settings section, the locale dictionaries, and the
 * section stylesheet; all skill data crosses the Host `/skill-panel` channel
 * through the injected api face. No harness allowlist is touched.
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
/** Required services: the connection transport, slots, and locale. */
export declare const inject: string[];
/**
 * Compose the skill manager surface.
 * @param ctx - client root context.
 */
export declare function apply(ctx: ClientContext): void;
