import { wrapError } from "./errorHelpers";

class ChromeWrapper {
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

  // Todo: Add Frame ID
  async executeScript<T>(tabId: number, func: () => T): Promise<T | null> {
    const allResults = await chrome.scripting.executeScript<[], T>({
      target: {
        tabId,
      },
      func,
    });
    // Todo: Ensure cast is safe
    const result = allResults?.[0]?.result as T;
    return result ?? null;
  }

  async getCurrentTabId() {
    const tab = await chrome.tabs.getCurrent();
    return tab?.id ?? null;
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

  async executeScript<T>(tabId: number, func: () => T) {
    console.debug("Local requested to run script", {
      tabId,
      func,
    });
    return null;
  }

  async getCurrentTabId() {
    return null;
  }
}

const shouldMock = self.location.host.startsWith("localhost");
export const extension = shouldMock
  ? new LocalhostExtension()
  : new ChromeWrapper();
