import { extension } from "./Extension";

const scriptingPermissions = ["scripting"];

export const ScriptingManager = {
  askUserToGrantAccess: () =>
    extension.askUserToGrantPermissions({ permissions: scriptingPermissions }),

  hasAccess: () => extension.hasAccess({ permissions: scriptingPermissions }),

  executeScript: async <T>(tabId: number, func: () => T) =>
    extension.executeScript(tabId, func),
};
