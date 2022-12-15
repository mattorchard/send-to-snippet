import { ScriptingManager } from "../helpers/ScriptingManager";
import { ContextMenuInfo } from "../types/Domain";

console.log("Hello from S2S Service worker", new Date().toTimeString());

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

const mailbox = new Map<number, ContextMenuInfo>();
const MAX_MAILBOX_SIZE = 1_000;

function getSelectedText() {
  return window.getSelection()?.toString() ?? "";
}

chrome.contextMenus.onClicked.addListener(
  async (contextMenuInfo, sourceTab) => {
    console.log("Context menu clicked", { contextMenuInfo, sourceTab });

    const snippetsTab = await chrome.tabs.create({
      url: chrome.runtime.getURL("snippets.html"),
    });
    const { id: snippetsTabId } = snippetsTab;
    if (!snippetsTabId)
      throw new Error(`Created tab for snippets page has no ID`);

    let manualSelectionText = null;
    if (sourceTab?.id && (await ScriptingManager.hasAccess())) {
      manualSelectionText = await ScriptingManager.executeScript(
        sourceTab.id,
        getSelectedText
      );
    }

    mailbox.set(snippetsTabId, { ...contextMenuInfo, manualSelectionText });
  }
);

chrome.runtime.onMessage.addListener((message, sender, sendReply) => {
  console.debug("Service worker received message", {
    message,
    sender,
  });
  const senderTabId = sender.tab?.id as number;
  const payload = mailbox.get(senderTabId);
  if (!payload) throw new Error(`No messages pending for tab ${senderTabId}`);

  console.log(`Found message pending for tab ${senderTabId}`);
  sendReply(payload);
  if (mailbox.size > MAX_MAILBOX_SIZE) mailbox.delete(senderTabId);
});

export default {};
