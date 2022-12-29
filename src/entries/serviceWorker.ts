import { createId } from "../helpers/idHelpers";
import { LinkHrefs } from "../helpers/LinkHrefs";
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

// function getSelectedText() {
//   return window.getSelection()?.toString() ?? "";
// }

// const getManualSelectionText = async (
//   tabId: number | null,
//   frameId: number | null
// ) => {
//   if (!tabId) return null;

//   const hasScriptAccess = await ScriptingManager.hasAccess();
//   if (!hasScriptAccess) return null;

//   try {
//     return await ScriptingManager.executeScript(
//       { tabId, frameId },
//       getSelectedText
//     );
//   } catch (error) {
//     console.warn("Unable to grab multiline input", error);
//     return null;
//   }
// };

// chrome.contextMenus.onClicked.addListener(
//   async (baseContextMenuInfo, sourceTab) => {
//     console.log("Context menu clicked", { baseContextMenuInfo, sourceTab });

//     const targetId = createId();
//     await mailboxRepository.upsertDrop({
//       targetId,
//       sourceTabId: sourceTab?.id ?? null,
//       contextMenuInfo: {
//         ...baseContextMenuInfo,
//         manualSelectionText: await getManualSelectionText(
//           sourceTab?.id ?? null,
//           baseContextMenuInfo.frameId ?? null
//         ),
//       },
//     });
//     await chrome.tabs.create({
//       url: LinkHrefs.snippetTarget(targetId),
//     });
//   }
// );

export default {};
