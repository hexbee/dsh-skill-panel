/**
 * Client-side RPC face for the Host `/skill-panel` channel: one typed method
 * per endpoint, unwrapping the Connection `RpcResult` envelope and folding
 * the error branch into a thrown `SkillPanelApiError`.
 */
import type { ClientConnectionRpc } from '@deepseek-ai/dsh-client-connection/client';
import type { Overview, ReadRequest, RemoveRequest, RevealRequest, SkillDetail, SkillPanelErrorCode } from '../contract.ts';
/** One wire failure folded into an exception for the section UI. */
export declare class SkillPanelApiError extends Error {
    readonly code: SkillPanelErrorCode;
    constructor(code: SkillPanelErrorCode, message: string);
}
/** The panel's business face, injected into the settings section. */
export interface SkillPanelApi {
    /** Everything the panel lists: global root + registered workspaces. */
    overview(): Promise<Overview>;
    /** One skill's frontmatter, body, and directory listing. */
    read(request: ReadRequest): Promise<SkillDetail>;
    /** Remove one skill (directory or flat file). */
    remove(request: RemoveRequest): Promise<{
        removed: boolean;
    }>;
    /** Reveal the root or one skill in the platform file manager. */
    reveal(request: RevealRequest): Promise<{
        path: string;
    }>;
}
/**
 * Build the API face over a Connection rpc caller.
 * @param rpc - the browser Connection service's rpc caller.
 * @returns the typed panel API.
 */
export declare function createSkillPanelApi(rpc: ClientConnectionRpc): SkillPanelApi;
