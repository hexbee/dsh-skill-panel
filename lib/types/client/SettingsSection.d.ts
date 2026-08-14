import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import { type SkillPanelApi } from './api.ts';
import { NS } from './locales.ts';
/** The business face this section consumes. */
export interface SkillsSectionInjected {
    api: SkillPanelApi;
}
/** Full section props: runtime share + injected face + the locale seat. */
export type SkillsSectionProps = PropsRuntime<'settings.section'> & InjectFace<SkillsSectionInjected> & PropsLocale<typeof NS>;
/**
 * Render the section.
 * @param props - runtime share, the injected api, and `t`.
 * @returns the section element tree.
 */
export declare function SkillsSettingsSection({ api, t }: SkillsSectionProps): JSX.Element;
