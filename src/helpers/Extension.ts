import { wrapError } from "./errorHelpers";

export interface ScriptTarget {
  tabId: number;
  frameId: number | null;
}

class ChromeWrapper {
  private static readonly ROOT_FRAME_ID = 0;

  getUrl(path: string): string {
    return chrome.runtime.getURL(path);
  }

  askUserToGrantPermissions(
    permissions: chrome.permissions.Permissions
  ): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) =>
      chrome.permissions.request(permissions, (granted) =>
        chrome.runtime.lastError
          ? reject(wrapError(chrome.runtime.lastError))
          : resolve(granted)
      )
    );
  }

  hasAccess(permissions: chrome.permissions.Permissions): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) =>
      chrome.permissions.contains(permissions, (granted) =>
        chrome.runtime.lastError
          ? reject(wrapError(chrome.runtime.lastError))
          : resolve(granted)
      )
    );
  }

  async executeScript<T>(
    target: ScriptTarget,
    func: () => T
  ): Promise<T | null> {
    const allResults = await chrome.scripting.executeScript<[], T>({
      target: {
        tabId: target.tabId,
        frameIds: [target.frameId ?? ChromeWrapper.ROOT_FRAME_ID],
      },
      func,
    });
    // Todo: Ensure cast is safe
    const result = allResults?.[0]?.result as T;
    return result ?? null;
  }
}

type Extension = typeof ChromeWrapper["prototype"];

class LocalhostExtension implements Extension {
  constructor() {
    console.debug("Created LocalhostExtension");
  }

  getUrl(path: string) {
    return `/${path}`;
  }

  async askUserToGrantPermissions() {
    return true;
  }

  async hasAccess() {
    return true;
  }

  async executeScript<T>(target: ScriptTarget, func: () => T) {
    console.debug("Local requested to run script", {
      target,
      func,
    });
    return null;
  }
}

const shouldMock = self.location.host.startsWith("localhost");
export const extension = shouldMock
  ? new LocalhostExtension()
  : new ChromeWrapper();
