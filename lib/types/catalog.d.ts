import { type SkillDetail, type SkillView } from './contract.ts';
/** Frontmatter parse outcome for one skill body. */
export interface ParsedSkill {
    readonly name: string;
    readonly description: string;
    readonly whenToUse?: string;
    readonly frontmatter: Readonly<Record<string, unknown>>;
    readonly content: string;
}
/**
 * Parse `---` frontmatter from a skill body. Mirrors the harness parser's
 * acceptance rule: frontmatter is required and must carry a kebab-case `name`
 * and a `description`; anything else (missing block, YAML failure, invalid
 * name) means the entry is not a skill.
 * @param raw - raw file text.
 * @returns the parsed skill, or undefined when the entry is not a valid skill.
 */
export declare function parseSkillBody(raw: string): ParsedSkill | undefined;
/**
 * Discover the skills inside one managed root. Directory bundles win over a
 * same-named flat file; entries that fail frontmatter validation are skipped
 * silently (they are simply not skills).
 * @param skillsRoot - absolute managed root.
 * @returns skill views sorted by address.
 */
export declare function scanSkillsRoot(skillsRoot: string): Promise<readonly SkillView[]>;
/**
 * Read one skill in full.
 * @param skillsRoot - absolute managed root.
 * @param address - skill address (directory name or flat file name).
 * @returns the skill detail, or undefined when it does not exist or is invalid.
 */
export declare function readSkill(skillsRoot: string, address: string): Promise<SkillDetail | undefined>;
/**
 * Remove one skill (its whole directory for bundles, the file for flat skills).
 * @param skillsRoot - absolute managed root.
 * @param address - skill address.
 * @returns true when something was removed, false when absent.
 */
export declare function removeSkill(skillsRoot: string, address: string): Promise<boolean>;
/** Resolve the path a reveal should open for a scope/address pair. */
export declare function revealTarget(skillsRoot: string, address?: string): Promise<string>;
