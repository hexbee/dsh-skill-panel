/**
 * dsh-skill-panel client plugin: the browser half of the skill manager.
 * Registers the `skills` settings section, the locale dictionaries, and the
 * section stylesheet; all skill data crosses the Host `/skill-panel` channel
 * through the injected api face. No harness allowlist is touched.
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
// Type-only: the ctx.locale Context merge.
import type {} from '@deepseek-ai/dsh-client-locale/client'
// Type-only: the settings.section SlotMap entry.
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type { ClientConnectionRpc } from '@deepseek-ai/dsh-client-connection/client'
import { createSkillPanelApi } from './api.ts'
import { NS, en, zh } from './locales.ts'
import { adoptStyles } from './styles.ts'
import { SkillsSettingsSection, type SkillsSectionInjected } from './SettingsSection.tsx'

/** Required services: the connection transport, slots, and locale. */
export const inject = ['connection', 'slots', 'locale']

/** Structural face of the browser Connection service. */
interface ConnectionFace {
  readonly rpc: ClientConnectionRpc
}

/**
 * Compose the skill manager surface.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  adoptStyles()
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-skill-panel: section dictionaries')

  const t = ctx.locale.bind(NS)
  const connection = ctx.get('connection') as unknown as ConnectionFace
  const api = createSkillPanelApi(connection.rpc)

  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'skills',
    order: 40,
    label: () => t('nav'),
    locale: NS,
    inject: (): SkillsSectionInjected => ({ api }),
  }, SkillsSettingsSection))
}
