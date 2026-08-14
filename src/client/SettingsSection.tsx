/**
 * The settings-page section for skill management: a scope picker (global
 * `~/.agents/skills` or one registered workspace's `.agents/skills`), a live
 * search over the skill list with view/reveal/remove actions, and an inline
 * detail pane. All data arrives through the injected Host API; UI state stays
 * component-local.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { Overview, ScopeId, SkillDetail, SkillView } from '../contract.ts'
import { SkillPanelApiError, type SkillPanelApi } from './api.ts'
import { NS, fmt, type SkillPanelKey } from './locales.ts'

/** The business face this section consumes. */
export interface SkillsSectionInjected {
  api: SkillPanelApi
}

/** Full section props: runtime share + injected face + the locale seat. */
export type SkillsSectionProps = PropsRuntime<'settings.section'> & InjectFace<SkillsSectionInjected> & PropsLocale<typeof NS>

/** The skills belonging to the active scope. */
function skillsOf(overview: Overview, scope: ScopeId): readonly SkillView[] {
  if (scope === 'global') return overview.globalSkills
  return overview.projectSkills[scope] ?? []
}

/** One list-row badge: directory bundle or flat file. */
function KindBadge(props: { t: (key: SkillPanelKey) => string; kind: 'directory' | 'file' }): JSX.Element {
  return (
    <span className="dsh_skill_panel_badge">
      {props.t(props.kind === 'directory' ? 'skill.kind.directory' : 'skill.kind.file')}
    </span>
  )
}

/** One selectable scope option. */
interface ScopeOption {
  readonly value: ScopeId
  readonly label: string
  readonly meta?: string
}

/**
 * Custom dropdown for the scope picker. Replaces the native `<select>`, whose
 * popup panel is OS-drawn and never aligns with the control: this one renders
 * its own menu, left-aligned and at least as wide as the trigger button, with
 * theme tokens in both light and dark modes. Closes on outside click, Escape,
 * and selection.
 */
function ScopeSelect(props: {
  value: ScopeId
  disabled: boolean
  options: readonly ScopeOption[]
  onChange: (value: ScopeId) => void
}): JSX.Element {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent): void => {
      if (rootRef.current !== null && !rootRef.current.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const current = props.options.find((option) => option.value === props.value)

  return (
    <div className="dsh_skill_panel_dropdown" ref={rootRef}>
      <button
        type="button"
        className="dsh_skill_panel_dropdownButton"
        disabled={props.disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => { setOpen((currentOpen) => !currentOpen) }}
      >
        <span className="dsh_skill_panel_dropdownValue">{current?.label ?? '…'}</span>
        <svg
          className={`dsh_skill_panel_dropdownChevron${open ? ' dsh_skill_panel_dropdownChevronOpen' : ''}`}
          viewBox="0 0 12 12"
          width="12"
          height="12"
          aria-hidden="true"
        >
          <path d="M3 4.5L6 7.5L9 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open ? (
        <div className="dsh_skill_panel_dropdownMenu" role="listbox" aria-label={current?.label ?? ''}>
          {props.options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === props.value}
              className={`dsh_skill_panel_dropdownOption${option.value === props.value ? ' dsh_skill_panel_dropdownOptionActive' : ''}`}
              onClick={() => {
                props.onChange(option.value)
                setOpen(false)
              }}
            >
              <span className="dsh_skill_panel_dropdownOptionLabel">{option.label}</span>
              {option.meta === undefined ? null : <span className="dsh_skill_panel_dropdownOptionMeta">{option.meta}</span>}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

/**
 * Render the section.
 * @param props - runtime share, the injected api, and `t`.
 * @returns the section element tree.
 */
export function SkillsSettingsSection({ api, t }: SkillsSectionProps): JSX.Element {
  const [overview, setOverview] = useState<Overview | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [scope, setScope] = useState<ScopeId>('global')
  const [selected, setSelected] = useState<string | null>(null)
  const [detail, setDetail] = useState<SkillDetail | null>(null)
  const [detailError, setDetailError] = useState<string | null>(null)
  const [notice, setNotice] = useState<{ kind: 'info' | 'error'; text: string } | null>(null)

  const load = useCallback(async (): Promise<void> => {
    try {
      const next = await api.overview()
      setOverview(next)
      setLoadError(null)
      setScope((current) => {
        if (current === 'global') return 'global'
        if (next.projects.some((project) => project.id === current)) return current
        return 'global'
      })
    } catch (error) {
      setLoadError(error instanceof SkillPanelApiError ? error.message : String(error))
    }
  }, [api])

  useEffect(() => { void load() }, [load])

  /** The skill awaiting delete confirmation (drives the dialog). */
  const [pendingRemove, setPendingRemove] = useState<SkillView | null>(null)
  const removeDialogRef = useRef<HTMLDialogElement>(null)

  // Drive the native dialog from state: showModal on request, close on clear.
  useEffect(() => {
    const dialog = removeDialogRef.current
    if (dialog === null) return
    if (pendingRemove !== null) {
      if (!dialog.open) dialog.showModal()
    } else if (dialog.open) {
      dialog.close()
    }
  }, [pendingRemove])

  const openDetail = async (address: string): Promise<void> => {
    if (selected === address) {
      setSelected(null)
      setDetail(null)
      setDetailError(null)
      return
    }
    setSelected(address)
    setDetail(null)
    setDetailError(null)
    try {
      setDetail(await api.read({ scope, address }))
    } catch (error) {
      setDetailError(error instanceof SkillPanelApiError ? error.message : String(error))
    }
  }

  /** Execute the confirmed removal. */
  const confirmRemove = async (): Promise<void> => {
    const skill = pendingRemove
    if (skill === null) return
    setPendingRemove(null)
    try {
      await api.remove({ scope, address: skill.address })
      if (selected === skill.address) {
        setSelected(null)
        setDetail(null)
      }
      setNotice({ kind: 'info', text: fmt(t('skill.remove.ok'), { name: skill.name }) })
      await load()
    } catch (error) {
      setNotice({ kind: 'error', text: fmt(t('skill.remove.failed'), { message: error instanceof Error ? error.message : String(error) }) })
    }
  }

  const reveal = async (address?: string): Promise<void> => {
    try {
      await api.reveal({ scope, ...address === undefined ? {} : { address } })
    } catch (error) {
      setNotice({ kind: 'error', text: fmt(t('skill.reveal.failed'), { message: error instanceof Error ? error.message : String(error) }) })
    }
  }

  const skills = overview === null ? [] : skillsOf(overview, scope)
  const projectsUnavailable = overview?.projectsUnavailable === true

  /** The live search query over the active scope's skill list. */
  const [query, setQuery] = useState('')

  /** Skills matching the query (name, address, description, whenToUse). */
  const visibleSkills = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (needle.length === 0) return skills
    return skills.filter((skill) =>
      skill.name.toLowerCase().includes(needle)
      || skill.address.toLowerCase().includes(needle)
      || skill.description.toLowerCase().includes(needle)
      || (skill.whenToUse ?? '').toLowerCase().includes(needle)
    )
  }, [skills, query])

  const searching = query.trim().length > 0

  /** The scope picker's options: the global root, then each registered workspace. */
  const scopeOptions: readonly ScopeOption[] = overview === null ? [] : [
    {
      value: 'global',
      label: t('scope.global'),
      meta: overview.globalSkills.length > 0
        ? fmt(t('scope.meta.skills'), { count: String(overview.globalSkills.length) })
        : overview.globalExists ? t('scope.meta.empty') : t('scope.meta.missing'),
    },
    ...overview.projects.map((project) => {
      const count = overview.projectSkills[project.id]?.length ?? 0
      return {
        value: project.id,
        label: project.title,
        meta: project.exists
          ? count > 0 ? fmt(t('scope.meta.skills'), { count: String(count) }) : t('scope.meta.empty')
          : t('scope.meta.missing'),
      }
    }),
  ]

  return (
    <section className="dsh_skill_panel_section" aria-labelledby="dsh-skill-panel-title">
      <div className="dsh_skill_panel_heading">
        <h2 id="dsh-skill-panel-title" className="dsh_skill_panel_title">{t('title')}</h2>
        <p className="dsh_skill_panel_subtitle">{t('subtitle')}</p>
      </div>

      <div className="dsh_skill_panel_toolbar">
        <ScopeSelect
          value={scope}
          disabled={overview === null}
          options={scopeOptions}
          onChange={(nextScope) => {
            setScope(nextScope)
            setQuery('')
            setSelected(null)
            setDetail(null)
            setDetailError(null)
          }}
        />
        <div className="dsh_skill_panel_search">
          <input
            className="dsh_skill_panel_searchInput"
            type="text"
            value={query}
            placeholder={t('search.placeholder')}
            aria-label={t('search.placeholder')}
            disabled={overview === null}
            onChange={(event) => { setQuery(event.target.value) }}
          />
          {query.length === 0 ? null : (
            <button
              type="button"
              className="dsh_skill_panel_searchClear"
              aria-label={t('search.clear')}
              onClick={() => { setQuery('') }}
            >
              <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
                <path d="M2.5 2.5L9.5 9.5M9.5 2.5L2.5 9.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
        <button type="button" className="dsh_skill_panel_button" onClick={() => void reveal()}>
          {t('toolbar.revealRoot')}
        </button>
        <button type="button" className="dsh_skill_panel_button" onClick={() => void load()}>
          {t('toolbar.refresh')}
        </button>
      </div>

      {notice === null ? null : (
        <p className={`dsh_skill_panel_notice${notice.kind === 'error' ? ' dsh_skill_panel_noticeError' : ''}`}>{notice.text}</p>
      )}

      {projectsUnavailable ? <p className="dsh_skill_panel_notice">{t('scope.projectsUnavailable')}</p> : null}

      {detail !== null ? (
        <div className="dsh_skill_panel_card dsh_skill_panel_detail">
          <div className="dsh_skill_panel_detailHead">
            <h3 className="dsh_skill_panel_detailName">{detail.name}</h3>
            <p className="dsh_skill_panel_detailPath">{detail.path}</p>
          </div>
          {detail.files.length > 0 ? (
            <div className="dsh_skill_panel_detailSection">
              <span className="dsh_skill_panel_detailLabel">{t('detail.files')}</span>
              <ul className="dsh_skill_panel_fileList">
                {detail.files.map((file) => <li key={file} className="dsh_skill_panel_fileItem">{file}</li>)}
              </ul>
            </div>
          ) : null}
          <div className="dsh_skill_panel_detailSection">
            <span className="dsh_skill_panel_detailLabel">{t('detail.content')}</span>
            <pre className="dsh_skill_panel_pre">{detail.content}</pre>
          </div>
          <div className="dsh_skill_panel_formFooter">
            <button type="button" className="dsh_skill_panel_button" onClick={() => { setSelected(null); setDetail(null); setDetailError(null) }}>
              {t('detail.close')}
            </button>
          </div>
        </div>
      ) : null}

      {detailError !== null ? (
        <p className="dsh_skill_panel_notice dsh_skill_panel_noticeError">{fmt(t('notice.error'), { message: detailError })}</p>
      ) : null}

      {loadError !== null ? (
        <p className="dsh_skill_panel_notice dsh_skill_panel_noticeError">{fmt(t('notice.error'), { message: loadError })}</p>
      ) : null}

      {overview !== null && detail === null ? (
        visibleSkills.length === 0 ? (
          searching ? (
            <p className="dsh_skill_panel_empty">{fmt(t('search.empty'), { query: query.trim() })}</p>
          ) : (
            <p className="dsh_skill_panel_empty">{t('list.empty')}</p>
          )
        ) : (
          <ul className="dsh_skill_panel_list">
            {visibleSkills.map((skill) => (
              <li key={skill.address} className="dsh_skill_panel_item">
                <div className="dsh_skill_panel_itemMain">
                  <div className="dsh_skill_panel_itemName">
                    <span>{skill.name}</span>
                    <KindBadge t={t} kind={skill.kind} />
                  </div>
                  <p className="dsh_skill_panel_itemDesc">{skill.description}</p>
                </div>
                <div className="dsh_skill_panel_itemActions">
                  <button type="button" className="dsh_skill_panel_button" onClick={() => void openDetail(skill.address)}>
                    {selected === skill.address ? t('skill.actions.close') : t('skill.actions.view')}
                  </button>
                  <button type="button" className="dsh_skill_panel_button" onClick={() => void reveal(skill.address)}>
                    {t('skill.actions.reveal')}
                  </button>
                  <button
                    type="button"
                    className="dsh_skill_panel_button dsh_skill_panel_buttonDanger"
                    onClick={() => { setPendingRemove(skill) }}
                  >
                    {t('skill.actions.remove')}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )
      ) : null}

      <dialog
        ref={removeDialogRef}
        className="dsh_skill_panel_dialog"
        aria-labelledby="dsh-skill-panel-remove-title"
        onCancel={(event) => {
          // Esc must clear the pending state instead of leaving a stuck dialog.
          event.preventDefault()
          setPendingRemove(null)
        }}
        onClose={() => { setPendingRemove(null) }}
      >
        {pendingRemove === null ? null : (
          <div className="dsh_skill_panel_dialogBody">
            <h3 id="dsh-skill-panel-remove-title" className="dsh_skill_panel_dialogTitle">{t('skill.remove.title')}</h3>
            <p className="dsh_skill_panel_dialogText">{fmt(t('skill.remove.confirm'), { name: pendingRemove.name })}</p>
            <div className="dsh_skill_panel_dialogFooter">
              <button type="button" className="dsh_skill_panel_button" autoFocus onClick={() => { setPendingRemove(null) }}>
                {t('dialog.cancel')}
              </button>
              <button
                type="button"
                className="dsh_skill_panel_button dsh_skill_panel_buttonDanger"
                onClick={() => { void confirmRemove() }}
              >
                {t('skill.actions.remove')}
              </button>
            </div>
          </div>
        )}
      </dialog>
    </section>
  )
}
