const permissions = ["scripting"];

export const ScriptingManager = {
  askUserToGrantAccess: () =>
    new Promise<boolean>((resolve) =>
      chrome.permissions.request(
        {
          permissions,
        },
        (granted) => resolve(granted)
      )
    ),

  hasAccess: () =>
    new Promise<boolean>((resolve) =>
      chrome?.permissions
        ? chrome.permissions.contains({ permissions }, (granted) =>
            resolve(granted)
          )
        : resolve(true)
    ),

  executeScript: async <T>(tabId: number, func: () => T) => {
    const allResults = await chrome.scripting.executeScript({
      target: {
        tabId,
      },
      func,
    });
    return allResults?.[0]?.result ?? null;
  },
};
