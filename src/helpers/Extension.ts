import { resolve } from "path";
import { wrapError } from "./errorHelpers";

export interface ScriptTarget {
  tabId: number;
  frameId: number | null;
}

const CHROME_ROOT_FRAME_ID = 0;

const wrapChromeError =
  <T>(resolve: (value: T) => void, reject: (error: Error) => void) =>
  (value: T) =>
    chrome.runtime.lastError
      ? reject(wrapError(chrome.runtime.lastError))
      : resolve(value);

const ChromeWrapper = {
  getUrl: (path: string): string => chrome.runtime.getURL(path),

  askUserToGrantPermissions: (permissions: chrome.permissions.Permissions) =>
    new Promise<boolean>((resolve, reject) =>
      chrome.permissions.request(permissions, wrapChromeError(resolve, reject))
    ),

  hasAccess: (permissions: chrome.permissions.Permissions) =>
    new Promise<boolean>((resolve, reject) =>
      chrome.permissions.contains(permissions, wrapChromeError(resolve, reject))
    ),

  executeScript: async <T>(
    target: ScriptTarget,
    func: () => T
  ): Promise<T | null> => {
    const allResults = await chrome.scripting.executeScript<[], T>({
      target: {
        tabId: target.tabId,
        frameIds: [target.frameId ?? CHROME_ROOT_FRAME_ID],
      },
      func,
    });
    // Todo: Ensure cast is safe
    const result = allResults?.[0]?.result as T;
    return result ?? null;
  },
} as const;

// Chrome implementation is primary, so drives mocks and other implementations
type Extension = typeof ChromeWrapper;

const LocalhostExtension: Extension = {
  getUrl: (path: string) => `/${path}`,

  askUserToGrantPermissions: async () => true,

  hasAccess: async () => true,

  executeScript: async <T>(target: ScriptTarget, func: () => T) => {
    console.debug("Local requested to run script", {
      target,
      func,
    });
    return null;
  },
};

const shouldMock = self.location.host.startsWith("localhost");
export const extension = shouldMock ? LocalhostExtension : ChromeWrapper;
