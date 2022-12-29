import { extension, ScriptTarget } from "./Extension";

const scriptingPermissions = ["scripting"];

export const ScriptingManager = {
  askUserToGrantAccess: () =>
    extension.askUserToGrantPermissions({ permissions: scriptingPermissions }),

  hasAccess: () => extension.hasAccess({ permissions: scriptingPermissions }),

  executeScript: async <T>(target: ScriptTarget, func: () => T) =>
    extension.executeScript(target, func),
};
