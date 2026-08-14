/**
 * The settings-section stylesheet, hand-written as a template string and
 * injected once by the plugin body: the web server serves exactly one file
 * per client plugin, so no separate CSS artifact may exist. Tokens come only
 * from the shared `--dsw-alias-*` design platform (no literal colors); class
 * names carry the `dsh_skill_panel` prefix to stay unique in the assembled
 * shell.
 */

/** Stable `<style>` element id (idempotent injection across HMR re-runs). */
export const STYLE_ID = 'dsh-skill-panel-style'

/** The settings section's injected stylesheet text. */
export const cssText = `
.dsh_skill_panel_section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
  color: var(--dsw-alias-label-primary);
}
.dsh_skill_panel_heading {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.dsh_skill_panel_title {
  margin: 0;
  font-size: 18px;
  line-height: 26px;
  font-weight: 600;
}
.dsh_skill_panel_subtitle {
  margin: 0;
  color: var(--dsw-alias-label-tertiary);
  font-size: 13px;
  line-height: 20px;
}
.dsh_skill_panel_toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.dsh_skill_panel_dropdown {
  position: relative;
  flex: 1 1 220px;
  max-width: 320px;
  min-width: 0;
}
.dsh_skill_panel_dropdownButton {
  appearance: none;
  box-sizing: border-box;
  width: 100%;
  height: 34px;
  font: inherit;
  color: var(--dsw-alias-label-primary);
  text-align: left;
  cursor: pointer;
  background: var(--dsw-alias-bg-layer-3);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  align-items: center;
  gap: 8px;
  padding: 0 10px 0 12px;
  font-size: 13px;
  line-height: 1.5;
  display: flex;
  transition: border-color .16s, background .16s;
}
.dsh_skill_panel_dropdownButton:hover:not(:disabled),
.dsh_skill_panel_dropdownButton[aria-expanded=true] {
  border-color: var(--dsw-alias-label-dimmed);
}
.dsh_skill_panel_dropdownButton:focus-visible {
  border-color: var(--dsw-alias-brand-primary);
  outline: none;
}
.dsh_skill_panel_dropdownButton:disabled {
  cursor: default;
  color: var(--dsw-alias-label-tertiary);
}
.dsh_skill_panel_dropdownValue {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.dsh_skill_panel_dropdownChevron {
  flex: none;
  color: var(--dsw-alias-label-tertiary);
  transition: transform .16s;
}
.dsh_skill_panel_dropdownChevronOpen {
  transform: rotate(180deg);
}
.dsh_skill_panel_dropdownMenu {
  z-index: 30;
  box-sizing: border-box;
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  min-width: 100%;
  width: max-content;
  max-width: 420px;
  max-height: 320px;
  padding: 4px;
  background: var(--dsw-alias-bg-overlay, var(--dsw-alias-bg-layer-2));
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 10px;
  box-shadow: 0 8px 24px #00000033;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: auto;
}
.dsh_skill_panel_dropdownOption {
  appearance: none;
  box-sizing: border-box;
  width: 100%;
  font: inherit;
  text-align: left;
  cursor: pointer;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  border: 0;
  border-radius: 7px;
  flex-direction: column;
  align-items: stretch;
  gap: 1px;
  padding: 6px 10px;
  font-size: 13px;
  line-height: 18px;
  display: flex;
}
.dsh_skill_panel_dropdownOption:hover {
  background: var(--dsw-alias-interactive-bg-hover, var(--dsw-alias-bg-layer-1));
}
.dsh_skill_panel_dropdownOption:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: -2px;
}
.dsh_skill_panel_dropdownOptionActive {
  background: var(--dsw-alias-interactive-bg-hover, var(--dsw-alias-bg-layer-1));
}
.dsh_skill_panel_dropdownOptionLabel {
  min-width: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-weight: 500;
}
.dsh_skill_panel_dropdownOptionMeta {
  min-width: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: var(--dsw-alias-label-tertiary);
  font-size: 11.5px;
  line-height: 16px;
}
.dsh_skill_panel_button {
  appearance: none;
  font: inherit;
  cursor: pointer;
  border: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-layer-3);
  color: var(--dsw-alias-label-secondary);
  border-radius: 8px;
  padding: 5px 12px;
  font-size: 13px;
  line-height: 1.5;
  white-space: nowrap;
}
.dsh_skill_panel_button:hover:not(:disabled) {
  color: var(--dsw-alias-label-primary);
  border-color: var(--dsw-alias-label-dimmed);
}
.dsh_skill_panel_button:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: 1px;
}
.dsh_skill_panel_button:disabled {
  cursor: default;
  opacity: 0.55;
}
.dsh_skill_panel_buttonDanger {
  background: var(--dsw-alias-state-error-primary);
  border-color: transparent;
  color: var(--dsw-alias-bg-layer-3);
}
.dsh_skill_panel_buttonDanger:hover:not(:disabled) {
  background: var(--dsw-alias-state-error-primary);
  border-color: transparent;
  color: var(--dsw-alias-bg-layer-3);
  opacity: 0.92;
}
.dsh_skill_panel_search {
  position: relative;
  flex: 1 1 180px;
  max-width: 340px;
  min-width: 0;
}
.dsh_skill_panel_searchInput {
  box-sizing: border-box;
  width: 100%;
  height: 34px;
  font: inherit;
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-bg-layer-3);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  padding: 0 30px 0 12px;
  font-size: 13px;
  line-height: 1.5;
}
.dsh_skill_panel_searchInput:focus-visible {
  border-color: var(--dsw-alias-brand-primary);
  outline: none;
}
.dsh_skill_panel_searchInput::placeholder {
  color: var(--dsw-alias-label-tertiary);
}
.dsh_skill_panel_searchInput:disabled {
  color: var(--dsw-alias-label-tertiary);
  cursor: default;
}
.dsh_skill_panel_searchClear {
  appearance: none;
  position: absolute;
  top: 50%;
  right: 6px;
  transform: translateY(-50%);
  width: 22px;
  height: 22px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--dsw-alias-label-tertiary);
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 6px;
}
.dsh_skill_panel_searchClear:hover {
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-interactive-bg-hover, var(--dsw-alias-bg-layer-1));
}
.dsh_skill_panel_searchClear:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: 0;
}
.dsh_skill_panel_notice {
  margin: 0;
  padding: 10px 12px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  color: var(--dsw-alias-label-secondary);
  background: var(--dsw-alias-bg-layer-2);
  font-size: 13px;
  line-height: 20px;
}
.dsh_skill_panel_noticeError {
  color: var(--dsw-alias-label-error);
  border-color: var(--dsw-alias-label-error);
}
.dsh_skill_panel_card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  padding: 14px 16px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 12px;
  background: var(--dsw-alias-bg-layer-1);
}
.dsh_skill_panel_formFooter {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
}
.dsh_skill_panel_list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.dsh_skill_panel_item {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  padding: 12px 16px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 12px;
  background: var(--dsw-alias-bg-layer-1);
}
.dsh_skill_panel_item:hover {
  border-color: var(--dsw-alias-label-dimmed);
}
.dsh_skill_panel_itemMain {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.dsh_skill_panel_itemName {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
}
.dsh_skill_panel_itemDesc {
  margin: 0;
  color: var(--dsw-alias-label-tertiary);
  font-size: 12.5px;
  line-height: 18px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.dsh_skill_panel_badge {
  flex: none;
  white-space: nowrap;
  background: var(--dsw-alias-bg-module-platform);
  color: var(--dsw-alias-label-secondary);
  border-radius: 999px;
  padding: 1px 8px;
  font-size: 11px;
  font-weight: 500;
  line-height: 17px;
}
.dsh_skill_panel_itemActions {
  flex: none;
  display: flex;
  align-items: center;
  gap: 6px;
}
.dsh_skill_panel_detail {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}
.dsh_skill_panel_detailHead {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}
.dsh_skill_panel_detailName {
  margin: 0;
  font-size: 15px;
  line-height: 22px;
  font-weight: 600;
}
.dsh_skill_panel_detailPath {
  margin: 0;
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  line-height: 18px;
  word-break: break-all;
  font-family: var(--dsw-alias-font-mono, ui-monospace, monospace);
}
.dsh_skill_panel_detailSection {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}
.dsh_skill_panel_detailLabel {
  font-size: 12px;
  line-height: 18px;
  font-weight: 600;
  color: var(--dsw-alias-label-secondary);
}
.dsh_skill_panel_fileList {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.dsh_skill_panel_fileItem {
  font-size: 12.5px;
  line-height: 18px;
  color: var(--dsw-alias-label-secondary);
  font-family: var(--dsw-alias-font-mono, ui-monospace, monospace);
  word-break: break-all;
}
.dsh_skill_panel_pre {
  margin: 0;
  padding: 12px 14px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 10px;
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-primary);
  font-family: var(--dsw-alias-font-mono, ui-monospace, monospace);
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 480px;
  overflow: auto;
}
.dsh_skill_panel_empty {
  margin: 0;
  color: var(--dsw-alias-label-tertiary);
  font-size: 13px;
  line-height: 20px;
}
.dsh_skill_panel_dialog {
  box-sizing: border-box;
  width: min(440px, calc(100vw - 48px));
  margin: auto;
  padding: 0;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 14px;
  background: var(--dsw-alias-bg-overlay, var(--dsw-alias-bg-layer-2));
  color: var(--dsw-alias-label-primary);
  box-shadow: 0 16px 48px #00000059;
}
.dsh_skill_panel_dialog::backdrop {
  background: #0000005c;
}
.dsh_skill_panel_dialogBody {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  padding: 18px 20px 16px;
}
.dsh_skill_panel_dialogTitle {
  margin: 0;
  font-size: 15px;
  line-height: 22px;
  font-weight: 600;
}
.dsh_skill_panel_dialogText {
  margin: 0;
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  line-height: 20px;
  overflow-wrap: anywhere;
}
.dsh_skill_panel_dialogFooter {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
}
`

/** Inject the stylesheet once, idempotently. */
export function adoptStyles(): void {
  if (typeof document === 'undefined') return
  if (document.getElementById(STYLE_ID) !== null) return
  const tag = document.createElement('style')
  tag.id = STYLE_ID
  tag.dataset.plugin = 'dsh-skill-panel'
  tag.textContent = cssText
  document.head.appendChild(tag)
}
