import { mailboxRepository } from "../helpers/MailboxRepository";
import { ScriptingManager } from "../helpers/ScriptingManager";

console.log("Hello from S2S Service worker", new Date().toTimeString());

// Todo: Move all context menu management out of entrypoint
chrome.contextMenus.removeAll();
chrome.contextMenus.create(
  {
    contexts: ["all"],
    id: "S2S",
    title: "Send 2 Snippet",
  },
  () =>
    chrome.runtime.lastError
      ? console.error(
          "S2S may have failed to create context menu",
          chrome.runtime.lastError
        )
      : console.log("S2S created context menu")
);

function getSelectedText() {
  return window.getSelection()?.toString() ?? "";
}

chrome.contextMenus.onClicked.addListener(
  async (baseContextMenuInfo, sourceTab) => {
    console.log("Context menu clicked", { baseContextMenuInfo, sourceTab });

    const snippetsTab = await chrome.tabs.create({
      url: chrome.runtime.getURL("snippets.html"),
    });
    const { id: snippetsTabId } = snippetsTab;
    if (!snippetsTabId)
      throw new Error(`Created tab for snippets page has no ID`);

    let manualSelectionText = null;
    if (sourceTab?.id && (await ScriptingManager.hasAccess())) {
      try {
        manualSelectionText = await ScriptingManager.executeScript(
          { tabId: sourceTab.id, frameId: baseContextMenuInfo.frameId ?? null },
          getSelectedText
        );
      } catch (error) {
        console.warn("Unable to grab multiline input", error);
      }
    }

    const contextMenuInfo = { ...baseContextMenuInfo, manualSelectionText };

    await mailboxRepository.upsertDrop({
      contextMenuInfo,
      sourceTabId: sourceTab?.id ?? null,
      targetTabId: snippetsTab.id!,
    });
  }
);

export default {};
