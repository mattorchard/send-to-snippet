import { resolve } from "path";
import { wrapError } from "./errorHelpers";
import { Logger } from "./Logger";

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

  removeAllContextMenus: async () =>
    new Promise<void>((resolve, reject) =>
      chrome.contextMenus.removeAll(wrapChromeError(resolve, reject))
    ),

  createContextMenu: async (menu: chrome.contextMenus.CreateProperties) =>
    new Promise<void>((resolve, reject) =>
      chrome.contextMenus.create(menu, wrapChromeError(resolve, reject))
    ),

  setAllContextMenus: async (menus: chrome.contextMenus.CreateProperties[]) => {
    await ChromeWrapper.removeAllContextMenus();
    for (const menu of menus) {
      await ChromeWrapper.createContextMenu(menu);
    }
  },

  addOnContextMenuClicked: (
    handler: (
      info: chrome.contextMenus.OnClickData,
      tab: chrome.tabs.Tab | undefined
    ) => void
  ) => chrome.contextMenus.onClicked.addListener(handler),

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

  createTab: async (url: string) => {
    chrome.tabs.create({ url });
  },
} as const;

// Chrome implementation is primary, so drives mocks and other implementations
type Extension = typeof ChromeWrapper;

const lgLogger = new Logger("LocalhostExtension");
const LocalhostExtension: Extension = {
  getUrl: (path: string) => `/${path}`,

  askUserToGrantPermissions: async () => true,

  hasAccess: async () => true,

  executeScript: async <T>(target: ScriptTarget, func: () => T) => {
    lgLogger.debug("Local requested to run script", {
      target,
      func,
    });
    return null;
  },

  removeAllContextMenus: async () =>
    lgLogger.debug("removeAllContextMenus stub"),

  createContextMenu: async (menu) =>
    lgLogger.debug("createContextMenu stub", menu),

  setAllContextMenus: async (menus) =>
    lgLogger.debug("setAllContextMenus stub", menus),

  addOnContextMenuClicked: (handler) =>
    lgLogger.debug("addOnContextMenuClicked stub", handler),

  createTab: async (url) => {
    self.open(url, "_blank");
  },
};

const shouldMock = self.location.host.startsWith("localhost");
export const extension = shouldMock ? LocalhostExtension : ChromeWrapper;
