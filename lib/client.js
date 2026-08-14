window.__ModuleLoader__.load({ id: 'dsh-skill-panel', factory: (require) => { var module = { exports: {} }; var exports = module.exports;
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.ts
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);

// src/client/api.ts
var SkillPanelApiError = class extends Error {
  code;
  constructor(code, message) {
    super(message);
    this.code = code;
  }
};
async function call(rpc, endpoint, payload) {
  const result = await rpc.call("/skill-panel", endpoint, payload);
  if (!result.ok) throw new SkillPanelApiError(result.error.code, result.error.message);
  return result.value;
}
function createSkillPanelApi(rpc) {
  return {
    overview: () => call(rpc, "overview", {}),
    read: (request) => call(rpc, "read", request),
    remove: (request) => call(rpc, "remove", request),
    reveal: (request) => call(rpc, "reveal", request)
  };
}

// src/client/locales.ts
var zh = {
  "nav": "\u6280\u80FD",
  "title": "\u6280\u80FD\u7BA1\u7406",
  "subtitle": "\u67E5\u770B\u548C\u7BA1\u7406\u5168\u5C40\u6280\u80FD\u76EE\u5F55\uFF08~/.agents/skills\uFF09\u4E0E\u5404\u9879\u76EE\u7EA7\u6280\u80FD\u76EE\u5F55\uFF08.agents/skills\uFF09\u3002",
  "scope.global": "\u5168\u5C40\u6280\u80FD",
  "scope.meta.skills": "{count} \u4E2A\u6280\u80FD",
  "scope.meta.empty": "\u6682\u65E0\u6280\u80FD",
  "scope.meta.missing": "\u76EE\u5F55\u5C1A\u672A\u521B\u5EFA",
  "scope.projectsUnavailable": "\u5F53\u524D\u90E8\u7F72\u672A\u6302\u8F7D\u5DE5\u4F5C\u533A\u6CE8\u518C\u8868\uFF0C\u9879\u76EE\u7EA7\u6280\u80FD\u76EE\u5F55\u4E0D\u53EF\u7528\u3002",
  "toolbar.refresh": "\u5237\u65B0",
  "toolbar.revealRoot": "\u6253\u5F00\u76EE\u5F55",
  "search.placeholder": "\u641C\u7D22\u6280\u80FD\u2026",
  "search.clear": "\u6E05\u9664\u641C\u7D22",
  "search.empty": '\u6CA1\u6709\u5339\u914D "{query}" \u7684\u6280\u80FD\u3002',
  "dialog.cancel": "\u53D6\u6D88",
  "list.empty": "\u6B64\u76EE\u5F55\u4E0B\u6682\u65E0\u6280\u80FD\u3002",
  "list.loadFailed": "\u52A0\u8F7D\u6280\u80FD\u5217\u8868\u5931\u8D25\u3002",
  "skill.kind.directory": "\u76EE\u5F55",
  "skill.kind.file": "\u6587\u4EF6",
  "skill.actions.view": "\u67E5\u770B",
  "skill.actions.close": "\u6536\u8D77",
  "skill.actions.reveal": "\u6253\u5F00\u76EE\u5F55",
  "skill.actions.remove": "\u5220\u9664",
  "skill.remove.title": "\u5220\u9664\u6280\u80FD",
  "skill.remove.confirm": '\u786E\u5B9A\u5220\u9664\u6280\u80FD "{name}" \u5417\uFF1F\u8BE5\u64CD\u4F5C\u4F1A\u79FB\u9664\u5176\u6574\u4E2A\u76EE\u5F55\uFF0C\u4E14\u65E0\u6CD5\u64A4\u9500\u3002',
  "skill.remove.ok": '\u6280\u80FD "{name}" \u5DF2\u5220\u9664\u3002',
  "skill.remove.failed": "\u5220\u9664\u5931\u8D25\uFF1A{message}",
  "skill.reveal.failed": "\u6253\u5F00\u5931\u8D25\uFF1A{message}",
  "detail.title": "\u6280\u80FD\u8BE6\u60C5",
  "detail.path": "\u8DEF\u5F84",
  "detail.files": "\u76EE\u5F55\u5185\u5BB9",
  "detail.content": "\u6B63\u6587",
  "detail.loadFailed": "\u8BFB\u53D6\u6280\u80FD\u8BE6\u60C5\u5931\u8D25\u3002",
  "detail.close": "\u8FD4\u56DE\u5217\u8868",
  "notice.error": "\u64CD\u4F5C\u5931\u8D25\uFF1A{message}"
};
var en = {
  "nav": "Skills",
  "title": "Skill manager",
  "subtitle": "View and manage the global skill directory (~/.agents/skills) and each project-level skill directory (.agents/skills).",
  "scope.global": "Global skills",
  "scope.meta.skills": "{count} skills",
  "scope.meta.empty": "No skills yet",
  "scope.meta.missing": "Directory not created yet",
  "scope.projectsUnavailable": "This deployment mounts no workspace registry, so project-level skill directories are unavailable.",
  "toolbar.refresh": "Refresh",
  "toolbar.revealRoot": "Open folder",
  "search.placeholder": "Search skills\u2026",
  "search.clear": "Clear search",
  "search.empty": 'No skills match "{query}".',
  "dialog.cancel": "Cancel",
  "list.empty": "No skills in this directory yet.",
  "list.loadFailed": "Failed to load the skill list.",
  "skill.kind.directory": "Directory",
  "skill.kind.file": "File",
  "skill.actions.view": "View",
  "skill.actions.close": "Collapse",
  "skill.actions.reveal": "Open folder",
  "skill.actions.remove": "Delete",
  "skill.remove.title": "Delete skill",
  "skill.remove.confirm": 'Delete skill "{name}"? This removes its whole directory and cannot be undone.',
  "skill.remove.ok": 'Skill "{name}" deleted.',
  "skill.remove.failed": "Delete failed: {message}",
  "skill.reveal.failed": "Open failed: {message}",
  "detail.title": "Skill details",
  "detail.path": "Path",
  "detail.files": "Contents",
  "detail.content": "Body",
  "detail.loadFailed": "Failed to read the skill.",
  "detail.close": "Back to list",
  "notice.error": "Operation failed: {message}"
};
var NS = "skillPanel";
function fmt(template, params) {
  if (params === void 0) return template;
  return template.replace(/\{(\w+)\}/g, (whole, key) => params[key] ?? whole);
}

// src/client/styles.ts
var STYLE_ID = "dsh-skill-panel-style";
var cssText = `
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
  flex-wrap: nowrap;
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
  flex: none;
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
`;
function adoptStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID) !== null) return;
  const tag = document.createElement("style");
  tag.id = STYLE_ID;
  tag.dataset.plugin = "dsh-skill-panel";
  tag.textContent = cssText;
  document.head.appendChild(tag);
}

// src/client/SettingsSection.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
function skillsOf(overview, scope) {
  if (scope === "global") return overview.globalSkills;
  return overview.projectSkills[scope] ?? [];
}
function KindBadge(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh_skill_panel_badge", children: props.t(props.kind === "directory" ? "skill.kind.directory" : "skill.kind.file") });
}
function ScopeSelect(props) {
  const [open, setOpen] = (0, import_react.useState)(false);
  const rootRef = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    if (!open) return;
    const onPointerDown = (event) => {
      if (rootRef.current !== null && !rootRef.current.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);
  const current = props.options.find((option) => option.value === props.value);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh_skill_panel_dropdown", ref: rootRef, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "button",
      {
        type: "button",
        className: "dsh_skill_panel_dropdownButton",
        disabled: props.disabled,
        "aria-haspopup": "listbox",
        "aria-expanded": open,
        onClick: () => {
          setOpen((currentOpen) => !currentOpen);
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh_skill_panel_dropdownValue", children: current?.label ?? "\u2026" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "svg",
            {
              className: `dsh_skill_panel_dropdownChevron${open ? " dsh_skill_panel_dropdownChevronOpen" : ""}`,
              viewBox: "0 0 12 12",
              width: "12",
              height: "12",
              "aria-hidden": "true",
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3 4.5L6 7.5L9 4.5", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })
            }
          )
        ]
      }
    ),
    open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh_skill_panel_dropdownMenu", role: "listbox", "aria-label": current?.label ?? "", children: props.options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "button",
      {
        type: "button",
        role: "option",
        "aria-selected": option.value === props.value,
        className: `dsh_skill_panel_dropdownOption${option.value === props.value ? " dsh_skill_panel_dropdownOptionActive" : ""}`,
        onClick: () => {
          props.onChange(option.value);
          setOpen(false);
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh_skill_panel_dropdownOptionLabel", children: option.label }),
          option.meta === void 0 ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh_skill_panel_dropdownOptionMeta", children: option.meta })
        ]
      },
      option.value
    )) }) : null
  ] });
}
function SkillsSettingsSection({ api, t }) {
  const [overview, setOverview] = (0, import_react.useState)(null);
  const [loadError, setLoadError] = (0, import_react.useState)(null);
  const [scope, setScope] = (0, import_react.useState)("global");
  const [selected, setSelected] = (0, import_react.useState)(null);
  const [detail, setDetail] = (0, import_react.useState)(null);
  const [detailError, setDetailError] = (0, import_react.useState)(null);
  const [notice, setNotice] = (0, import_react.useState)(null);
  const load = (0, import_react.useCallback)(async () => {
    try {
      const next = await api.overview();
      setOverview(next);
      setLoadError(null);
      setScope((current) => {
        if (current === "global") return "global";
        if (next.projects.some((project) => project.id === current)) return current;
        return "global";
      });
    } catch (error) {
      setLoadError(error instanceof SkillPanelApiError ? error.message : String(error));
    }
  }, [api]);
  (0, import_react.useEffect)(() => {
    void load();
  }, [load]);
  const [pendingRemove, setPendingRemove] = (0, import_react.useState)(null);
  const removeDialogRef = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    const dialog = removeDialogRef.current;
    if (dialog === null) return;
    if (pendingRemove !== null) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [pendingRemove]);
  const openDetail = async (address) => {
    if (selected === address) {
      setSelected(null);
      setDetail(null);
      setDetailError(null);
      return;
    }
    setSelected(address);
    setDetail(null);
    setDetailError(null);
    try {
      setDetail(await api.read({ scope, address }));
    } catch (error) {
      setDetailError(error instanceof SkillPanelApiError ? error.message : String(error));
    }
  };
  const confirmRemove = async () => {
    const skill = pendingRemove;
    if (skill === null) return;
    setPendingRemove(null);
    try {
      await api.remove({ scope, address: skill.address });
      if (selected === skill.address) {
        setSelected(null);
        setDetail(null);
      }
      setNotice({ kind: "info", text: fmt(t("skill.remove.ok"), { name: skill.name }) });
      await load();
    } catch (error) {
      setNotice({ kind: "error", text: fmt(t("skill.remove.failed"), { message: error instanceof Error ? error.message : String(error) }) });
    }
  };
  const reveal = async (address) => {
    try {
      await api.reveal({ scope, ...address === void 0 ? {} : { address } });
    } catch (error) {
      setNotice({ kind: "error", text: fmt(t("skill.reveal.failed"), { message: error instanceof Error ? error.message : String(error) }) });
    }
  };
  const skills = overview === null ? [] : skillsOf(overview, scope);
  const projectsUnavailable = overview?.projectsUnavailable === true;
  const [query, setQuery] = (0, import_react.useState)("");
  const visibleSkills = (0, import_react.useMemo)(() => {
    const needle = query.trim().toLowerCase();
    if (needle.length === 0) return skills;
    return skills.filter(
      (skill) => skill.name.toLowerCase().includes(needle) || skill.address.toLowerCase().includes(needle) || skill.description.toLowerCase().includes(needle) || (skill.whenToUse ?? "").toLowerCase().includes(needle)
    );
  }, [skills, query]);
  const searching = query.trim().length > 0;
  const scopeOptions = overview === null ? [] : [
    {
      value: "global",
      label: t("scope.global"),
      meta: overview.globalSkills.length > 0 ? fmt(t("scope.meta.skills"), { count: String(overview.globalSkills.length) }) : overview.globalExists ? t("scope.meta.empty") : t("scope.meta.missing")
    },
    ...overview.projects.map((project) => {
      const count = overview.projectSkills[project.id]?.length ?? 0;
      return {
        value: project.id,
        label: project.title,
        meta: project.exists ? count > 0 ? fmt(t("scope.meta.skills"), { count: String(count) }) : t("scope.meta.empty") : t("scope.meta.missing")
      };
    })
  ];
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "dsh_skill_panel_section", "aria-labelledby": "dsh-skill-panel-title", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh_skill_panel_heading", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { id: "dsh-skill-panel-title", className: "dsh_skill_panel_title", children: t("title") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "dsh_skill_panel_subtitle", children: t("subtitle") })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh_skill_panel_toolbar", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        ScopeSelect,
        {
          value: scope,
          disabled: overview === null,
          options: scopeOptions,
          onChange: (nextScope) => {
            setScope(nextScope);
            setQuery("");
            setSelected(null);
            setDetail(null);
            setDetailError(null);
          }
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh_skill_panel_search", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "input",
          {
            className: "dsh_skill_panel_searchInput",
            type: "text",
            value: query,
            placeholder: t("search.placeholder"),
            "aria-label": t("search.placeholder"),
            disabled: overview === null,
            onChange: (event) => {
              setQuery(event.target.value);
            }
          }
        ),
        query.length === 0 ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            type: "button",
            className: "dsh_skill_panel_searchClear",
            "aria-label": t("search.clear"),
            onClick: () => {
              setQuery("");
            },
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { viewBox: "0 0 12 12", width: "12", height: "12", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M2.5 2.5L9.5 9.5M9.5 2.5L2.5 9.5", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }) })
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dsh_skill_panel_button", onClick: () => void reveal(), children: t("toolbar.revealRoot") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dsh_skill_panel_button", onClick: () => void load(), children: t("toolbar.refresh") })
    ] }),
    notice === null ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: `dsh_skill_panel_notice${notice.kind === "error" ? " dsh_skill_panel_noticeError" : ""}`, children: notice.text }),
    projectsUnavailable ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "dsh_skill_panel_notice", children: t("scope.projectsUnavailable") }) : null,
    detail !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh_skill_panel_card dsh_skill_panel_detail", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh_skill_panel_detailHead", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "dsh_skill_panel_detailName", children: detail.name }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "dsh_skill_panel_detailPath", children: detail.path })
      ] }),
      detail.files.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh_skill_panel_detailSection", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh_skill_panel_detailLabel", children: t("detail.files") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { className: "dsh_skill_panel_fileList", children: detail.files.map((file) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { className: "dsh_skill_panel_fileItem", children: file }, file)) })
      ] }) : null,
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh_skill_panel_detailSection", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh_skill_panel_detailLabel", children: t("detail.content") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", { className: "dsh_skill_panel_pre", children: detail.content })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh_skill_panel_formFooter", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dsh_skill_panel_button", onClick: () => {
        setSelected(null);
        setDetail(null);
        setDetailError(null);
      }, children: t("detail.close") }) })
    ] }) : null,
    detailError !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "dsh_skill_panel_notice dsh_skill_panel_noticeError", children: fmt(t("notice.error"), { message: detailError }) }) : null,
    loadError !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "dsh_skill_panel_notice dsh_skill_panel_noticeError", children: fmt(t("notice.error"), { message: loadError }) }) : null,
    overview !== null && detail === null ? visibleSkills.length === 0 ? searching ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "dsh_skill_panel_empty", children: fmt(t("search.empty"), { query: query.trim() }) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "dsh_skill_panel_empty", children: t("list.empty") }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { className: "dsh_skill_panel_list", children: visibleSkills.map((skill) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { className: "dsh_skill_panel_item", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh_skill_panel_itemMain", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh_skill_panel_itemName", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: skill.name }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindBadge, { t, kind: skill.kind })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "dsh_skill_panel_itemDesc", children: skill.description })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh_skill_panel_itemActions", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dsh_skill_panel_button", onClick: () => void openDetail(skill.address), children: selected === skill.address ? t("skill.actions.close") : t("skill.actions.view") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dsh_skill_panel_button", onClick: () => void reveal(skill.address), children: t("skill.actions.reveal") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            type: "button",
            className: "dsh_skill_panel_button dsh_skill_panel_buttonDanger",
            onClick: () => {
              setPendingRemove(skill);
            },
            children: t("skill.actions.remove")
          }
        )
      ] })
    ] }, skill.address)) }) : null,
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "dialog",
      {
        ref: removeDialogRef,
        className: "dsh_skill_panel_dialog",
        "aria-labelledby": "dsh-skill-panel-remove-title",
        onCancel: (event) => {
          event.preventDefault();
          setPendingRemove(null);
        },
        onClose: () => {
          setPendingRemove(null);
        },
        children: pendingRemove === null ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh_skill_panel_dialogBody", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { id: "dsh-skill-panel-remove-title", className: "dsh_skill_panel_dialogTitle", children: t("skill.remove.title") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "dsh_skill_panel_dialogText", children: fmt(t("skill.remove.confirm"), { name: pendingRemove.name }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh_skill_panel_dialogFooter", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dsh_skill_panel_button", autoFocus: true, onClick: () => {
              setPendingRemove(null);
            }, children: t("dialog.cancel") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "button",
              {
                type: "button",
                className: "dsh_skill_panel_button dsh_skill_panel_buttonDanger",
                onClick: () => {
                  void confirmRemove();
                },
                children: t("skill.actions.remove")
              }
            )
          ] })
        ] })
      }
    )
  ] });
}

// src/client/index.ts
var inject = ["connection", "slots", "locale"];
function apply(ctx) {
  adoptStyles();
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), "dsh-skill-panel: section dictionaries");
  const t = ctx.locale.bind(NS);
  const connection = ctx.get("connection");
  const api = createSkillPanelApi(connection.rpc);
  ctx.slots.inject("settings.section", () => ctx.slots.register({
    name: "settings.section",
    id: "skills",
    order: 40,
    label: () => t("nav"),
    locale: NS,
    inject: () => ({ api })
  }, SkillsSettingsSection));
}
return module.exports; } });
//# sourceMappingURL=client.js.map
