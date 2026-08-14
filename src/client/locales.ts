/**
 * `skillPanel` locale namespace: the settings-section copy. Chinese is the
 * product copy; English mirrors it.
 */

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'nav': '技能',
  'title': '技能管理',
  'subtitle': '查看和管理全局技能目录（~/.agents/skills）与各项目级技能目录（.agents/skills）。',
  'scope.global': '全局技能',
  'scope.meta.skills': '{count} 个技能',
  'scope.meta.empty': '暂无技能',
  'scope.meta.missing': '目录尚未创建',
  'scope.projectsUnavailable': '当前部署未挂载工作区注册表，项目级技能目录不可用。',
  'toolbar.refresh': '刷新',
  'toolbar.revealRoot': '打开目录',
  'search.placeholder': '搜索技能…',
  'search.clear': '清除搜索',
  'search.empty': '没有匹配 "{query}" 的技能。',
  'dialog.cancel': '取消',
  'list.empty': '此目录下暂无技能。',
  'list.loadFailed': '加载技能列表失败。',
  'skill.kind.directory': '目录',
  'skill.kind.file': '文件',
  'skill.actions.view': '查看',
  'skill.actions.close': '收起',
  'skill.actions.reveal': '打开目录',
  'skill.actions.remove': '删除',
  'skill.remove.title': '删除技能',
  'skill.remove.confirm': '确定删除技能 "{name}" 吗？该操作会移除其整个目录，且无法撤销。',
  'skill.remove.ok': '技能 "{name}" 已删除。',
  'skill.remove.failed': '删除失败：{message}',
  'skill.reveal.failed': '打开失败：{message}',
  'detail.title': '技能详情',
  'detail.path': '路径',
  'detail.files': '目录内容',
  'detail.content': '正文',
  'detail.loadFailed': '读取技能详情失败。',
  'detail.close': '返回列表',
  'notice.error': '操作失败：{message}',
} satisfies Record<string, string>

/** The `skillPanel` namespace key union. */
export type SkillPanelKey = keyof typeof zh

/** English dictionary, checked complete against the zh key set. */
export const en: Record<SkillPanelKey, string> = {
  'nav': 'Skills',
  'title': 'Skill manager',
  'subtitle': 'View and manage the global skill directory (~/.agents/skills) and each project-level skill directory (.agents/skills).',
  'scope.global': 'Global skills',
  'scope.meta.skills': '{count} skills',
  'scope.meta.empty': 'No skills yet',
  'scope.meta.missing': 'Directory not created yet',
  'scope.projectsUnavailable': 'This deployment mounts no workspace registry, so project-level skill directories are unavailable.',
  'toolbar.refresh': 'Refresh',
  'toolbar.revealRoot': 'Open folder',
  'search.placeholder': 'Search skills…',
  'search.clear': 'Clear search',
  'search.empty': 'No skills match "{query}".',
  'dialog.cancel': 'Cancel',
  'list.empty': 'No skills in this directory yet.',
  'list.loadFailed': 'Failed to load the skill list.',
  'skill.kind.directory': 'Directory',
  'skill.kind.file': 'File',
  'skill.actions.view': 'View',
  'skill.actions.close': 'Collapse',
  'skill.actions.reveal': 'Open folder',
  'skill.actions.remove': 'Delete',
  'skill.remove.title': 'Delete skill',
  'skill.remove.confirm': 'Delete skill "{name}"? This removes its whole directory and cannot be undone.',
  'skill.remove.ok': 'Skill "{name}" deleted.',
  'skill.remove.failed': 'Delete failed: {message}',
  'skill.reveal.failed': 'Open failed: {message}',
  'detail.title': 'Skill details',
  'detail.path': 'Path',
  'detail.files': 'Contents',
  'detail.content': 'Body',
  'detail.loadFailed': 'Failed to read the skill.',
  'detail.close': 'Back to list',
  'notice.error': 'Operation failed: {message}',
}

/** Locale namespace id registered under ctx.locale. */
export const NS = 'skillPanel'

/**
 * Fill one dictionary template's `{name}`-style placeholders.
 * @param template - dictionary text.
 * @param params - placeholder values; absent params replace nothing.
 * @returns the filled text.
 */
export function fmt(template: string, params?: Record<string, string>): string {
  if (params === undefined) return template
  return template.replace(/\{(\w+)\}/g, (whole, key: string) => params[key] ?? whole)
}

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** The skill panel settings copy. */
    [NS]: SkillPanelKey
  }
}
