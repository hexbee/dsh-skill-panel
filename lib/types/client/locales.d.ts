/**
 * `skillPanel` locale namespace: the settings-section copy. Chinese is the
 * product copy; English mirrors it.
 */
/** Simplified Chinese dictionary (the key-set source of truth). */
export declare const zh: {
    nav: string;
    title: string;
    subtitle: string;
    'scope.global': string;
    'scope.meta.skills': string;
    'scope.meta.empty': string;
    'scope.meta.missing': string;
    'scope.projectsUnavailable': string;
    'toolbar.refresh': string;
    'toolbar.revealRoot': string;
    'search.placeholder': string;
    'search.clear': string;
    'search.empty': string;
    'dialog.cancel': string;
    'list.empty': string;
    'list.loadFailed': string;
    'skill.kind.directory': string;
    'skill.kind.file': string;
    'skill.actions.view': string;
    'skill.actions.close': string;
    'skill.actions.reveal': string;
    'skill.actions.remove': string;
    'skill.remove.title': string;
    'skill.remove.confirm': string;
    'skill.remove.ok': string;
    'skill.remove.failed': string;
    'skill.reveal.failed': string;
    'detail.title': string;
    'detail.path': string;
    'detail.files': string;
    'detail.content': string;
    'detail.loadFailed': string;
    'detail.close': string;
    'notice.error': string;
};
/** The `skillPanel` namespace key union. */
export type SkillPanelKey = keyof typeof zh;
/** English dictionary, checked complete against the zh key set. */
export declare const en: Record<SkillPanelKey, string>;
/** Locale namespace id registered under ctx.locale. */
export declare const NS = "skillPanel";
/**
 * Fill one dictionary template's `{name}`-style placeholders.
 * @param template - dictionary text.
 * @param params - placeholder values; absent params replace nothing.
 * @returns the filled text.
 */
export declare function fmt(template: string, params?: Record<string, string>): string;
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** The skill panel settings copy. */
        [NS]: SkillPanelKey;
    }
}
