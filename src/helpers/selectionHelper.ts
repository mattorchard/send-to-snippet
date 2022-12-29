import { ScriptingManager } from "./ScriptingManager";

export const getManualSelectionText = async (
  tabId: number | null,
  frameId: number | null
) => {
  if (!tabId) return null;

  const hasScriptAccess = await ScriptingManager.hasAccess();
  if (!hasScriptAccess) return null;

  try {
    return await ScriptingManager.executeScript(
      { tabId, frameId },
      getSelectedText
    );
  } catch (error) {
    console.warn("Unable to grab multiline input", error);
    return null;
  }
};

// START OF: INJECTED CODE
function getSelectedText() {
  return window.getSelection()?.toString() ?? "";
}
// END OF: INJECTED CODE
